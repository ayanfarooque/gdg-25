const { response } = require('express');
const Doubtchat = require('../models/Doubtchat.js');
const aiservices = require('../services/mlService.js')
const DoubtChat = require('../models/Doubtchat');
const asyncHandler = require('express-async-handler');

exports.askDoubt = asyncHandler(async (req, res) => {
    try {
        const { question, subjectId, fileUrl } = req.body;
       // const userId = req.params // Assuming you're using auth middleware

        // Validate required fields
        if (!question) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide a question" 
            });
        }

        // if (!subjectId) {
        //     return res.status(400).json({ 
        //         success: false, 
        //         message: "Please provide a subject" 
        //     });
        // }

        // Create new chat
        const chat = new DoubtChat({
            chatId: `chat_${Date.now()}`,
           // userId: userId,
            subjectId: subjectId,
            userPrompt: question,
            responses: [] // Initialize empty responses array
        });

        if (fileUrl) {
            chat.userPrompt.fileUrl = fileUrl;
        }

        // Save the chat
        const savedChat = await chat.save();

        // Fetch the populated chat
        const populatedChat = await DoubtChat.find()
            .populate('userId', 'name email')
            .populate('subjectId', 'name');

        res.status(201).json({
            success: true,
            message: "Question saved successfully",
            data: populatedChat
        });

    } catch (error) {
        console.error('Error in askDoubt:', error);
        res.status(500).json({
            success: false,
            message: "Error processing your question",
            error: error.message
        });
    }
});
exports.getPreviousChats = async (req, res) => {
    try {
        //after authentication going to add /:id and will get previous chats for user accordingly
        // const { userId } = req.params;
        const chats = await Doubtchat.find().sort({ createdAt: -1 });

        if (!chats.length) {
            return res.status(404).json({ success: false, message: "No previous chats found" });
        }

        res.status(200).json({ success: true, chats });
    } catch (error) {
        console.error("Error fetching previous chats:", error.message);
        res.status(500).json({ success: false, message: "Error occurred while fetching previous chats" });
    }
};

exports.getChatResponses = async (req, res) => {
    try {
        const { chatId } = req.params;
        const doubtChat = await DoubtChat.findOne({ chatId });

        if (!doubtChat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        res.status(200).json({ success: true, responses: doubtChat.responses });
    } catch (error) {
        console.error("Error fetching chat responses:", error.message);
        res.status(500).json({ success: false, message: "Error occurred while fetching chat responses" });
    }
};

module.exports = exports