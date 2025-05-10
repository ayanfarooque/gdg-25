const express = require('express');
const adminController = require('../controllers/adminController.js');
const authController = require('../controllers/authController.js')
const router = express.Router();


//signin signup for admin

router.post('/login',authController.adminLogin);

router.post('/signup',authController.adminSignup)

router.post('/recover',authController.resetAdminPassword)


// Student Routes
router.get('/students', adminController.getAllStudents);

// Teacher Routes
router.get('/teachers',  adminController.getAllTeachers);

// Classroom Routes
router.get('/classrooms',  adminController.getAllClassrooms);
router.post('/classrooms',  adminController.createClassroom);
router.get('/classrooms/:id',  adminController.getClassroomById);
router.put('/classrooms/:id',  adminController.updateClassroom);
router.delete('/classrooms/:id',  adminController.deleteClassroom);

// Classroom Student Management Routes
router.get('/classrooms/:id/available-students',  adminController.getAvailableStudents);
router.post('/classrooms/:id/students',  adminController.addStudentToClassroom);
router.delete('/classrooms/:id/students/:studentId',  adminController.removeStudentFromClassroom);

// Classroom Performance Routes
router.get('/classrooms/:id/performance',  adminController.getClassroomPerformance);

// Dashboard Routes
router.get('/dashboard',  adminController.getAdminDashboardStats);

module.exports = router;