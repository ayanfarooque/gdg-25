const mongoose = require("mongoose")

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
    },
    description: {
        type: String,
    }
}, {timestamps: true});

module.exports = mongoose.model("Subject", subjectSchema)