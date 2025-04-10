// const mongoose = require("mongoose");

// const assignmentChatSchema = new mongoose.Schema({
//     chatId: { type: String, required: true, unique: true },
//     assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
//     subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
//     teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
//     classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
//     responses: [{
//         responseId: { type: String, required: true },
//         timeStamp: { type: Date, default: Date.now },
//         prompt: { type: String, required: true },
//         output: { type: String, required: true },
//         fileUrl: { type: String } 
//     }],
//     aiScore: { type: Number, default: null }, 
//     feedback: { type: String, default: "" }
// }, { timestamps: true });

// module.exports = mongoose.model("AssignmentChat", assignmentChatSchema);

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  studentid: { type: String, required: true },
  subjectid: { type: String, required: true },
  teacherid: { type: String, required: true },
  assignmentId: { type: String, required: true },
  classroomId: { type: String, required: true },
  chatId: { type: String, required: true },
  filePath: { type: String, required: true },  // Path to the file in the system
  fileName: { type: String, required: true },  // Original file name
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
