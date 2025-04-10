const express = require("express");
const router = express.Router();
const doubtChatController = require("../controllers/doubtChatController");
const multer = require("multer");
const {authStudent} = require("../middleware/authStudent")
// Multer storage config for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Save images to 'uploads/' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
router.post("/ask-doubt", upload.single("image"),authStudent, doubtChatController.askDoubt);
router.get("/student/:studentId",authStudent, doubtChatController.getPreviousChats);
router.get("/:chatId/responses",authStudent, doubtChatController.getChatResponses);

module.exports = router;
