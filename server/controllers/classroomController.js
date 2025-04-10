const Classroom = require('../models/Classroom');
const AssignAssignment = require('../models/AssignAssignment')
const Student = require('../models/Student.js')
const Teacher = require('../models/Teacher.js')

exports.createClassroom = async(req,res) => {
    try {
        const {name, studentIds} = req.body;
        //here teacher id will be getted by middelware which will be just placed before createClassroom api in classroom routes
        const teacherId = req.teacher._id;
        const classroom = new Classroom({
            name,
            teacher: teacherId,
            students: studentIds
        });

        await classroom.save();

        // Add classroom reference to students
        await Student.updateMany(
            { _id: { $in: studentIds } },
            { $addToSet: { classrooms: classroom._id } }
        );

        res.status(201).json({success:true,message:"Classroom created",classroom})
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
    }
}

exports.addStudentstoClassroom = async (req,res) => {
    try {
        const {classroomId,studentIds} = req.body;
        const classroom = await Classroom.findById(classroomId);

        if(!classroom){
            return res.status(404).json({message: "Classroom not Found"})
        }

        classroom.students.push(...studentIds)
        await classroom.save();

        await Student.updateMany(
            {_id: {$in: studentIds}},
            {$addToSet: {classrooms: classroomId}}
        );

        res.status(200).json({success:true,message:"Students added to classroom",classroom})
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.AssignAssignment = async (req,res) => {
    try {
        const { classroomId, title, description, subjectId, dueDate, attachments } = req.body;

        const teacherId = req.teacher._id;

        const assignassignment = new AssignAssignment({
            title,
            description,
            subjectId,
            teacherId,
            classroomId,
            dueDate,
            attachments
        });

        await assignassignment.save();

        await Classroom.findByIdAndUpdate(classroomId,{$push: {assignments: assignment._id}});
        res.status(201).json({ success: true, message: "Assignment assigned", assignment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.getclassroomAssignments = async (req,res) => {
    try {
        const {classroomId} = req.params;
        

        //.populate("assignments") – This replaces the assignments field (which likely contains an array of assignment IDs) with the actual assignment documents from the Assignment collection.
        const classroom = await Classroom.findByIdAndUpdate(classroomId).populate('assignments');

        if(!classroom){
            return res.status(404).json({message: "Classroom  not found"})
        }

        res.status(200).json({success: true,assignassignment: classroom.assignments})

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}