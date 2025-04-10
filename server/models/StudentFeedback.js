const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    formId: {type: String,required: true},
    studentId: {type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    teacherId: {type:mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    FeedBackContent: {type: String},
    Date: {type: Date,default: Date.now()}
})

module.exports = mongoose.model("Feedback", feedbackSchema);