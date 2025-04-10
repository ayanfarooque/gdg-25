const Subject = require('../models/Subject.js')

const createSubject = async (req,res) => {
    try {
        const {name,code,teacherId,classroomId,description} = req.body;

        const existingSubject = await Subject.findOne({code})

        if(existingSubject){
            return res.status(400).json({
                message: "Subject with this code already exits"
            })
        }
        const newsubject = new Subject({
            name,
            code,
            teacherId,
            classroomId,
            description

        })

        await newsubject.save();
        res.status(201).json({message: "subject created successfull!",subject: newsubject})
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const getAllSubjects = async (req,res) => {
    try {
        const subjects = await Subject.find().populate("teacherId","name email").populate("classroomId", "name");
        //.populate("classroomId", "name") replaces classroomId with the corresponding Classroom document, only fetching the name field.

        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const getSubjectById = async (req,res) => {
    try {
        const subject = await Subject.findById(req.params.id).populate("teacherId", "name email").populate("classroomId", "name");

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const updatesubject = async (req,res) => {

    try {
        const subject = await Subject.findById(req.params.id);
    if(!subject){
        return res.status(404).json({message: "Subject not found"})
    }
    const updatedsubject = await  Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json({ message: "Subject updated successfully!", subject: updatedsubject });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

        if (!deletedSubject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json({ message: "Subject deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updatesubject,
    deleteSubject
};