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
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true }
    },
    dob: { type: Date, required: true },
    grade: { type: String, required: true },
    growthPoints: { type: Number, default: 0 },
    guardianName: { type: String },

    subjects: [
      {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        subjectName: { type: String }
      }
    ],

    isWeakStudent: { type: Boolean, default: false },
    isTopStudent: { type: Boolean, default: false },

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

    badges: [{ type: String }]
  },
  { timestamps: true }
);



module.exports = mongoose.model("Student", studentSchema);
