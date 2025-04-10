const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    address: { type: String },
    dob: { type: Date, required: true },
    
    subjects: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectName: { type: String }
    }],

    students: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        studyHours: { type: Number, default: 0 },
        scores: [{
            subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
            marks: [{ testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" }, testMarks: { type: Number } }]
        }],
        growthPoints: [{ subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" }, subjectPoints: { type: Number } }]
    }]
}, { timestamps: true });

// teacherSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// }
// );

module.exports = mongoose.model("Teacher", teacherSchema);


// const teacherSchema = new mongoose.Schema({
//     teacherId: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     address: { type: String },
//     dob: { type: Date, required: true },
//     subjects: [{
//         subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
//         subjectName: { type: String }
//     }],
//     students: [{
//         studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
//         studyHours: { type: Number, default: 0 },
//         scores: [{
//             subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
//             subjectName: { type: String },
//             marks: [{
//                 testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
//                 testMarks: { type: Number }
//             }]
//         }],
//         growthPoints: [{
//             subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
//             subjectPoints: { type: Number }
//         }]
//     }]
// }, { timestamps: true });

// module.exports = mongoose.model("Teacher", teacherSchema);
