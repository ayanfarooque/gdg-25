const mongoose = require("mongoose");

const assignassignment = new mongoose.Schema({
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
    attachments: [{
        url: String,
        name: String,
        type: String,
        size: Number
    }],
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft"
    },
    submissionType: {
        type: String,
        enum: ["none", "online", "offline", "both"],
        default: "none"
    },
    points: {
        type: Number,
        min: 0,
        max: 1000
    },
    gradingCriteria: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp before saving
assignassignment.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

// Indexes
assignassignment.index({ classroom: 1 });
assignassignment.index({ teacher: 1 });
assignassignment.index({ dueDate: 1 });
assignassignment.index({ status: 1 });

module.exports = mongoose.model("AssignAssignment", assignassignment);