const TestResult = require("../models/TestResult.js");

exports.getAllTestScores = async (req, res) => {
    try {
        const testScores = await TestResult.find()
            .populate("studentId", "name studentId class")
            .populate("subjectId", "subjectName")
            .populate("testId", "testName")
            .sort({ createdAt: -1 }); // Ensure field name matches your schema

        if (!testScores || testScores.length === 0) {
            return res.status(404).json({ message: "No test scores found" });
        }

        res.status(200).json(testScores);
    } catch (error) {
        console.error("Error fetching test scores:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
