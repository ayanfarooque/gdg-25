const AssignAssignment = require("../models/AssignAssignment.js");
const Submission = require("../models/Submission.js");
const Classroom = require("../models/Classroom.js");
const { uploadToCloud, deleteFromCloud } = require("../utils/cloudinary.js");
const AppError = require("../utils/appError.js");
const Grading = require('../models/gradingSchema.js')
// Create a new assignment
exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, subject, classroom, dueDate, points } = req.body;
    const teacher = req.user.id;

    const newAssignment = await AssignAssignment.create({
      title,
      description,
      subject,
      classroom,
      dueDate,
      points,
      teacher,
    });

    res.status(201).json({ success: true, data: newAssignment });
  } catch (error) {
    console.error("Error creating assignment:", error.message);
    res.status(500).json({ success: false, message: "Error creating assignment" });
  }
};

// Get assignments for a classroom
exports.getClassroomAssignments = async (req, res, next) => {
  try {
    const { classroomId } = req.params;

    // Fetch assignments for the given classroom ID
    const assignments = await AssignAssignment.find()
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .populate("teacher", "name email") // Populate teacher details
      .populate("classroom", "name grade section"); // Populate classroom details

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No assignments found for this classroom",
      });
    }

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching classroom assignments:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
    });
  }
};

// Get assignment details
exports.getAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await AssignAssignment.findById(assignmentId)
      .populate("teacher", "name email")
      .populate("classroom", "name grade section");

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    console.error("Error fetching assignment details:", error.message);
    res.status(500).json({ success: false, message: "Error fetching assignment details" });
  }
};

// Update an assignment
exports.updateAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const updates = req.body;

    const updatedAssignment = await AssignAssignment.findByIdAndUpdate(
      assignmentId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({ success: true, data: updatedAssignment });
  } catch (error) {
    console.error("Error updating assignment:", error.message);
    res.status(500).json({ success: false, message: "Error updating assignment" });
  }
};

// Delete an assignment
exports.deleteAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await AssignAssignment.findByIdAndDelete(assignmentId);

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({ success: true, message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error.message);
    res.status(500).json({ success: false, message: "Error deleting assignment" });
  }
};

