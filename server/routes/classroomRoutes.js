// // const express = require("express")
// // const {authStudent} = require('../middleware/authStudent')
// // const {authTeacher} = require('../middleware/authTeacher')
// const express = require("express");
// const router = express.Router();
// const classroomController = require("../controllers/classroomController.js");
// const { protect, authorize } = require("../middleware/authMiddleware");
// // const {
// //     createClassroom,
// //     addStudentstoClassroom,
// //     AssignAssignment,
// //     getclassroomAssignments
// // } = require('../controllers/classroomController');

// // const router = express.Router();

// // //routes created for teachers
// // router.post('/create',authTeacher,createClassroom);
// // router.put('/add-students',authTeacher,addStudentstoClassroom);
// // router.post('/assign-assignment',authTeacher,AssignAssignment);


// // //routes created for students
// // router.get('/:classroomId/assignments',authStudent,getclassroomAssignments)

// // module.exports = router;



// // Public routes
// router.get("/studentclassroom", classroomController.getAllClassrooms);
// router.get("/studentclassroom/:id", classroomController.getClassroom);

// // Protected routes (require authentication)
// router.use(protect);

// // Teacher/Admin restricted routes
// router.post("/",  classroomController.createClassroom);
// router.put("/:id",  classroomController.updateClassroom);
// router.delete("/:id",  classroomController.deleteClassroom);
// router.get("/",classroomController.getAllClassrooms)

// // Student management
// // router.post("/:id/students",  classroomController.addStudent);
// // router.delete("/:id/students/:studentId",  classroomController.removeStudent);

// // Announcements
// // router.post("/:id/announcements",  classroomController.addAnnouncement);

// // // Stats
// // router.get("/:id/stats",  classroomController.getClassroomStats);

// // Assignment routes
// router.post("/:id/assignments",  classroomController.assignAssignment);
// router.get("/:id/assignments",  classroomController.getAssignments);
// router.put("/:classroomId/assignments/:assignmentId", classroomController.updateAssignment);
// router.delete("/:classroomId/assignments/:assignmentId",  classroomController.deleteAssignment);


// //join req
// router.post('/student-classroom/request-join/:id',classroomController.joinClassroomRequest);

// //approve
// router.post('/student-classroom/approve/:id', classroomController.approveJoinRequest);
// module.exports = router;


const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroomController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

// Public routes
router.get("/studentclassroom", classroomController.getAllClassrooms);
router.get("/studentclassroom/:id", classroomController.getClassroom);

// Protected routes (require authentication)


// Teacher/Admin restricted routes
router.post("/",  classroomController.createClassroom);
router.put("/:id",  classroomController.updateClassroom);
router.delete("/:id",  classroomController.deleteClassroom);
router.get("/", classroomController.getAllClassrooms);

// Student management
router.post("/:id/students",  classroomController.addStudent);
router.delete("/:id/students/:studentId",  classroomController.removeStudent);

// Announcements
router.post("/:id/announcements",  classroomController.addAnnouncement);

// Stats
router.get("/:id/stats",  classroomController.getClassroomStats);

// Assignment routes
router.post("/:id/assignments",  classroomController.assignAssignment);
router.get("/:id/assignments", classroomController.getAssignments);
router.put("/:classroomId/assignments/:assignmentId",  classroomController.updateAssignment);
router.delete("/:classroomId/assignments/:assignmentId",  classroomController.deleteAssignment);

// Join requests
router.post('/student-classroom/request-join/:id', classroomController.joinClassroomRequest);
router.post('/student-classroom/approve/:id',  classroomController.approveJoinRequest);

module.exports = router;