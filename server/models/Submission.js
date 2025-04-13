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
    default: Date.now
  },
  files: [
    {
      url: { type: String, required: true }, // Cloudinary URL
      name: { type: String, required: true },
      type: {
        type: String,
        enum: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "image", "video"],
        required: true
      },
      size: { type: Number, required: true },
      key: { type: String, required: true } // Cloudinary public ID
    }
  ],
  textAnswer: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["submitted", "late", "graded", "resubmitted"],
    default: "submitted"
  },
  evaluation: {
    score: { type: Number, min: 0, max: 100 },
    maxScore: { type: Number },
    feedback: String,
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    gradedAt: Date,
    aiFeedback: {
      scoreBreakdown: [
        {
          criteria: String,
          score: Number,
          feedback: String
        }
      ],
      overallFeedback: String,
      comparisonData: {
        classAverage: Number,
        percentile: Number,
        topPerformers: [
          {
            student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
            score: Number
          }
        ]
      }
    }
  },
  resubmissions: [
    {
      files: [
        {
          url: { type: String, required: true },
          name: { type: String, required: true },
          key: { type: String, required: true } // Cloudinary public ID
        }
      ],
      textAnswer: String,
      submittedAt: Date
    }
  ]
}, { timestamps: true });

// Middleware to auto-update `status` for late submissions
submissionSchema.pre("save", function (next) {
  if (this.submittedAt > this.assignment.dueDate) {
    this.status = "late";
  }
  next();
});

module.exports = mongoose.model("Submission", submissionSchema);