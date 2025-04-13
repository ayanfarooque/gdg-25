const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Classroom name is required"],
        trim: true,
        maxlength: [100, "Classroom name cannot exceed 100 characters"],
        minlength: [3, "Classroom name must be at least 3 characters long"]
    },
    code: {
        type: String,
        required: [true, "Classroom code is required"],
        unique: true,
        uppercase: true,
        match: [/^[A-Z0-9]{6,10}$/, "Please enter a valid classroom code (6-10 uppercase letters or numbers)"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"]
    },
    subject: {
        type: String,
        enum: {
            values: ["Math", "Science", "History", "English", "Art", "Music", "Physical Education", "Computer Science", "Foreign Language", "Other"],
            message: "{VALUE} is not a valid subject"
        }
    },
    gradeLevel: {
        type: String,
        enum: ["Kindergarten", "Elementary", "Middle School", "High School", "College", "Other"]
    },
    teacher: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: [true, "Teacher reference is required"]
    },
    coTeachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        validate: {
            validator: function(v) {
                // Limit classroom size to 50 students
                return this.students.length <= 50;
            },
            message: "Classroom cannot have more than 50 students"
        }
    }],
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AssignAssignment"
    }],
    performanceStats: {
        averageScore: Number,
        assignmentsCompleted: Number,
        assignmentsPending: Number
      },
    //adding this below field for sharing the resourcs in classroom also adding clodinary support till now adding files loacaly
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ["Document", "Video", "Link", "Presentation", "Other"]
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "resources.addedByModel"
        },
        addedByModel: {
            type: String,
            enum: ["Teacher", "Student"]
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    announcements: [{
        content: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isPinned: {
            type: Boolean,
            default: false
        }
    }],
    settings: {
        allowStudentPosts: {
            type: Boolean,
            default: false
        },
        studentJoinApproval: {
            type: Boolean,
            default: true
        },
        visibility: {
            type: String,
            enum: ["Public", "Private", "Invite-Only"],
            default: "Private"
        }
    },
    //adding isactive field so that inseted of deleting the classroom from the schema will just set isactive as false smart move...
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    academicYear: {
        type: String,
        required: true,
        match: [/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"]
    },
    coverImage: {
        url: String,
        thumbnailUrl: String,
        altText: String
    }
});

// Update the updatedAt field before saving
//this is kinda moongoose middleware for automaticaly saving the update time
classroomSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

// Indexes for better query performance

//Used for full-text search on the name and description fields
classroomSchema.index({ name: "text", description: "text" });

//Helps quickly find all classrooms for a given teacher.
classroomSchema.index({ teacher: 1 });

//Ensures that each classroom has a unique code (e.g., invite code).
classroomSchema.index({ code: 1 }, { unique: true });

//Ensures that each classroom has a unique code (e.g., invite code).
classroomSchema.index({ isActive: 1 });

// Virtual for student count
classroomSchema.virtual("studentCount").get(function() {
    return this.students.length;
});

// Virtual for assignment count
classroomSchema.virtual("assignmentCount").get(function() {
    return this.assignments.length;
});

// Static method to find active classrooms
classroomSchema.statics.findActive = function() {
    return this.find({ isActive: true });
};

// Static method to find by teacher
classroomSchema.statics.findByTeacher = function(teacherId) {
    return this.find({ teacher: teacherId });
};

module.exports = mongoose.model("Classroom", classroomSchema);