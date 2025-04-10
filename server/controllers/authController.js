const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');

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
