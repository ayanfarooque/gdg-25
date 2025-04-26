const Classroom = require('../models/Classroom.js');
const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({});
  res.status(200).json({
    success: true,
    data: students
  });
});

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({});
  res.status(200).json({
    success: true,
    data: teachers
  });
});

// @desc    Get all classrooms with pagination and search
// @route   GET /api/admin/classrooms
// @access  Private/Admin
const getAllClassrooms = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const searchQuery = req.query.search 
    ? { 
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { teacher: { $regex: req.query.search, $options: 'i' } },
          { subject: { $regex: req.query.search, $options: 'i' } }
        ],
        isActive: true
      } 
    : { isActive: true };

  const [classrooms, total] = await Promise.all([
    Classroom.find(searchQuery)
      .populate('teacher', 'name email')
      .populate('students', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Classroom.countDocuments(searchQuery)
  ]);

  res.json({
    success: true,
    count: classrooms.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: classrooms
  });
});

// @desc    Get classroom details
// @route   GET /api/admin/classrooms/:id
// @access  Private/Admin
const getClassroomById = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id)
    .populate('teacher', 'name email')
    .populate('students', 'name email performance')
    .populate('assignments', 'title dueDate averageScore completionRate');

  if (!classroom || !classroom.isActive) {
    res.status(404);
    throw new Error('Classroom not found');
  }

  res.json({
    success: true,
    data: classroom
  });
});

// @desc    Create new classroom
// @route   POST /api/admin/classrooms
// @access  Private/Admin
const createClassroom = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('subject').isIn(["Math", "Science", "History", "English", "Art", "Music", "Physical Education", "Computer Science", "Foreign Language", "Other"])
    .withMessage('Invalid subject'),
  body('gradeLevel').isIn(["Kindergarten", "Elementary", "Middle School", "High School", "College", "Other"])
    .withMessage('Invalid grade level'),
  body('teacher').isMongoId().withMessage('Invalid teacher ID'),
  body('academicYear').matches(/^\d{4}-\d{4}$/).withMessage('Academic year must be in format YYYY-YYYY'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const generateCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      return Array.from({ length: 6 }, () => 
        chars.charAt(Math.floor(Math.random() * chars.length))
        .join(''));
    };

    let code;
    do {
      code = generateCode();
    } while (await Classroom.findOne({ code }));

    const classroom = new Classroom({
      ...req.body,
      code,
      createdBy: req.admin._id
    });

    await classroom.save();

    res.status(201).json({
      success: true,
      data: classroom
    });
  })
];

// @desc    Update classroom
// @route   PUT /api/admin/classrooms/:id
// @access  Private/Admin
const updateClassroom = [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('subject').optional().isIn(["Math", "Science", "History", "English", "Art", "Music", "Physical Education", "Computer Science", "Foreign Language", "Other"])
    .withMessage('Invalid subject'),
  body('gradeLevel').optional().isIn(["Kindergarten", "Elementary", "Middle School", "High School", "College", "Other"])
    .withMessage('Invalid grade level'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const classroom = await Classroom.findById(req.params.id);
    if (!classroom || !classroom.isActive) {
      res.status(404);
      throw new Error('Classroom not found');
    }

    const { code, teacher, academicYear, ...updateData } = req.body;
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedClassroom
    });
  })
];

// @desc    Delete classroom (soft delete)
// @route   DELETE /api/admin/classrooms/:id
// @access  Private/Admin
const deleteClassroom = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);
  
  if (!classroom || !classroom.isActive) {
    res.status(404);
    throw new Error('Classroom not found');
  }

  classroom.isActive = false;
  await classroom.save();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Get students not in classroom
// @route   GET /api/admin/classrooms/:id/available-students
// @access  Private/Admin
const getAvailableStudents = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id);
  if (!classroom || !classroom.isActive) {
    res.status(404);
    throw new Error('Classroom not found');
  }

  const searchQuery = req.query.search 
    ? {
        $and: [
          { _id: { $nin: classroom.students } },
          {
            $or: [
              { name: { $regex: req.query.search, $options: 'i' } },
              { grade: { $regex: req.query.search, $options: 'i' } }
            ]
          }
        ]
      }
    : { _id: { $nin: classroom.students } };

  const students = await Student.find(searchQuery)
    .select('name grade')
    .limit(20);

  res.json({
    success: true,
    data: students
  });
});

