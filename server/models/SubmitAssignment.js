const mongoose = require('mongoose')

const submitassignmentSchema = new mongoose.Schema({
    assignmentId : {type: mongoose.Schema.Types.ObjectId, res: "Assignment", required: true},
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true},
    classroomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Classroom'},
    submissiondate: {type: Date, default: Date.now},
    fileUrl: {type: String,required: true},
    status: {type: String,enum: ["Pending", "Checked","Rejected"], default: "Pending"},
    aiScore: { type: Number, default: null }, 
    feedback: { type: String, default: "" }
},{ timestamps: true })

module.exports = mongoose.model("SubmitAssignment", submitassignmentSchema);