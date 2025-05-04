const express = require('express')

const router = express.Router();
const chatbotController = require('../controllers/chatbotController.js')
// const {upload} = require('../middleware/multer.js')

//after authentication going to add /:id and will get previous chats for user accordingly
router.get('/userprompthistory',chatbotController.getPreviousChats)
router.post('/askdoubt',chatbotController.askDoubt)
module.exports = router