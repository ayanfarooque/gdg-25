const Classroom = require('../models/Classroom.js');
const AssignAssignment = require('../models/AssignAssignment')
const Student = require('../models/Student.js')
const Teacher = require('../models/Teacher.js');

// exports.createClassroom = async(req,res) => {
//     try {
//         const {name, studentIds} = req.body;
//         //here teacher id will be getted by middelware which will be just placed before createClassroom api in classroom routes
//         const teacherId = req.teacher._id;
//         const classroom = new Classroom({
//             name,
//             teacher: teacherId,
//             students: studentIds
//         });

//         await classroom.save();

//         // Add classroom reference to students
//         await Student.updateMany(
//             { _id: { $in: studentIds } },
//             { $addToSet: { classrooms: classroom._id } }
//         );

//         res.status(201).json({success:true,message:"Classroom created",classroom})
//     } catch (error) {
//         res.status(500).json({success:false,error:error.message});
//     }
// }

// exports.addStudentstoClassroom = async (req,res) => {
//     try {
//         const {classroomId,studentIds} = req.body;
//         const classroom = await Classroom.findById(classroomId);

//         if(!classroom){
//             return res.status(404).json({message: "Classroom not Found"})
//         }

//         classroom.students.push(...studentIds)
//         await classroom.save();

//         await Student.updateMany(
//             {_id: {$in: studentIds}},
//             {$addToSet: {classrooms: classroomId}}
//         );

//         res.status(200).json({success:true,message:"Students added to classroom",classroom})
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

// exports.AssignAssignment = async (req,res) => {
//     try {
//         const { classroomId, title, description, subjectId, dueDate, attachments } = req.body;

//         const teacherId = req.teacher._id;

//         const assignassignment = new AssignAssignment({
//             title,
//             description,
//             subjectId,
//             teacherId,
//             classroomId,
//             dueDate,
//             attachments
//         });

//         await assignassignment.save();

//         await Classroom.findByIdAndUpdate(classroomId,{$push: {assignments: assignment._id}});
//         res.status(201).json({ success: true, message: "Assignment assigned", assignment });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

exports.getclassroomAssignments = async (req,res) => {
    try {
        const {classroomId} = req.params;
        

        //.populate("assignments") – This replaces the assignments field (which likely contains an array of assignment IDs) with the actual assignment documents from the Assignment collection.
        const classroom = await Classroom.findByIdAndUpdate(classroomId).populate('assignments');

        if(!classroom){
            return res.status(404).json({message: "Classroom  not found"})
        }

        res.status(200).json({success: true,assignassignment: classroom.assignments})

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.getAllClassrooms = asyncHandler(async (req,res) => {

    //query are used for filtering below is the example url
    //GET /api/classrooms?active=true&teacher=teacherId123&gradeLevel=8&subject=Math

    const {active, teacher, subject, gradeLevel} = req.query;

    let query = {};

    if (active) query.isActive = active === 'true';
    if (teacher) query.teacher = teacher;
    if (subject) query.subject = subject;
    if (gradeLevel) query.gradeLevel = gradeLevel;
    
    const classrooms = await Classroom.find(query)
        .populate('teacher', 'name email')
        .populate('students', 'name email')
        .populate('assignments', 'title dueDate');
    
    res.status(200).json({
        success: true,
        count: classrooms.length,
        data: classrooms
    });
})

exports.getClassroom = asyncHandler(async (req,res) => {
    
    const classroom = await Classroom.findById(req.params.id)
    .populate('teacher coTeachers', 'name email')
        .populate('students', 'name email')
        .populate('assignments', 'title dueDate description')
        .populate('announcements.postedBy', 'name');
    
    if (!classroom) {
        return res.status(404).json({
            success: false,
            error: 'Classroom not found'
        });
    }
    
    res.status(200).json({
        success: true,
        data: classroom
    });
})


exports.createClassroom = [
//this checks are added in classroom schema also
    body('name').
    trim().
    isLength({ min: 3, max: 100 }).
    withMessage('Name must be between 3-100 characters'),
    body('code').
    trim().
    isLength({ min: 6, max: 10 }).
    withMessage('Code must be between 6-10 characters'),
    body('description').
    optional().
    trim().
    isLength({ max: 500 }),
    body('subject').
    optional().
    isIn(["Math", "Science", "History", "English", "Art", "Music", "Physical Education", "Computer Science", "Foreign Language", "Other"]),
    body('gradeLevel').
    optional().
    isIn(["Kindergarten", "Elementary", "Middle School", "High School", "College", "Other"]),
    body('teacher').
    isMongoId().
    withMessage('Invalid teacher ID'),
    body('academicYear').
    matches(/^\d{4}-\d{4}$/).
    withMessage('Academic year must be in format YYYY-YYYY'),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { 
            name,
            code, 
            description, 
            subject, 
            gradeLevel, 
            teacher, 
            academicYear
         } = req.body; 
         
        const existingClassroom = await Classroom.findOne({ code });
        if (existingClassroom) {
            return res.status(400).json({
                success: false,
                error: 'Classroom code already exists'
            });
        }

        const classroom = await Classroom.create({
            name,
            code,
            description,
            subject,
            gradeLevel,
            teacher,
            academicYear,
        });

        res.status(201).json({
            success: true,
            data: classroom
        });
    })
]


