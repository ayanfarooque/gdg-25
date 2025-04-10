const express = require('express')
// const {createSubject,getAllSubjects,getSubjectById,updatesubject,deleteSubject} = require('../models/Subject.js')
const subjectController = require('../controllers/subjectController.js')
const {authTeacher} = require('../middleware/authTeacher.js')

const router = express.Router();

router.post("/create-subject", authTeacher, subjectController.createSubject);  
router.get("/get-subjects", subjectController.getAllSubjects);              
router.get("/:id", subjectController.getSubjectById);           
router.put("/:id", authTeacher, subjectController.updatesubject); 
router.delete("/:id", authTeacher, subjectController.deleteSubject); 

module.exports = router;