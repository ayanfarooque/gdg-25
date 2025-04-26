const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
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
    submittedAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["submitted", "late", "graded", "returned"],
        default: "submitted"
    },
    files: [{
        name: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: String, required: true },
        url: { type: String }
    }],
    comments: {
        type: String
    },
    grading: {
        score: { type: Number },
        classAverage: { type: Number },
        feedback: { type: String },
        rubric: [{
            criterion: { type: String },
            score: { type: Number },
            maxScore: { type: Number }
        }],
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
        },
        gradedAt: {
            type: Date
        }
    },
    resubmissions: [{
        files: [{
            name: { type: String },
            type: { type: String },
            size: { type: String },
            url: { type: String }
        }],
        submittedAt: { type: Date },
        comments: { type: String }
    }]
}, { timestamps: true });

// Auto-set status based on due date
submissionSchema.pre("save", async function(next) {
    if (this.isNew) {
        const assignment = await mongoose.model("AssignAssignment").findById(this.assignment);
        if (assignment && this.submittedAt > assignment.dueDate) {
            this.status = "late";
        }
    }
    next();
});

// Update assignment's submissions array when new submission is created
submissionSchema.post("save", async function(doc) {
    await mongoose.model("AssignAssignment").findByIdAndUpdate(
        doc.assignment,
        { $addToSet: { submissions: doc._id } }
    );
});

module.exports = mongoose.model("Submission", submissionSchema);


// const mongoose = require("mongoose");

// const submissionSchema = new mongoose.Schema({
//   assignment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "AssignAssignment",
//     required: true
//   },
//   student: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Student",
//     required: true
//   },
//   submittedAt: {
//     type: Date,
//     default: Date.now
//   },
//   files: [
//     {
//       url: { type: String, required: true }, // Cloudinary URL
//       name: { type: String, required: true },
//       type: {
//         type: String,
//         enum: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "image", "video"],
//         required: true
//       },
//       size: { type: Number, required: true },
//       key: { type: String, required: true } // Cloudinary public ID
//     }
//   ],
//   textAnswer: {
//     type: String,
//     trim: true
//   },
//   status: {
//     type: String,
//     enum: ["submitted", "late", "graded", "resubmitted"],
//     default: "submitted"
//   },
//   evaluation: {
//     score: { type: Number, min: 0, max: 100 },
//     maxScore: { type: Number },
//     feedback: String,
//     gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
//     gradedAt: Date,
//     aiFeedback: {
//       scoreBreakdown: [
//         {
//           criteria: String,
//           score: Number,
//           feedback: String
//         }
//       ],
//       overallFeedback: String,
//       comparisonData: {
//         classAverage: Number,
//         percentile: Number,
//         topPerformers: [
//           {
//             student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
//             score: Number
//           }
//         ]
//       }
//     }
//   },
//   resubmissions: [
//     {
//       files: [
//         {
//           url: { type: String, required: true },
//           name: { type: String, required: true },
//           key: { type: String, required: true } // Cloudinary public ID
//         }
//       ],
//       textAnswer: String,
//       submittedAt: Date
//     }
//   ]
// }, { timestamps: true });

// // Middleware to auto-update `status` for late submissions
// submissionSchema.pre("save", function (next) {
//   if (this.submittedAt > this.assignment.dueDate) {
//     this.status = "late";
//   }
//   next();
// });

// module.exports = mongoose.model("Submission", submissionSchema);