// Upload an assignment
exports.uploadAssignment = async (req, res) => {
  try {
    const { studentid, subjectid, teacherid, assignmentId, classroomId, chatId } = req.body;

    if (!studentid || !subjectid || !teacherid || !assignmentId || !classroomId || !chatId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newAssignment = new Submission({
      studentid,
      subjectid,
      teacherid,
      assignmentId,
      classroomId,
      chatId,
      filePath: req.file.path,
      fileName: req.file.filename,
    });

    await newAssignment.save();

    res.json({ success: true, message: "Assignment uploaded successfully" });
  } catch (error) {
    console.error("Error uploading assignment:", error.message);
    res.status(500).json({ success: false, message: "Error uploading assignment" });
  }
};

// Fetch previous assignments for a student
exports.getpreviousassignments = async (req, res) => {
  try {
    const { studentid } = req.params;
    const assignments = await Submission.find({ studentId: studentid })
      .sort({ createdAt: -1 })
      .populate("assignmentId", "title dueDate");

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    console.error("Error fetching previous assignments:", error.message);
    res.status(500).json({ success: false, message: "Error fetching assignments" });
  }
};

// Fetch a single assignment
// exports.getsingleassignment = async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const userId = req.user._id;
//     const userRole = req.user.role;

//     // Find the base assignment
//     const assignment = await AssignAssignment.findById(assignmentId)
//       .populate("teacher", "name email")
//       .populate("classroom", "name grade section")
//       .populate("subjectId", "name code")
//       .lean();

//     if (!assignment) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Assignment not found",
//         data: null
//       });
//     }

//     // Get submission data if student
//     let submissionData = {};
//     if (userRole === "student") {
//       const submission = await Submission.findOne({
//         assignment: assignmentId,
//         student: userId
//       }).populate("grading");

//       if (submission) {
//         submissionData = {
//           file: submission.files?.[0]?.name || null,
//           type: submission.files?.[0]?.type || null,
//           size: submission.files?.[0]?.size || null,
//           submittedAt: submission.submittedAt,
//           comments: submission.comments
//         };

//         if (submission.grading) {
//           submissionData.grading = {
//             score: submission.grading.score,
//             classAverage: submission.grading.classAverage,
//             feedback: submission.grading.feedback,
//             rubric: submission.grading.rubric || []
//           };
//         }
//       }
//     }

//     // Construct the response
//     const responseData = {
//       _id: assignment._id,
//       title: assignment.title,
//       description: assignment.description,
//       subjectId: assignment.subjectId || { name: "N/A", code: "" },
//       dueDate: assignment.dueDate,
//       status: assignment.status,
//       points: assignment.points,
//       instructions: assignment.instructions,
//       attachments: assignment.attachments || [],
//       createdAt: assignment.createdAt,
//       ...(userRole === "student" && { 
//         submission: submissionData.file ? submissionData : null,
//         grading: submissionData.grading || null
//       })
//     };

//     // For teachers, include all submissions count
//     if (userRole === "teacher") {
//       const submissionCount = await Submission.countDocuments({ 
//         assignment: assignmentId 
//       });
//       responseData.submissionCount = submissionCount;
//     }

//     res.status(200).json({ 
//       success: true, 
//       message: "Assignment retrieved successfully",
//       data: responseData 
//     });

//   } catch (error) {
//     console.error("Error fetching assignment:", error.message);
//     res.status(500).json({ 
//       success: false, 
//       message: "Internal server error while fetching assignment",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

exports.getsingleassignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // TEMPORARY: Skip user-based logic
    // const userId = req.user._id;
    // const userRole = req.user.role;

    // Find the base assignment
    const assignment = await AssignAssignment.findById(assignmentId)
      .populate("teacher", "name email")
      .populate("classroom", "name grade section")
      .populate("subjectId", "name code")
      .lean();

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
        data: null
      });
    }

    // Skip student submission logic for now
    // let submissionData = {};
    // if (userRole === "student") {
    //   const submission = await Submission.findOne({
    //     assignment: assignmentId,
    //     student: userId
    //   }).populate("grading");
    //   ...
    // }

    // Construct response
    const responseData = {
      _id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      subjectId: assignment.subjectId || { name: "N/A", code: "" },
      dueDate: assignment.dueDate,
      status: assignment.status,
      points: assignment.points,
      instructions: assignment.instructions,
      attachments: assignment.attachments || [],
      teacher: assignment.teacher,
      classroom: assignment.classroom
      // submission: submissionData // omit for now
    };

    return res.status(200).json({
      success: true,
      message: "Assignment fetched successfully",
      data: responseData
    });
  } catch (err) {
    console.error("Error getting assignment:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
};
// Fetch submissions for a specific student
exports.getStudentSubmissions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const submissions = await Submission.find({ studentId }).populate("assignmentId");

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.error("Error fetching student submissions:", error.message);
    res.status(500).json({ success: false, message: "Error fetching submissions" });
  }
};






// const AssignAssignment = require("../models/AssignAssignment.js");
// const Submission = require("../models/Submission.js");
// const Classroom = require("../models/Classroom.js");
// const { uploadToCloud, deleteFromCloud } = require("../utils/cloudinary.js");
// const AppError = require("../utils/appError.js");
// //const { evaluateSubmission } = require("../services/aiEvaluationService.js");
// //const NotificationService = require("../services/notificationService.js");

// // Create a new assignment with AI-assisted rubric generation
// exports.createAssignment = async (req, res, next) => {
//   try {
//     const { title, description, subject, classroom, dueDate, points, instructions } = req.body;
//     const teacher = req.user.id;

//     // Validate classroom exists and teacher is assigned to it
//     const classroomExists = await Classroom.findOne({
//       _id: classroom,
//       teacher: teacher,
//       status: 'active'
//     });
    
//     if (!classroomExists) {
//       return next(new AppError("Classroom not found or you're not assigned to it", 404));
//     }

//     // Handle file uploads
//     const attachments = [];
//     if (req.files?.attachments) {
//       await Promise.all(req.files.attachments.map(async (file) => {
//         const result = await uploadToCloud(file.path, 'assignment_attachments');
//         attachments.push({
//           url: result.secure_url,
//           name: file.originalname,
//           type: file.mimetype.split('/')[1],
//           size: file.size,
//           key: result.public_id
//         });
//       }));
//     }

