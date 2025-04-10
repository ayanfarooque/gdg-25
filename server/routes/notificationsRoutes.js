const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController.js");

router.post("/create-notification", notificationController.createNotification);
router.get("/all-notifications", notificationController.getAllNotifications);
router.get("/notification/student/:studentId", notificationController.getNotificationsByStudent);
router.get("/notification/teacher/:teacherId", notificationController.getNotificationsByTeacher);
router.delete("/notification/delete/:notificationId", notificationController.deleteNotification); // Fixed typo here

module.exports = router;
