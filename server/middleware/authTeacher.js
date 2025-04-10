const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher.js");

const authTeacher = async (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
  
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== "teacher") {
        return res.status(403).json({ message: "Forbidden: Not a teacher" });
      }
  
      const teacher = await Teacher.findById(decoded.id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      req.teacher = teacher;
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };

  module.exports = { authTeacher };