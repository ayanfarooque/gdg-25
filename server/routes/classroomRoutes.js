// const express = require("express")
// const {authStudent} = require('../middleware/authStudent')
// const {authTeacher} = require('../middleware/authTeacher')
const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroomController.js");
const { protect, authorize } = require("../middleware/authMiddleware");
// const {
//     createClassroom,
//     addStudentstoClassroom,
//     AssignAssignment,
//     getclassroomAssignments
// } = require('../controllers/classroomController');

// const router = express.Router();

// //routes created for teachers
// router.post('/create',authTeacher,createClassroom);
// router.put('/add-students',authTeacher,addStudentstoClassroom);
// router.post('/assign-assignment',authTeacher,AssignAssignment);


// //routes created for students
// router.get('/:classroomId/assignments',authStudent,getclassroomAssignments)

// module.exports = router;



// Public routes
router.get("/", classroomController.getAllClassrooms);
router.get("/:id", classroomController.getClassroom);

// Protected routes (require authentication)
router.use(protect);

// Teacher/Admin restricted routes
router.post("/", authorize("teacher", "admin"), classroomController.createClassroom);
router.put("/:id", authorize("teacher", "admin"), classroomController.updateClassroom);
router.delete("/:id", authorize("teacher", "admin"), classroomController.deleteClassroom);
router.get("/",classroomController.getAllClassrooms)

// Student management
// router.post("/:id/students", authorize("teacher", "admin"), classroomController.addStudent);
// router.delete("/:id/students/:studentId", authorize("teacher", "admin"), classroomController.removeStudent);

// Announcements
// router.post("/:id/announcements", authorize("teacher"), classroomController.addAnnouncement);

// // Stats
// router.get("/:id/stats", authorize("teacher", "admin"), classroomController.getClassroomStats);

// Assignment routes
router.post("/:id/assignments", authorize("teacher"), classroomController.assignAssignment);
router.get("/:id/assignments", authorize("teacher", "student"), classroomController.getAssignments);
router.put("/:classroomId/assignments/:assignmentId", authorize("teacher"), classroomController.updateAssignment);
router.delete("/:classroomId/assignments/:assignmentId", authorize("teacher"), classroomController.deleteAssignment);


//join req
router.post('/:id',classroomController.joinClassroomRequest);

//approve
router.post('/:id/approve', classroomController.approveJoinRequest);
module.exports = router;
