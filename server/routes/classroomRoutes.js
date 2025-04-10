const express = require("express")
const {authStudent} = require('../middleware/authStudent')
const {authTeacher} = require('../middleware/authTeacher')

const {
    createClassroom,
    addStudentstoClassroom,
    AssignAssignment,
    getclassroomAssignments
} = require('../controllers/classroomController');

const router = express.Router();

//routes created for teachers
router.post('/create',authTeacher,createClassroom);
router.put('/add-students',authTeacher,addStudentstoClassroom);
router.post('/assign-assignment',authTeacher,AssignAssignment);


//routes created for students
router.get('/:classroomId/assignments',authStudent,getclassroomAssignments)

module.exports = router;