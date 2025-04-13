const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String  },
      state: { type: String  },
      postalCode: { type: String }
    },
    dob: { type: Date },
    grade: { 
      type: String, 
      required: true, 
      enum: ['9', '10', '11', '12', 'college'] 
    },

    academicStats: {
      growthPoints: { 
        type: Number, 
        default: 0 
      },
      totalAssignmentsSubmitted: { 
        type: Number, 
        default: 0 
      },
      classRank: Number,
      averageScore: Number
    },

    badges: [{
      name: String,
      description: String,
      awardedOn: { type: Date, default: Date.now },
      icon: String
    }],

    enrolledClassrooms: [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'Classroom' 
      }
    ],
    pendingClassroomRequests: [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'Classroom' 
      }
    ],
    joinedCommunities: [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'Community' 
      }
      ],
    pendingCommunityRequests: [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'Community' 
      }
      ],
    friends: [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'Student' 
      }
    ],
    pendingFriendRequests: [
      { type: Schema.Types.ObjectId, 
        ref: 'Student' 
      }
    ],
    performanceHistory: [{
      date: Date,
      growthPoints: Number,
      assignmentsCompleted: Number
    }],

    subjects: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectName: { type: String }
      }
    ],


    teachers: [
      {
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
        teacherName: { type: String },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" }
      }
    ],

    testScores: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectName: { type: String },
        date: { type: Date, default: () => Date.now() },
        score: { type: Number },
        total: { type: Number }
      }
    ],
    performanceHistory: [{
      date: Date,
      growthPoints: Number,
      assignmentsCompleted: Number
    }],
  },
  { timestamps: true }
);



module.exports = mongoose.model("Student", studentSchema);
