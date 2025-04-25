const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController.js");
const upload = require("../middleware/multer.js");

// Route to upload an assignment
router.post("/upload", upload.single("file"), assignmentController.uploadAssignment);

// Route to get previous assignments
router.get("/previous/:studentid", assignmentController.getpreviousassignments);

// Route to get a single assignment
router.get("/single/:assignmentId", assignmentController.getsingleassignment);

// Route to get student submissions
router.get("/student/:studentId", assignmentController.getStudentSubmissions);

module.exports = router;