const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

const assignmentRoutes = require('./routes/assignmentRoutes.js');
const studentRoutes = require('./routes/studentRoutes.js');
const teacherRoutes = require('./routes/teacherRoutes.js');
const subjectRoutes = require('./routes/subjectRoutes.js');
const testResultRoutes = require('./routes/testResultRoutes.js')
const notificationRoutes = require('./routes/notificationsRoutes.js')
const newsRoute = require('./routes/newsRoute.js')
const resourceRoutes = require('./routes/resourceRoutes.js')
require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use("/api/assignments", assignmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use('/api/test-scores',testResultRoutes);
app.use('/api/news',newsRoute)
app.use('/api/notify',notificationRoutes)
app.use('/api/resources',resourceRoutes)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
