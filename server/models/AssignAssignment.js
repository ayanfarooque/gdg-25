const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const assignAssignmentSchema = new mongoose.Schema({
    // Core Fields (from your original schema)
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    subject: {
        type: String,
        enum: ["Math", "Science", "History", "English", "Art", "Music", "Physical Education", "Computer Science", "Foreign Language", "Other"],
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v > Date.now();
            },
            message: "Due date must be in the future"
        }
    },

    // Enhanced Attachments (with cloud storage support)
    attachments: [{
        url: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"],
            required: true
        },
        size: {
            type: Number,
            required: true,
            max: [50 * 1024 * 1024, "File size cannot exceed 50MB"]
        },
        key: {  // For cloud storage management (e.g., AWS S3)
            type: String,
            required: true
        },
        previewUrl: String  // PDF thumbnail URL
    }],

    // Submission System (critical addition)
    submissions: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        documents: [{
            url: String,
            name: String,
            type: String,
            size: Number
        }],
        textAnswer: String,
        submittedAt: {
            type: Date,
            default: Date.now
        },
        grade: {
            type: Number,
            min: 0,
            max: 100
        },
        feedback: String,
        isLate: Boolean  // Auto-calculated
    }],

    // Status & Workflow (enhanced)
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    accessCode: {  // For secure sharing
        type: String,
        default: () => uuidv4().slice(0, 8).toUpperCase()
    },

    // Grading (structured system)
    points: {
        type: Number,
        min: 0,
        max: 1000,
        default: 100
    },
    gradingRubric: {
        criteria: [{
            name: String,
            points: Number,
            description: String
        }],
        notes: String
    },

    // Timestamps (kept from your original)
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware (auto-update timestamps)
assignAssignmentSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    
    // Auto-set isLate for submissions
    if (this.submissions && this.isModified("submissions")) {
        this.submissions.forEach(sub => {
            sub.isLate = sub.submittedAt > this.dueDate;
        });
    }
    next();
});

// Indexes (optimized queries)
assignAssignmentSchema.index({ classroom: 1 });
assignAssignmentSchema.index({ teacher: 1 });
assignAssignmentSchema.index({ dueDate: 1 });
assignAssignmentSchema.index({ status: 1, isActive: 1 });

// Virtuals (auto-calculated fields)
assignAssignmentSchema.virtual("submissionCount").get(function() {
    return this.submissions.length;
});

assignAssignmentSchema.virtual("daysRemaining").get(function() {
    return Math.ceil((this.dueDate - Date.now()) / (1000 * 60 * 60 * 24));
});

// Instance Methods (workflow helpers)
assignAssignmentSchema.methods.addSubmission = async function(studentId, files, textAnswer) {
    const submission = {
        student: studentId,
        documents: files || [],
        textAnswer: textAnswer || "",
        submittedAt: new Date(),
        isLate: new Date() > this.dueDate
    };
    this.submissions.push(submission);
    await this.save();
    return submission;
};

module.exports = mongoose.model("AssignAssignment", assignAssignmentSchema);


// const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

// const assignAssignmentSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, "Title is required"],
//     trim: true,
//     maxlength: [200, "Title cannot exceed 200 characters"]
//   },
//   description: {
//     type: String,
//     trim: true,
//     maxlength: [2000, "Description cannot exceed 2000 characters"]
//   },
//   //going to create sepreate schema for this subject,shayad kaam aur easy hojaye harbar neye subjects add nahi karne padege aalag se
//   subject: {
//     type: String,
//     enum: [
//       "Math",
//       "Science",
//       "History",
//       "English",
//       "Art",
//       "Music",
//       "Physical Education",
//       "Computer Science",
//       "Foreign Language",
//       "Other"
//     ],
//     required: true
//   },
//   teacher: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Teacher",
//     required: true
//   },
//   classroom: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Classroom",
//     required: true
//   },
//   dueDate: {
//     type: Date,
//     required: true,
//     validate: {
//       validator: function (v) {
//         return v > Date.now();
//       },
//       message: "Due date must be in the future"
//     }
//   },
//   attachments: [
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
//   submissions: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Submission"
//     }
//   ],
//   status: {
//     type: String,
//     enum: ["draft", "published", "archived"],
//     default: "draft"
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   accessCode: {
//     type: String,
//     default: () => uuidv4().slice(0, 8).toUpperCase()
//   },
//   points: {
//     type: Number,
//     min: 0,
//     max: 1000,
//     default: 100
//   },
//   gradingRubric: {
//     criteria: [
//       {
//         name: String,
//         points: Number,
//         description: String
//       }
//     ],
//     notes: String
//   }
// }, { timestamps: true });

// // Middleware to auto-update timestamps
// assignAssignmentSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

// // Virtuals for derived data
// assignAssignmentSchema.virtual("submissionCount").get(function () {
//   return this.submissions.length;
// });

// assignAssignmentSchema.virtual("daysRemaining").get(function () {
//   return Math.ceil((this.dueDate - Date.now()) / (1000 * 60 * 60 * 24));
// });

// module.exports = mongoose.model("AssignAssignment", assignAssignmentSchema);
