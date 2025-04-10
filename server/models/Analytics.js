const analyticsSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true 
    },
    studyHours: { 
        type: Number,
        default: 0
    },
    scores: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectName: { type: String },
        tests: [{
            testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
            testDate: { type: Date, required: true },
            testMarks: { type: Number, required: true }
        }]
    }],
    growthPoints: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectPoints: { type: Number, default: 0 }
    }],
    totalGrowthPoints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Analytics", analyticsSchema);
