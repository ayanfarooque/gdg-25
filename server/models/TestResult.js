const mongoose =  require("mongoose")

const testResultSchema = new mongoose.Schema({
    studentId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    testId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    subjectId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    classroomId: {
        type: Number,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    MaximumMarks: {
        type: Number,
        required: true,
    },
    CratedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("TestResult", testResultSchema);