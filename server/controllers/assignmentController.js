const Assignment = require('../models/Assignment.js')
const SubmitAssignment = require('../models/SubmitAssignment.js');
//const { gradeassignment } = require('../services/mlService.js')


//student can upload assignment in client assignment chat body 

exports.uploadAssignment = async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
    
        const { studentid, subjectid, teacherid, assignmentId, classroomId, chatId } = req.body;
    
        if (!studentid || !subjectid || !teacherid || !assignmentId || !classroomId || !chatId) {
          return res.status(400).json({ success: false, message: 'All fields are required', missingFields: { studentid: !studentid, subjectid: !subjectid, teacherid: !teacherid, assignmentId: !assignmentId, classroomId: !classroomId, chatId: !chatId } });
        }
    
        // Save the file metadata in the database
        const newAssignment = new Assignment({
          studentid,
          subjectid,
          teacherid,
          assignmentId,
          classroomId,
          chatId,
          filePath: req.file.path, // Store the file path in the database
          fileName: req.file.filename, // Store the file name in the database
        });
    
        await newAssignment.save();
    
        res.json({ success: true, message: 'Assignment uploaded successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error uploading assignment' });
      }
    };
  

exports.getpreviousassignments = async (req, res) => {
    try {
        const { studentid } = req.params;
        const assignments = await SubmitAssignment.find({ studentId: studentid })
            .sort({ createdAt: -1 })
            .populate("assignmentId", "title dueDate");

        res.status(200).json({ success: true, assignments });
    } catch (error) {
        console.error("Error fetching previous assignments:", error.message);
        res.status(500).json({ success: false, message: "Error fetching assignments" });
    }
};

exports.getsingleassignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await SubmitAssignment.findById(assignmentId).populate("assignmentId");

        if (!assignment) {
            return res.status(404).json({ success: false, message: "Assignment not found" });
        }

        res.status(200).json({ success: true, assignment });
    } catch (error) {
        console.error("Error fetching assignment:", error.message);
        res.status(500).json({ success: false, message: "Error fetching assignment" });
    }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await SubmitAssignment.find().populate("studentId").populate("assignmentId").populate("classroomId");
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

exports.getStudentSubmissions = async (req, res) => {
  try {
    const { studentId } = req.params;
    const submissions = await SubmitAssignment.find({ studentId }).populate("assignmentId");
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student's assignments" });
  }
};