const { response } = require('express');
const Doubtchat = require('../models/Doubtchat.js');
const aiservices = require('../services/mlService.js')

exports.askDoubt = async (req,res) => {
    try {
        const {chatId,StudentId,subjectId,prompt} = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if(!prompt && !fileUrl){
            return res.status(400).json({success: false, message: 'enter either prompt or upload file'})
        }

        let aiResponse;
        if(prompt){
            aiResponse = await aiservices.generateResponse(prompt);
        }else if(fileUrl){
            aiResponse = await aiservices.processImage(fileUrl);
        }

        let doubtchat = await Doubtchat.findOne({chatId});

        if(!doubtchat){
            doubtchat = new doubtchat({
                chatId,
                studentId,
                subjectId,
                responses: []
            })
        }

        const newResponse = {
            responseId: new Date().getTime().toString(),
            timeStamp: new Date(),
            prompt,
            output: aiResponse,
            fileUrl
        }
        doubtchat.responses.push(newResponse);
        await doubtchat.save();

        res.status(200).json({ success: true, message: "Response saved", doubtChat });
    } catch (error) {
        
    }
}

exports.getPreviousChats = async (req, res) => {
    try {
        const { studentId } = req.params;
        const chats = await DoubtChat.find({ studentId }).sort({ createdAt: -1 });

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