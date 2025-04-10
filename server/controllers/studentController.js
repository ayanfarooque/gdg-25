const Student = require('../models/Student.js')

exports.getStudentDetails = async (req,res) => {
    try {
        const {studentId} = req.params;
        const student = await Student.findById(studentId)
        .populate("subjects.subjectId", "name") 
        .populate("teachers.teacherId", "name email");

        if(!student){
            res.status(404).json({
                success: false,
                message:"Student not Found"
            })
        }
        res.status(200).json({success:true,student})
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.updateStudentDetails = async (req,res) => {
    try {
        const {studentId} = req.params;
        const updates = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(studentId,updates, {new: true});

        if(!updatedStudent){
            return res.status(404).json({success:false,message:"Student not found"})
        }

        res.status(200).json({success: true, student: updatedStudent})
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.deleteStudent = async (req,res) => {
    try {
        const {studentId} = req.params;
        const student = Student.findByIdAndDelete(studentId);

        if(!student){
            return res.status(404).json({success:false,message: "Student not found"})
        }

        res.status(200).json({success:true,messsage: "Student deleted"})
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .select("-password")  // Exclude password
            .populate("subjects.subjectId", "name")
            .populate("teachers.teacherId", "name email");

        res.status(200).json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};