exports.updateClassroom = [
    body('name').
    optional().
    trim().
    isLength({ min: 3, max: 100 }).
    withMessage('Name must be between 3-100 characters'),
    body('description').
    optional().
    trim().
    isLength({ max: 500 }),
    body('subject').
    optional().
    isIn(["Math", 
        "Science", 
        "History", 
        "English", 
        "Art", 
        "Music", 
        "Physical Education", 
        "Computer Science", 
        "Foreign Language",
        "Other"]),
    body('gradeLevel').
    optional().
    isIn(["Kindergarten", 
        "Elementary", 
        "Middle School", 
        "High School", 
        "College", 
        "Other"]),
    body('isActive').optional().isBoolean(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        let classroom = await Classroom.findById(req.params.id);
        
        if (!classroom) {
            return res.status(404).json({
                success: false,
                error: 'Classroom not found'
            });
        }
        
        // Update fields
        classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body,
            //below Looks up the classroom by ID.
            // Updates it with the new fields from the client.
            // Validates the new data.
            // Returns the updated document.
        {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: classroom
        });
    })    
]

exports.deleteClassroom = asyncHandler(async (req, res) => {
    const classroom = await Classroom.findById(req.params.id);
    
    if (!classroom) {
        return res.status(404).json({
            success: false,
            error: 'Classroom not found'
        });
    }
    
    // Soft delete (set isActive to false) instead of actual deletion
    classroom.isActive = false;
    await classroom.save();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});


exports.addStudent = asyncHandler(async (req,res) => {
    const { studentId } = req.body;

    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
        return res.status(404).json({
            success: false,
            error: 'Classroom not found'
        });
    }
    
    if (classroom.students.includes(studentId)) {
        return res.status(400).json({
            success: false,
            error: 'Student already in classroom'
        });
    }
    
    classroom.students.push(studentId);
    await classroom.save();
    
    res.status(200).json({
        success: true,
        data: classroom
    });
})

exports.removeStudent = asyncHandler(async (req, res) => {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
        return res.status(404).json({
            success: false,
            error: 'Classroom not found'
        });
    }
    
    // Remove student
    classroom.students = classroom.students.filter(
        student => student.toString() !== req.params.studentId
    );
    
    await classroom.save();
    
    res.status(200).json({
        success: true,
        data: classroom
    });
});

exports.addAnnouncement = [
    body('content').
    trim().
    isLength({ min: 1 }).
    withMessage('Content is required'),
    body('isPinned').
    optional().
    isBoolean(),
    
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) {
            return res.status(404).json({
                success: false,
                error: 'Classroom not found'
            });
        }
        const { content, isPinned } = req.body;
        
        classroom.announcements.push({
            content,
            postedBy: req.user.id, 
            isPinned: isPinned || false
        });
        
        await classroom.save();
        
        res.status(201).json({
            success: true,
            data: classroom.announcements[classroom.announcements.length - 1]
        });
    })
];

exports.getClassroomStats = asyncHandler(async (req, res) => {
    const classroom = await Classroom.findById(req.params.id)
        .populate('students', 'name')
        .populate('assignments', 'title dueDate');
    
    if (!classroom) {
        return res.status(404).json({
            success: false,
            error: 'Classroom not found'
        });
    }
    
    const stats = {
        studentCount: classroom.students.length,
        assignmentCount: classroom.assignments.length,
        activeAssignments: classroom.assignments.filter(a => new Date(a.dueDate) > new Date()).length,
        coTeachersCount: classroom.coTeachers.length,
        resourceCount: classroom.resources.length
    };
    
    res.status(200).json({
        success: true,
        data: stats
    });
});

