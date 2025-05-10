const express = require("express");
const router = express.Router();
const { getAllTestScores } = require("../controllers/testResultController"); // Ensure correct function name
const testgenController = require("../controllers/testgenController.js")
router.get("/test-results", getAllTestScores);
router.post('/generate',  testgenController.saveGeneratedTest);
router.get('/generated',  testgenController.listGeneratedTests);
module.exports = router;