//     // Generate AI-assisted rubric if not provided
//     let gradingRubric = req.body.gradingRubric;
//     if (!gradingRubric && description) {
//       gradingRubric = await generateAIRubric(title, description, points);
//     }

//     const assignment = new AssignAssignment({
//       title,
//       description,
//       subject,
//       teacher,
//       classroom,
//       dueDate,
//       points,
//       instructions,
//       gradingRubric,
//       attachments,
//       status: req.body.status || "published"
//     });

//     await assignment.save();

//     // Notify students
//    // await NotificationService.createAssignmentNotification(classroom, assignment._id);

//     res.status(201).json({
//       status: "success",
//       data: {
//         assignment
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // Get assignments with pagination and filtering
// exports.getClassroomAssignments = async (req, res, next) => {
//   try {
//     const { classroomId } = req.params;
//     const { status, subject, page = 1, limit = 10 } = req.query;
    
//     // Validate teacher has access to this classroom
//     const classroom = await Classroom.findOne({
//       _id: classroomId,
//       teacher: req.user.id
//     });
    
//     if (!classroom) {
//       return next(new AppError("Classroom not found or access denied", 404));
//     }

//     const filter = { classroom: classroomId };
//     if (status) filter.status = status;
//     if (subject) filter.subject = subject;

//     const assignments = await AssignAssignment.find(filter)
//       .populate("teacher", "name email avatar")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await AssignAssignment.countDocuments(filter);

//     res.status(200).json({
//       status: "success",
//       data: {
//         assignments,
//         pagination: {
//           total,
//           page: parseInt(page),
//           pages: Math.ceil(total / limit),
//           limit: parseInt(limit)
//         }
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // Get assignment details with submission analytics
// exports.getAssignment = async (req, res, next) => {
//   try {
//     const assignment = await AssignAssignment.findById(req.params.id)
//       .populate("teacher", "name email avatar")
//       .populate("classroom", "name grade section");

//     if (!assignment) {
//       return next(new AppError("Assignment not found", 404));
//     }

//     // Verify teacher owns this assignment
//     if (assignment.teacher._id.toString() !== req.user.id) {
//       return next(new AppError("Unauthorized access to this assignment", 403));
//     }

//     // Get submission statistics
//     const submissions = await Submission.aggregate([
//       { $match: { assignment: assignment._id } },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           submitted: { $sum: { $cond: [{ $in: ["$status", ["submitted", "resubmitted", "late"]] }, 1, 0] } },
//           graded: { $sum: { $cond: [{ $eq: ["$status", "graded"] }, 1, 0] } },
//           averageScore: { $avg: "$evaluation.score" }
//         }
//       }
//     ]);

//     res.status(200).json({
//       status: "success",
//       data: {
//         assignment,
//         analytics: submissions[0] || {
//           total: 0,
//           submitted: 0,
//           graded: 0,
//           averageScore: 0
//         }
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // Update assignment with version history
// exports.updateAssignment = async (req, res, next) => {
//   try {
//     const assignment = await AssignAssignment.findById(req.params.id);
//     if (!assignment) {
//       return next(new AppError("Assignment not found", 404));
//     }

//     // Verify teacher owns this assignment
//     if (assignment.teacher.toString() !== req.user.id) {
//       return next(new AppError("Unauthorized to update this assignment", 403));
//     }

//     // Save previous version
//     if (assignment.status === 'published') {
//       assignment.versionHistory.push({
//         title: assignment.title,
//         description: assignment.description,
//         dueDate: assignment.dueDate,
//         points: assignment.points,
//         updatedAt: new Date()
//       });
//     }

//     // Update fields
//     const updatableFields = ['title', 'description', 'subject', 'dueDate', 'points', 'gradingRubric', 'status', 'instructions'];
//     updatableFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         assignment[field] = req.body[field];
//       }
//     });

//     // Handle file uploads
//     if (req.files?.attachments) {
//       await Promise.all(req.files.attachments.map(async (file) => {
//         const result = await uploadToCloud(file.path, 'assignment_attachments');
//         assignment.attachments.push({
//           url: result.secure_url,
//           name: file.originalname,
//           type: file.mimetype.split('/')[1],
//           size: file.size,
//           key: result.public_id
//         });
//       }));
//     }

