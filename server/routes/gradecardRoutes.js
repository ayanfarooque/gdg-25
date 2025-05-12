const express = require('express')
const router = express.Router();
const gradecardController = require('../controllers/gradecardController');

// Route to save AI-generated grade card
router.post('/save', gradecardController.saveAIGeneratedGradeCard);

// Export the router
module.exports = router;

