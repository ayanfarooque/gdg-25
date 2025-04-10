const AssignAssginment = require('../models/AssignAssignment.js');

exports.assignassginment = async (req,res) => {
    try {
        const {title,description,subjectId,teacherId,classroomId,dueDate,attachments} = req.body

        const newassign = new AssignAssginment({
            title,
            description, 
            subjectId, 
            teacherId, 
            classroomId, 
            dueDate, 
            attachments
        })

        await newassign.save();
        res.status(201).json({message: "Assignment Assigned Successfully",newassign})
    } catch (error) {
        res.status(500).json({ message: "Error assigning assignment", error: error.message });
    }
}