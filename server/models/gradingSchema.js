const mongoose = require("mongoose");

const gradingSchema = new mongoose.Schema({
    submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission",
        required: true,
        unique: true
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AssignAssignment",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    score: {
        type: Number,
        min: 0
    },
    maxScore: {
        type: Number,
        required: true
    },
    feedback: {
        type: String
    },
    rubric: [{
        criterion: { type: String, required: true },
        score: { type: Number, required: true },
        maxScore: { type: Number, required: true },
        comments: { type: String }
    }],
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    }
}, { timestamps: true });

// Update submission status when graded
gradingSchema.post("save", async function(doc) {
    await mongoose.model("Submission").findByIdAndUpdate(
        doc.submission,
        { 
            status: "graded",
            "grading.score": doc.score,
            "grading.feedback": doc.feedback,
            "grading.rubric": doc.rubric
        }
    );
});

module.exports = mongoose.model("Grading", gradingSchema);