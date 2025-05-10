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

exports.adminLogin = async (req,res) => {
    try{
        const {email,password} = req.body;
        const admin = await Admin.findOne({email});

    if(!admin){
        return res.status(404).json({message: "Admin not found"});
    }
    const isMatch = await bcrypt.compare(password, admin.password);
        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", admin.password);
        console.log("Password Match:", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generatetoken(admin, "admin");
        res.header("Authorization", `Bearer ${token}`).status(200).json({ message: "Admin logged in", token });
    }catch (error){
        res.status(500).json({ message: "Error in teacher login", error: error.message });
    }
}

exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, adminid } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !adminid) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required fields" 
      });
    }
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({  // Changed from 404 to 409 (Conflict) which is more appropriate
        success: false, 
        message: "Admin with this email already exists" 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new admin - setting both firstName and lastName to satisfy model requirements
    // but using name as the main identifier
    // Update admin creation in your adminSignup controller
    const admin = new Admin({
    firstName: name.split(' ')[0],  // First word of name
    lastName: name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : "Admin",  // Rest of name or "Admin" as fallback
    name: name,       
    email,
    password: hashedPassword,
    adminid: adminid,
    createdAt: new Date()
    });
    
    await admin.save();
    
    // Generate token
    const token = generatetoken(admin, "admin");
    
    res.header("Authorization", `Bearer ${token}`)
      .status(201)
      .json({ 
        success: true,
        message: "Admin registered successfully", 
        token 
      });
      
  } catch (error) {
    console.error("Error in admin signup:", error);
    res.status(500).json({ 
      success: false,
      message: "Error registering admin", 
      error: error.message 
    });
  }
};