// @desc    Assign assignment to classroom
// @route   POST /api/classrooms/:id/assignments
// @access  Private (Teacher)
exports.assignAssignment = [
    // Validation middleware
    body('title').
    trim().
    isLength({ min: 3, max: 200 }).
    withMessage('Title must be between 3-200 characters'),
    body('description').
    optional().
    trim().
    isLength({ max: 2000 }),
    body('subject').
    isIn(["Math", "Science", "History", "English", "Art", "Music", "Physical Education", "Computer Science", "Foreign Language", "Other"]),
    body('dueDate').isISO8601().withMessage('Invalid date format').custom((value) => {
        if (new Date(value) <= new Date()) {
            throw new Error('Due date must be in the future');
        }
        return true;
    }),
    body('points').optional().isInt({ min: 0, max: 1000 }),
    body('submissionType').optional().isIn(["none", "online", "offline", "both"]),
    
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { title, description, subject, dueDate, attachments, points, submissionType } = req.body;
        const classroomId = req.params.id;
        const teacherId = req.user.id;

        // Check if classroom exists and teacher is the owner
        const classroom = await Classroom.findOne({ _id: classroomId, teacher: teacherId });
        if (!classroom) {
            return res.status(404).json({
                success: false,
                error: 'Classroom not found or you are not the teacher'
            });
        }

        // Create assignment
        const assignment = new AssignAssignment({
            title,
            description,
            subject,
            teacher: teacherId,
            classroom: classroomId,
            dueDate,
            attachments: attachments || [],
            points: points || 0,
            submissionType: submissionType || "none"
        });

        await assignment.save();

        // Add assignment to classroom
        classroom.assignments.push(assignment._id);
        await classroom.save();

        res.status(201).json({
            success: true,
            message: "Assignment created and assigned to classroom",
            data: assignment
        });
    })
];

// @desc    Get classroom assignments
// @route   GET /api/classrooms/:id/assignments
// @access  Private (Teacher/Student)
exports.getAssignments = asyncHandler(async (req, res) => {
    const { status, upcoming, past } = req.query;
    const classroomId = req.params.id;
    const userId = req.user.id;

    // Check if user is part of the classroom (teacher or student)
    const classroom = await Classroom.findOne({
        _id: classroomId,
        $or: [
            { teacher: userId },
            { students: userId }
        ]
    }).select('_id');

    if (!classroom) {
        return res.status(403).json({
            success: false,
            error: 'Not authorized to access these assignments'
        });
    }

    let query = { classroom: classroomId };

    if (status) {
        query.status = status;
    }

    if (upcoming === 'true') {
        query.dueDate = { $gt: new Date() };
    } else if (past === 'true') {
        query.dueDate = { $lte: new Date() };
    }

    const assignments = await AssignAssignment.find(query)
        .sort({ dueDate: 1 })
        .populate('teacher', 'name email');

    res.status(200).json({
        success: true,
        count: assignments.length,
        data: assignments
    });
});

// @desc    Update assignment
// @route   PUT /api/classrooms/:classroomId/assignments/:assignmentId
// @access  Private (Teacher)
exports.updateAssignment = [
    // Validation middleware (same as assignAssignment)
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { classroomId, assignmentId } = req.params;
        const teacherId = req.user.id;

        // Verify assignment belongs to teacher's classroom
        const assignment = await AssignAssignment.findOne({
            _id: assignmentId,
            classroom: classroomId,
            teacher: teacherId
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                error: 'Assignment not found or not authorized'
            });
        }

        // Update fields
        const updatableFields = ['title', 'description', 'dueDate', 'attachments', 'status', 'points', 'submissionType'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                assignment[field] = req.body[field];
            }
        });

        await assignment.save();

        res.status(200).json({
            success: true,
            data: assignment
        });
    })
];

// @desc    Delete assignment
// @route   DELETE /api/classrooms/:classroomId/assignments/:assignmentId
// @access  Private (Teacher)
exports.deleteAssignment = asyncHandler(async (req, res) => {
    const { classroomId, assignmentId } = req.params;
    const teacherId = req.user.id;

    // Verify assignment belongs to teacher's classroom
    const assignment = await AssignAssignment.findOneAndDelete({
        _id: assignmentId,
        classroom: classroomId,
        teacher: teacherId
    });

    if (!assignment) {
        return res.status(404).json({
            success: false,
            error: 'Assignment not found or not authorized'
        });
    }

    // Remove assignment from classroom
    await Classroom.findByIdAndUpdate(classroomId, {
        $pull: { assignments: assignmentId }
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});