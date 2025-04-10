const jwt = require("jsonwebtoken");
const Student = require("../models/Student.js");

const JWT_SECRET = process.env.JWT_SECRET;

const authStudent = async (req, res, next) => {
    try {
        console.log("Authorization Header:", req.header("Authorization")); 
        
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: Please provide a valid token" });
        }

        const token = authHeader.replace("Bearer ", "");
        console.log("Extracted Token:", token); 

        const decodedtoken = jwt.verify(token, JWT_SECRET);
        console.log("Decoded Token:", decodedtoken); 

        if (!decodedtoken || decodedtoken.role !== "student") {
            return res.status(403).json({ message: "Forbidden: Not a Student" });
        }

        const student = await Student.findById(decodedtoken.id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        req.student = student;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error); 
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = { authStudent };
