const Teacher = require('../models/Teacher.js')

// exports.addTeacher = async (req,res) => {
//     try {
//         const {name, address,dob,subjects} = req.body;

//         const teacher = new Teacher({
//             name,
//             address,
//             dob,
//             subjects
//         })
//         await teacher.save()

//         res.status(201).json({
//             success:false,
//             error: error.message
//         })
//     } catch (error) {
//         res.status(500).json({success:false,error: error.message})
//     }
// }

exports.getTeacherDetails = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        res.status(200).json({ success: true, teacher });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};