//     await assignment.save();

//     res.status(200).json({
//       status: "success",
//       data: {
//         assignment
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // Delete assignment and related submissions
// exports.deleteAssignment = async (req, res, next) => {
//   try {
//     const assignment = await AssignAssignment.findById(req.params.id);
    
//     if (!assignment) {
//       return next(new AppError("Assignment not found", 404));
//     }

//     if (assignment.teacher.toString() !== req.user.id) {
//       return next(new AppError("Unauthorized to delete this assignment", 403));
//     }

//     // Soft delete
//     assignment.isActive = false;
//     assignment.status = 'deleted';
//     await assignment.save();

//     // Delete associated files from cloud
//     await Promise.all(assignment.attachments.map(async (file) => {
//       await deleteFromCloud(file.key);
//     }));

//     res.status(204).json({
//       status: "success",
//       data: null
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // Get submissions with filtering and AI evaluation
// exports.getAssignmentSubmissions = async (req, res, next) => {
//   try {
//     const { assignmentId } = req.params;
//     const { status, graded, page = 1, limit = 10 } = req.query;

//     // Verify assignment belongs to teacher
//     const assignment = await AssignAssignment.findOne({
//       _id: assignmentId,
//       teacher: req.user.id
//     });
    
//     if (!assignment) {
//       return next(new AppError("Assignment not found or unauthorized", 404));
//     }

//     const filter = { assignment: assignmentId };
//     if (status) filter.status = status;
//     if (graded) filter['evaluation.score'] = { $exists: graded === 'true' };

//     const submissions = await Submission.find(filter)
//       .populate("student", "name email avatar")
//       .sort({ submittedAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await Submission.countDocuments(filter);

//     res.status(200).json({
//       status: "success",
//       data: {
//         submissions,
//         assignment: {
//           title: assignment.title,
//           dueDate: assignment.dueDate,
//           points: assignment.points
//         },
//         pagination: {
//           total,
//           page: parseInt(page),
//           pages: Math.ceil(total / limit),
//           limit: parseInt(limit)
//         }
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // Bulk evaluate submissions with AI
// // exports.bulkEvaluateSubmissions = async (req, res, next) => {
// //   try {
// //     const { assignmentId } = req.params;
    
// //     // Verify assignment belongs to teacher
// //     const assignment = await AssignAssignment.findOne({
// //       _id: assignmentId,
// //       teacher: req.user.id
// //     }).select('title description points gradingRubric');
    
// //     if (!assignment) {
// //       return next(new AppError("Assignment not found or unauthorized", 404));
// //     }

// //     // Get all ungraded submissions
// //     const submissions = await Submission.find({
// //       assignment: assignmentId,
// //       status: { $in: ['submitted', 'resubmitted', 'late'] }
// //     }).populate("student", "name");

// //     if (submissions.length === 0) {
// //       return next(new AppError("No submissions to evaluate", 400));
// //     }

// //     // Process evaluations in batches
// //     const batchSize = 5;
// //     const results = [];
    
// //     for (let i = 0; i < submissions.length; i += batchSize) {
// //       const batch = submissions.slice(i, i + batchSize);
// //       const evaluations = await Promise.all(
// //         batch.map(sub => evaluateSubmission(sub, assignment))
// //       );
      
// //       // Update submissions with AI evaluations
// //       await Promise.all(
// //         batch.map((sub, index) => {
// //           sub.evaluation = {
// //             ...evaluations[index],
// //             gradedBy: req.user.id,
// //             gradedAt: new Date(),
// //             aiEvaluated: true
// //           };
// //           sub.status = 'graded';
// //           return sub.save();
// //         })
// //       );
      
// //       results.push(...batch);
// //     }

// //     res.status(200).json({
// //       status: "success",
// //       data: {
// //         evaluatedCount: results.length,
// //         submissions: results
// //       }
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // };


// // Get assignments filtered by status for a teacher
// exports.getAssignmentsByStatus = async (req, res, next) => {
//   try {
//     const { status } = req.query; // Get the status from query parameters
//     const teacherId = req.user.id; // Assuming the logged-in teacher's ID is available in `req.user`

