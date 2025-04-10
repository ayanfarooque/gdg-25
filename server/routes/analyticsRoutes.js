const express = require('express')
const analyticsController = require('../controllers/analyticsController.js')
const {authStudent} = require('../middleware/authStudent.js')
const {authTeacher} = require('../middleware/authTeacher.js')

const router = express.Router();

router.get("/:studentId", authStudent, analyticsController.getStudentAnalytics);


router.put("/study-hours/:studentId", authStudent, analyticsController.updateStudyHours);

router.post("/add-score/:studentId", authTeacher, analyticsController.addTestScore);

router.put("/update-growth/:studentId", authTeacher, analyticsController.updateGrowthPoints);

module.exports = router;