const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    notificationId: { type: String },
    notificationTime: { type: Date, default: Date.now }, 
    notificationContent: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
