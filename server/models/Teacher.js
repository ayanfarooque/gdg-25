const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose; 
const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    address: { type: String },
    dob: { type: Date, required: true },
    contactNumber: String,
    subjects: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectName: { type: String }
    }],

    qualifications: [{
        degree: String,
        institution: String,
        year: Number
      }],

      gradesTaught: [
            { 
                type: String, 
                enum: ['9', '10', '11', '12', 'college'] 
            }
        ],

      assignedClassrooms: [
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
        performanceHistory: [
            {
            date: Date,
            studentsTaught: Number,
            assignmentsCreated: Number
            }
        ],
        teachingStats: {
            totalStudents: { 
                type: Number, 
                default: 0 
            },
            totalAssignmentsCreated: { 
                type: Number, 
                default: 0 
            },
            averageClassPerformance: { 
                type: Number, 
                default: 0 
            }
        },
        performanceHistory: [{
            date: Date,
            studentsTaught: Number,
            assignmentsCreated: Number
          }],
        students: [{
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
            studyHours: { type: Number, default: 0 },
            scores: [{
                subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
                marks: [{ testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" }, testMarks: { type: Number } }]
            }],
        growthPoints: [
            { 
                subjectId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "Subject" 
                }, 
                subjectPoints: { 
                    type: Number 
                } 
            }
        ]
    }]
}, { timestamps: true });

// teacherSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// }
// );

module.exports = mongoose.model("Teacher", teacherSchema);

