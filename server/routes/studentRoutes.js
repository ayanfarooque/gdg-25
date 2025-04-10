const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController.js");
const authController =  require('../controllers/authController.js')
const {authStudent} = require("../middleware/authStudent.js")
const {authTeacher} = require('../middleware/authTeacher.js')
router.post("/register", authController.studentsSignUp);
router.post("/login", authController.studentLogin);

router.get("/:studentId",authStudent, studentController.getStudentDetails);
router.put("/:studentId", authStudent, studentController.updateStudentDetails);
router.delete("/:studentId", authTeacher, studentController.deleteStudent);

router.get("/students", authTeacher, studentController.getAllStudents);
module.exports = router;
