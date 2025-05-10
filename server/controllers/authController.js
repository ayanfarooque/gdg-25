const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');
const Admin = require('../models/Admin.js')
const JWT_SECRET = process.env.JWT_SECRET;

// Common function to generate token for student and teacher
const generatetoken = (user, role) => {
    return jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: "1d" });
};

exports.studentsSignUp = async (req, res) => {
    try {
        const { name, address, dob, grade, email, password } = req.body;

        if (!name || !address || !dob || !grade || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill the required fields" });
        }

        const existstudent = await Student.findOne({ email });
        if (existstudent) {
            return res.status(400).json({ success: false, message: "Student Already exists" });
        }

        const hasspass = await bcrypt.hash(password, 10);
        const student = new Student({
            name,
            address,
            dob,
            grade,
            email,
            password: hasspass
        });

        await student.save();
        const token = generatetoken(student, "student");

        res.header("Authorization", `Bearer ${token}`).status(201).json({ message: "Student Registered", token });
    } catch (error) {
        res.status(500).json({ message: "Error in student signup", error: error.message });
    }
};

exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ success: false, message: "Student Not Found" });
        }

        const ismatch = await bcrypt.compare(password, student.password);
        if (!ismatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = generatetoken(student, "student");
        res.header("Authorization", `Bearer ${token}`).status(200).json({ message: "Student Logged in", token });
    } catch (error) {
        res.status(500).json({ message: "Error in student login", error: error.message });
    }
};

exports.teacherSignup = async (req, res) => {
    try {
        const { teacherId, name, address, dob, email, password } = req.body;

        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: "Teacher already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = new Teacher({ teacherId, name, address, dob, email, password: hashedPassword });

        await teacher.save();
        const token = generatetoken(teacher, "teacher");

        res.header("Authorization", `Bearer ${token}`).status(201).json({ message: "Teacher registered", token });
    } catch (error) {
        res.status(500).json({ message: "Error in teacher signup", error: error.message });
    }
};

exports.teacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", teacher.password);
        console.log("Password Match:", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generatetoken(teacher, "teacher");
        res.header("Authorization", `Bearer ${token}`).status(200).json({ message: "Teacher logged in", token });
    } catch (error) {
        res.status(500).json({ message: "Error in teacher login", error: error.message });
    }
};

exports.adminSignup = async (req, res) => {
    try {
        const { name, email, password, adminid } = req.body;

        if (!name || !email || !password || !adminid) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        const admin1 = await Admin.findOne({ email });
        if (admin1) {
            return res.status(400).json({ 
                success: false,
                message: "Admin already exists" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create with new schema structure
        const admin = new Admin({ 
            name, 
            email, 
            password: hashedPassword,
            adminid
        });

        await admin.save();
        const token = generatetoken(admin, "admin");

        res.header("Authorization", `Bearer ${token}`)
           .status(201)
           .json({ 
               success: true,
               message: "Admin registered successfully", 
               token 
            });
    } catch (error) {
        console.error("Admin signup error:", error);
        res.status(500).json({ 
            success: false,
            message: "Error in admin signup", 
            error: error.message 
        });
    }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }
    
    // Find admin with standalone model
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }
    
    // Compare passwords (regular await instead of callback)
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }
    
    // Generate token
    const token = generatetoken(admin, "admin");
    
    // Return successful response
    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token: token
    });
    
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Error in admin login",
      error: error.message
    });
  }
};

exports.resetAdminPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // Find the admin
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the admin directly with the new password using updateOne to bypass schema validation
    await Admin.updateOne(
      { _id: admin._id },
      { $set: { password: hashedPassword } }
    );
    
    res.status(200).json({
      success: true,
      message: "Admin password reset successfully"
    });
    
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message
    });
  }
};