// @desc    Add student to classroom
// @route   POST /api/admin/classrooms/:id/students
// @access  Private/Admin
const addStudentToClassroom = [
  body('studentId').isMongoId().withMessage('Invalid student ID'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const [classroom, student] = await Promise.all([
      Classroom.findById(req.params.id),
      Student.findById(req.body.studentId)
    ]);

    if (!classroom || !classroom.isActive) {
      res.status(404);
      throw new Error('Classroom not found');
    }

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    if (classroom.students.includes(req.body.studentId)) {
      res.status(400);
      throw new Error('Student already in classroom');
    }

    if (classroom.students.length >= 50) {
      res.status(400);
      throw new Error('Classroom has reached maximum capacity (50 students)');
    }

    await Promise.all([
      Classroom.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { students: req.body.studentId } },
        { new: true }
      ),
      Student.findByIdAndUpdate(
        req.body.studentId,
        { $addToSet: { classrooms: req.params.id } },
        { new: true }
      )
    ]);

    res.json({
      success: true,
      data: {
        addedStudent: {
          id: student._id,
          name: student.name,
          grade: student.grade
        }
      }
    });
  })
];

// @desc    Remove student from classroom
// @route   DELETE /api/admin/classrooms/:id/students/:studentId
// @access  Private/Admin
const removeStudentFromClassroom = asyncHandler(async (req, res) => {
  const [classroom, student] = await Promise.all([
    Classroom.findById(req.params.id),
    Student.findById(req.params.studentId)
  ]);

  if (!classroom || !classroom.isActive) {
    res.status(404);
    throw new Error('Classroom not found');
  }

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  if (!classroom.students.includes(req.params.studentId)) {
    res.status(400);
    throw new Error('Student not found in classroom');
  }

  await Promise.all([
    Classroom.findByIdAndUpdate(
      req.params.id,
      { $pull: { students: req.params.studentId } },
      { new: true }
    ),
    Student.findByIdAndUpdate(
      req.params.studentId,
      { $pull: { classrooms: req.params.id } },
      { new: true }
    )
  ]);

  res.json({
    success: true,
    data: {
      removedStudentId: req.params.studentId
    }
  });
});

// @desc    Get classroom performance data
// @route   GET /api/admin/classrooms/:id/performance
// @access  Private/Admin
const getClassroomPerformance = asyncHandler(async (req, res) => {
  const classroom = await Classroom.findById(req.params.id)
    .populate({
      path: 'students',
      select: 'name performance',
      options: { sort: { 'performance.averageScore': -1 } }
    })
    .populate({
      path: 'assignments',
      select: 'title dueDate averageScore completionRate',
      options: { sort: { dueDate: -1 }, limit: 5 }
    });

  if (!classroom || !classroom.isActive) {
    res.status(404);
    throw new Error('Classroom not found');
  }

  const calculateMetrics = () => {
    if (classroom.students.length === 0) {
      return {
        averageScore: 0,
        assignmentsCompleted: 0,
        topStudents: []
      };
    }

    const totalScore = classroom.students.reduce((sum, student) => {
      return sum + (student.performance?.averageScore || 0);
    }, 0);

    const averageScore = Math.round(totalScore / classroom.students.length);
    
    const topStudents = classroom.students.slice(0, 3).map(student => ({
      id: student._id,
      name: student.name,
      score: student.performance?.averageScore || 0
    }));

    return {
      averageScore,
      assignmentsCompleted: classroom.assignments.length,
      topStudents,
      recentAssignments: classroom.assignments
    };
  };

  res.json({
    success: true,
    data: calculateMetrics()
  });
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const [classroomCount, activeClassrooms, recentClassrooms] = await Promise.all([
    Classroom.countDocuments({ isActive: true }),
    Classroom.find({ isActive: true })
      .sort({ students: -1 })
      .limit(5)
      .populate('teacher', 'name'),
    Classroom.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('teacher', 'name')
  ]);

  res.json({
    success: true,
    data: {
      totalClassrooms: classroomCount,
      topClassrooms: activeClassrooms,
      recentClassrooms
    }
  });
});

module.exports = {
  getAllStudents,
  getAllTeachers,
  getAllClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getAvailableStudents,
  addStudentToClassroom,
  removeStudentFromClassroom,
  getClassroomPerformance,
  getAdminDashboardStats
};