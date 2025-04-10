const Notification = require('../models/Notification.js')

exports.createNotification = async (req,res) => {
    try {
        const {notificationContent, studentId,teacherId} = req.body;

        const newNotification = new Notification({
            notificationContent,
            studentId,
            teacherId
        })

        await newNotification.save();
        return res.status(201).json({success: false,message: "Notification created",notification: newNotification})
    } catch (error) {
        console.error("Error creating notification:", error.message);
        res.status(500).json({ success: false, message: "Error creating notification", error: error.message });
    }
}

exports.getNotificationsByStudent = async (req,res) => {
    try {
        const {studentId} = req.params
        const notifications = await Notification.find({studentId}).sort({createdAt: -1})

        res.status(200).json({success: true,notifications})
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
    }
}

exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).populate("studentId", "name").populate("teacherId", "name");
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error.message);
        res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
    }
}

exports.getNotificationsByTeacher = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const notifications = await Notification.find({ teacherId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("Error fetching teacher notifications:", error.message);
        res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
    }
}

exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const deletedNotification = await Notification.findByIdAndDelete(notificationId);

        if (!deletedNotification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error.message);
        res.status(500).json({ success: false, message: "Error deleting notification", error: error.message });
    }
};