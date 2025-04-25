const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController.js");
const upload = require("../middleware/multer.js");

// Route to upload an assignment
router.post("/upload", upload.single("file"), assignmentController.uploadAssignment);

// Route to get previous assignments
router.get("/previous/:studentid", assignmentController.getpreviousassignments);


router.get("/assignment", assignmentController.getClassroomAssignments)
// Route to get a single assignment
router.get("/assignment/:assignmentId", assignmentController.getsingleassignment);

// Route to get student submissions
router.get("/student/:studentId", assignmentController.getStudentSubmissions);

module.exports = router;