const mongoose = require('mongoose');
const doubtChatSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject",  },
    userPrompt:{
        type: String,
        required: true,
        timestapms: { type: Date, default: Date.now },
        fileUrl: { type: String }
    },
    responses: [{
        responseId: { type: String, required: true },
        timeStamp: { type: Date, default: Date.now },
        prompt: { type: String, required: true },
        output: { type: String, required: true },
    }]
}, { timestamps: true });

module.exports = mongoose.model("DoubtChat", doubtChatSchema);