//     // Validate the status value
//     const validStatuses = ["draft", "published", "archived"];
//     if (status && !validStatuses.includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status value" });
//     }

//     // Build the filter
//     const filter = { teacher: teacherId };
//     if (status) {
//       filter.status = status;
//     }

//     // Fetch assignments
//     const assignments = await AssignAssignment.find(filter)
//       .populate("classroom", "name grade section")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: assignments,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get unpublished (draft) and published assignments for a teacher
// exports.getTeacherHomeAssignments = async (req, res, next) => {
//   try {
//     const teacherId = req.user.id; // Assuming the logged-in teacher's ID is available in `req.user`

//     // Fetch unpublished (draft) assignments
//     const draftAssignments = await AssignAssignment.find({
//       teacher: teacherId,
//       status: "draft"
//     })
//       .populate("classroom", "name grade section")
//       .sort({ createdAt: -1 });

//     // Fetch published assignments
//     const publishedAssignments = await AssignAssignment.find({
//       teacher: teacherId,
//       status: "published"
//     })
//       .populate("classroom", "name grade section")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: {
//         draftAssignments,
//         publishedAssignments
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // const Assignment = require('../models/Assignment.js')
// // const SubmitAssignment = require('../models/SubmitAssignment.js');
// // //const { gradeassignment } = require('../services/mlService.js')


// // //student can upload assignment in client assignment chat body 

// exports.uploadAssignment = async (req, res) => {
//     try {
//         if (!req.file) {
//           return res.status(400).json({ success: false, message: 'No file uploaded' });
//         }
    
//         const { studentid, subjectid, teacherid, assignmentId, classroomId, chatId } = req.body;
    
//         if (!studentid || !subjectid || !teacherid || !assignmentId || !classroomId || !chatId) {
//           return res.status(400).json({ success: false, message: 'All fields are required', missingFields: { studentid: !studentid, subjectid: !subjectid, teacherid: !teacherid, assignmentId: !assignmentId, classroomId: !classroomId, chatId: !chatId } });
//         }
    
//         // Save the file metadata in the database
//         const newAssignment = new Assignment({
//           studentid,
//           subjectid,
//           teacherid,
//           assignmentId,
//           classroomId,
//           chatId,
//           filePath: req.file.path, // Store the file path in the database
//           fileName: req.file.filename, // Store the file name in the database
//         });
    
//         await newAssignment.save();
    
//         res.json({ success: true, message: 'Assignment uploaded successfully' });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error uploading assignment' });
//       }
//     };
  

// // exports.getpreviousassignments = async (req, res) => {
// //     try {
// //         const { studentid } = req.params;
// //         const assignments = await SubmitAssignment.find({ studentId: studentid })
// //             .sort({ createdAt: -1 })
// //             .populate("assignmentId", "title dueDate");

// //         res.status(200).json({ success: true, assignments });
// //     } catch (error) {
// //         console.error("Error fetching previous assignments:", error.message);
// //         res.status(500).json({ success: false, message: "Error fetching assignments" });
// //     }
// // };

// exports.getsingleassignment = async (req, res) => {
//     try {
//         const { assignmentId } = req.params;
//         const assignment = await SubmitAssignment.findById(assignmentId).populate("assignmentId");

//         if (!assignment) {
//             return res.status(404).json({ success: false, message: "Assignment not found" });
//         }

//         res.status(200).json({ success: true, assignment });
//     } catch (error) {
//         console.error("Error fetching assignment:", error.message);
//         res.status(500).json({ success: false, message: "Error fetching assignment" });
//     }
// };

// // exports.getAllSubmissions = async (req, res) => {
// //   try {
// //     const submissions = await SubmitAssignment.find().populate("studentId").populate("assignmentId").populate("classroomId");
// //     res.status(200).json(submissions);
// //   } catch (error) {
// //     res.status(500).json({ error: "Failed to fetch assignments" });
// //   }
// // };

// // exports.getStudentSubmissions = async (req, res) => {
// //   try {
// //     const { studentId } = req.params;
// //     const submissions = await SubmitAssignment.find({ studentId }).populate("assignmentId");
// //     res.status(200).json(submissions);
// //   } catch (error) {
// //     res.status(500).json({ error: "Failed to fetch student's assignments" });
// //   }
// // };
