const express = require("express");
const router = express.Router();
const { getAllTestScores } = require("../controllers/testResultController"); // Ensure correct function name

router.get("/test-results", getAllTestScores);

module.exports = router;
