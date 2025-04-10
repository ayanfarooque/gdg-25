const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String},
    date: {type: Date, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId,ref: "Teacher"},
    studentIds: [{type: mongoose.Schema.Types.ObjectId,ref: "Student"}]
},{timestamps: true})

module.exports = mongoose.model("Event",eventSchema)