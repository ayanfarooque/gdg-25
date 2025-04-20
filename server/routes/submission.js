const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const upload = require("../middleware/multer");
const { protect, authorize } = require("../middleware/authMiddleware.js");

// Student routes
router.post(
  "/submit",
  protect,
  authorize("student"),
  upload.array("files", 5), // Max 5 files
  submissionController.submitAssignment
);

router.get(
  "/student/:studentId",
  protect,
  authorize("student", "teacher", "admin"),
  submissionController.getSubmissionsByStudent
);

// Teacher routes
router.get(
  "/assignment/:assignmentId",
  protect,
  authorize("teacher", "admin"),
  submissionController.getSubmissionsByAssignment
);

router.get(
  "/:submissionId",
  protect,
  authorize("student", "teacher", "admin"),
  submissionController.getSubmissionById
);

router.put(
  "/evaluate/:submissionId",
  protect,
  authorize("teacher", "admin"),
  submissionController.evaluateSubmission
);

router.delete(
  "/:submissionId",
  protect,
  authorize("teacher", "admin"),
  submissionController.deleteSubmission
);

router.get(
  "/late/course/:courseId",
  protect,
  authorize("teacher", "admin"),
  submissionController.getLateSubmissions
);

module.exports = router;