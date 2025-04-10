const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController.js");
const authController =  require('../controllers/authController.js')
const {authTeacher} = require('../middleware/authTeacher.js')
router.post("/register", authController.teacherSignup);
router.post('/login',authController.teacherLogin)

router.get("/:teacherId", authTeacher, teacherController.getTeacherDetails);

module.exports = router;
