const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    testId: { type: String, required: true, unique: true },
    subjectId: {type: mongoose.Schema.Types.ObjectId,ref: "Teacher",required:true},
    teacherId: {type: mongoose.Schema.Types.ObjectId,ref:"Classroom",required:true},
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }], 
        correctAnswer: { type: String, required: true }
    }],
    timeLimit: { type: Number, default: 30 }, 
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Test", testSchema);
