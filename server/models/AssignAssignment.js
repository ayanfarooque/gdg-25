const mongoose = require("mongoose");

const assignAssignmentSchema = new mongoose.Schema({
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
    subjectId: {
        name: { type: String, required: true },
        code: { type: String, required: true }
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
        required: true
    },
    status: {
        type: String,
        enum: ["draft", "published", "closed"],
        default: "draft"
    },
    instructions: {
        type: String,
        trim: true,
        maxlength: [5000, "Instructions cannot exceed 5000 characters"]
    },
    points: {
        type: Number,
        min: 0,
        max: 1000,
        default: 100
    },
    attachments: [
        {
            name: { type: String, required: true },
            type: { type: String, required: true },
            size: { type: String, required: true },
            url: { type: String }
        }
    ],
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

assignAssignmentSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("AssignAssignment", assignAssignmentSchema);




// const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

// const assignAssignmentSchema = new mongoose.Schema({
//     // Core Fields
//     title: {
//         type: String,
//         required: [true, "Title is required"],
//         trim: true,
//         maxlength: [200, "Title cannot exceed 200 characters"]
//     },
//     description: {
//         type: String,
//         trim: true,
//         maxlength: [2000, "Description cannot exceed 2000 characters"]
//     },
//     subject: {
//         type: String,
//         enum: ["Math", "Science", "History", "English", "Art", "Music", "Physical Education", "Computer Science", "Foreign Language", "Other"],
//         required: true
//     },
//     subjectId: {
//         name: { type: String, required: true },
//         code: { type: String, required: true }
//     },
//     teacher: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Teacher",
//         required: true
//     },
//     classroom: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Classroom",
//         required: true
//     },
//     dueDate: {
//         type: Date,
//         required: true,
//         validate: {
//             validator: function (v) {
//                 return v > Date.now();
//             },
//             message: "Due date must be in the future"
//         }
//     },

//     // Attachments
//     attachments: [
//         {
//             url: { type: String, required: true },
//             name: { type: String, required: true },
//             type: { type: String, enum: ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "zip"], required: true },
//             size: { type: Number, required: true, max: [50 * 1024 * 1024, "File size cannot exceed 50MB"] },
//             key: { type: String, required: true }, // For cloud storage management
//             previewUrl: String // Optional preview URL
//         }
//     ],

//     // Submission System
//     submission: {
//         file: { type: String }, // File name or URL
//         type: { type: String }, // File type (e.g., pdf, docx)
//         size: { type: Number }, // File size
//         submittedAt: { type: Date }, // Submission timestamp
//         comments: { type: String } // Comments from the student
//     },

//     // Grading System
//     grading: {
//         score: { type: Number, min: 0, max: 1000 }, // Score for the assignment
//         classAverage: { type: Number }, // Average score for the class
//         feedback: { type: String }, // Feedback from the teacher
//         rubric: [
//             {
//                 criterion: { type: String, required: true }, // Criterion name
//                 score: { type: Number, required: true }, // Score for the criterion
//                 maxScore: { type: Number, required: true } // Maximum score for the criterion
//             }
//         ]
//     },

//     // Instructions
//     instructions: {
//         type: String,
//         trim: true,
//         maxlength: [5000, "Instructions cannot exceed 5000 characters"]
//     },

//     // Points
//     points: {
//         type: Number,
//         min: 0,
//         max: 1000,
//         default: 100
//     },

//     // Timestamps
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         immutable: true
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Middleware to auto-update timestamps
// assignAssignmentSchema.pre("save", function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

// // Indexes for optimized queries
// assignAssignmentSchema.index({ classroom: 1 });
// assignAssignmentSchema.index({ teacher: 1 });
// assignAssignmentSchema.index({ dueDate: 1 });

// module.exports = mongoose.model("AssignAssignment", assignAssignmentSchema);