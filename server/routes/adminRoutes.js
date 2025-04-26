const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Student Routes
router.route('/students')
  .get(protect, admin, adminController.getAllStudents);

// Teacher Routes
router.route('/teachers')
  .get(protect, admin, adminController.getAllTeachers);

// Classroom Routes
router.route('/classrooms')
  .get(protect, admin, adminController.getAllClassrooms)
  .post(protect, admin, adminController.createClassroom);

router.route('/classrooms/:id')
  .get(protect, admin, adminController.getClassroomById)
  .put(protect, admin, adminController.updateClassroom)
  .delete(protect, admin, adminController.deleteClassroom);

// Classroom Student Management Routes
router.route('/classrooms/:id/available-students')
  .get(protect, admin, adminController.getAvailableStudents);

router.route('/classrooms/:id/students')
  .post(protect, admin, adminController.addStudentToClassroom);

router.route('/classrooms/:id/students/:studentId')
  .delete(protect, admin, adminController.removeStudentFromClassroom);

// Classroom Performance Routes
router.route('/classrooms/:id/performance')
  .get(protect, admin, adminController.getClassroomPerformance);

// Dashboard Routes
router.route('/dashboard')
  .get(protect, admin, adminController.getAdminDashboardStats);

module.exports = router;