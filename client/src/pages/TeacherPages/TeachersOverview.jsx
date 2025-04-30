import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiHome, FiCalendar, FiBook, FiFileText, 
  FiTrendingUp, FiSettings, FiBell, FiSearch,
  FiChevronRight, FiChevronsRight, FiCheckCircle, FiUsers
} from 'react-icons/fi';
import FacHeader from '../../pages/Dashboardpages/facheader';
import Analytics from '../../components/TeacherHome/Analytics';
import TeacherProfile from '../../components/TeacherHome/TeacherProfile';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const TeacherHomePage = () => {
  const [selectedClass, setSelectedClass] = useState('Class 9A');
  const [graphType, setGraphType] = useState('performance');
  const [teacherName, setTeacherName] = useState('Ms. Johnson');
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const classes = [
    'Class 9A',
    'Class 10B',
    'Class 11A',
    'Class 12C',
  ];
  
  // Set appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const classPerformanceData = {
    'Class 9A': {
      performance: [
        { subject: 'Quiz 1', average: 72, topScore: 95, lowestScore: 45 },
        { subject: 'Mid-Term', average: 68, topScore: 92, lowestScore: 42 },
        { subject: 'Project', average: 84, topScore: 98, lowestScore: 65 },
        { subject: 'Quiz 2', average: 76, topScore: 97, lowestScore: 50 },
        { subject: 'Final', average: 79, topScore: 96, lowestScore: 55 },
      ],
      attendance: [
        { month: 'Aug', present: 92, absent: 8 },
        { month: 'Sep', present: 88, absent: 12 },
        { month: 'Oct', present: 90, absent: 10 },
        { month: 'Nov', present: 95, absent: 5 },
        { month: 'Dec', present: 85, absent: 15 },
      ],
      distribution: [
        { name: 'A (90-100%)', value: 6 },
        { name: 'B (80-89%)', value: 10 },
        { name: 'C (70-79%)', value: 8 },
        { name: 'D (60-69%)', value: 4 },
        { name: 'F (Below 60%)', value: 2 },
      ]
    },
    'Class 10B': {
      performance: [
        { subject: 'Quiz 1', average: 75, topScore: 94, lowestScore: 52 },
        { subject: 'Mid-Term', average: 72, topScore: 96, lowestScore: 48 },
        { subject: 'Project', average: 88, topScore: 100, lowestScore: 68 },
        { subject: 'Quiz 2', average: 80, topScore: 98, lowestScore: 60 },
        { subject: 'Final', average: 82, topScore: 97, lowestScore: 64 },
      ],
      attendance: [
        { month: 'Aug', present: 94, absent: 6 },
        { month: 'Sep', present: 91, absent: 9 },
        { month: 'Oct', present: 93, absent: 7 },
        { month: 'Nov', present: 97, absent: 3 },
        { month: 'Dec', present: 89, absent: 11 },
      ],
      distribution: [
        { name: 'A (90-100%)', value: 8 },
        { name: 'B (80-89%)', value: 12 },
        { name: 'C (70-79%)', value: 6 },
        { name: 'D (60-69%)', value: 3 },
        { name: 'F (Below 60%)', value: 1 },
      ]
    },
    'Class 11A': {
      performance: [
        { subject: 'Quiz 1', average: 70, topScore: 90, lowestScore: 50 },
        { subject: 'Mid-Term', average: 65, topScore: 88, lowestScore: 40 },
        { subject: 'Project', average: 78, topScore: 95, lowestScore: 60 },
        { subject: 'Quiz 2', average: 72, topScore: 92, lowestScore: 55 },
        { subject: 'Final', average: 75, topScore: 94, lowestScore: 52 },
      ],
      attendance: [
        { month: 'Aug', present: 90, absent: 10 },
        { month: 'Sep', present: 86, absent: 14 },
        { month: 'Oct', present: 88, absent: 12 },
        { month: 'Nov', present: 92, absent: 8 },
        { month: 'Dec', present: 84, absent: 16 },
      ],
      distribution: [
        { name: 'A (90-100%)', value: 4 },
        { name: 'B (80-89%)', value: 8 },
        { name: 'C (70-79%)', value: 12 },
        { name: 'D (60-69%)', value: 5 },
        { name: 'F (Below 60%)', value: 3 },
      ]
    },
    'Class 12C': {
      performance: [
        { subject: 'Quiz 1', average: 78, topScore: 96, lowestScore: 55 },
        { subject: 'Mid-Term', average: 74, topScore: 94, lowestScore: 50 },
        { subject: 'Project', average: 86, topScore: 99, lowestScore: 70 },
        { subject: 'Quiz 2', average: 82, topScore: 98, lowestScore: 65 },
        { subject: 'Final', average: 85, topScore: 97, lowestScore: 68 },
      ],
      attendance: [
        { month: 'Aug', present: 95, absent: 5 },
        { month: 'Sep', present: 93, absent: 7 },
        { month: 'Oct', present: 94, absent: 6 },
        { month: 'Nov', present: 96, absent: 4 },
        { month: 'Dec', present: 92, absent: 8 },
      ],
      distribution: [
        { name: 'A (90-100%)', value: 9 },
        { name: 'B (80-89%)', value: 11 },
        { name: 'C (70-79%)', value: 5 },
        { name: 'D (60-69%)', value: 2 },
        { name: 'F (Below 60%)', value: 1 },
      ]
    },
  };
  
  const COLORS = ['#4C51BF', '#38A169', '#E53E3E', '#D69E2E', '#9F7AEA'];

  const getStudentCountByClass = () => {
    return [
      { name: 'Class 9A', count: 30 },
      { name: 'Class 10B', count: 28 },
      { name: 'Class 11A', count: 32 },
      { name: 'Class 12C', count: 26 },
    ];
  };

  const renderClassPerformanceGraph = () => {
    const classData = classPerformanceData[selectedClass];
    
    if (graphType === 'performance') {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={classData.performance}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, '']}
                labelFormatter={(label) => `Assessment: ${label}`}
              />
              <Legend />
              <Bar dataKey="average" name="Class Average" fill="#4C51BF" />
              <Bar dataKey="topScore" name="Top Score" fill="#38A169" />
              <Bar dataKey="lowestScore" name="Lowest Score" fill="#E53E3E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (graphType === 'attendance') {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={classData.attendance}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="present" name="Present" stroke="#38A169" strokeWidth={2} />
              <Line type="monotone" dataKey="absent" name="Absent" stroke="#E53E3E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (graphType === 'distribution') {
      return (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={classData.distribution}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {classData.distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} students`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }
  };

  const renderQuickStats = () => {
    const classData = classPerformanceData[selectedClass];
    const averagePerformance = classData.performance.reduce((sum, item) => sum + item.average, 0) / classData.performance.length;
    const averageAttendance = classData.attendance.reduce((sum, item) => sum + item.present, 0) / classData.attendance.length;
    const totalStudents = classData.distribution.reduce((sum, item) => sum + item.value, 0);
    const passRate = ((totalStudents - classData.distribution[4].value) / totalStudents * 100).toFixed(1);
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Average Performance</h3>
          <p className="text-2xl font-bold text-indigo-600">{averagePerformance.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Attendance Rate</h3>
          <p className="text-2xl font-bold text-green-600">{averageAttendance.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Pass Rate</h3>
          <p className="text-2xl font-bold text-blue-600">{passRate}%</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
          <p className="text-2xl font-bold text-purple-600">{totalStudents}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-gray-800 font-sans">
      <FacHeader />
      
      <div className="flex min-h-screen pt-16">
        {/* Main Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-6 ml-30 transition-all duration-300 ease-in-out"
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <motion.h1 
                variants={itemVariants}
                className="text-3xl font-bold tracking-tight text-gray-800"
              >
                {greeting}, {teacherName}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-gray-500 mt-1">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </motion.p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <QuickStatCard 
              title="Students" 
              value="116" 
              change="+3" 
              changeType="positive" 
              timeframe="This Month" 
              icon={<FiUsers className="text-blue-500" size={20} />}
              color="bg-blue-50 border-blue-100"
            />
            <QuickStatCard 
              title="Class Average" 
              value="76%" 
              change="+4%" 
              changeType="positive" 
              timeframe="from last month" 
              icon={<FiTrendingUp className="text-green-500" size={20} />}
              color="bg-green-50 border-green-100"
            />
            <QuickStatCard 
              title="Assignments" 
              value="18" 
              change="6 pending" 
              timeframe="to be graded" 
              icon={<FiFileText className="text-orange-500" size={20} />}
              color="bg-orange-50 border-orange-100"
            />
            <QuickStatCard 
              title="Upcoming Classes" 
              value="5" 
              changeType="neutral" 
              timeframe="Today" 
              icon={<FiCalendar className="text-purple-500" size={20} />}
              color="bg-purple-50 border-purple-100"
            />
          </motion.div>

          {/* Analytics Overview */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-lg text-gray-800">Class Analytics Overview</h2>
                <p className="text-sm text-gray-500">Performance metrics across all your classes</p>
              </div>
              <div className="transition-transform transform hover:scale-101 duration-300 p-4">
                <Analytics />
              </div>
            </div>
          </motion.div>
          
          {/* Class Performance and Schedule Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Class Performance */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="font-semibold text-lg text-gray-800">Class Performance Dashboard</h2>
                      <p className="text-sm text-gray-500">Track student progress and performance</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select 
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        {classes.map(className => (
                          <option key={className} value={className}>{className}</option>
                        ))}
                      </select>
                      
                      <select 
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={graphType}
                        onChange={(e) => setGraphType(e.target.value)}
                      >
                        <option value="performance">Test Performance</option>
                        <option value="attendance">Attendance</option>
                        <option value="distribution">Grade Distribution</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  {/* Quick Stats for the selected class */}
                  {renderQuickStats()}
                  
                  {/* Class Performance Graph */}
                  {renderClassPerformanceGraph()}
                </div>
              </div>
            </motion.div>

            {/* Schedule Column */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-semibold text-lg text-gray-800">Today's Schedule</h2>
                  <p className="text-sm text-gray-500">Your classes and appointments</p>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <ScheduleItem 
                      time="08:30 AM" 
                      title="Class 10B" 
                      subtitle="Mathematics - Algebra" 
                      status="completed" 
                    />
                    <ScheduleItem 
                      time="10:15 AM" 
                      title="Class 9A" 
                      subtitle="Science - Physics" 
                      status="ongoing"
                      highlight={true}
                    />
                    <ScheduleItem 
                      time="12:00 PM" 
                      title="Faculty Meeting" 
                      subtitle="Conference Room B" 
                      status="upcoming" 
                    />
                    <ScheduleItem 
                      time="01:30 PM" 
                      title="Class 11A" 
                      subtitle="Computer Science" 
                      status="upcoming" 
                    />
                    <ScheduleItem 
                      time="03:15 PM" 
                      title="Class 12C" 
                      subtitle="Advanced Mathematics" 
                      status="upcoming" 
                    />
                  </div>
                  
                  <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    View Full Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Bottom Row - Assignments to Grade and Student Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Assignments to Grade */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">Assignments to Grade</h2>
                    <p className="text-sm text-gray-500">Pending submissions</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
                </div>
                <div className="p-4">
                  <AssignmentsToGrade />
                </div>
              </div>
            </motion.div>
            
            {/* Student Distribution */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-semibold text-lg text-gray-800">Student Distribution by Class</h2>
                  <p className="text-sm text-gray-500">Number of students per class</p>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getStudentCountByClass()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
                      <Bar dataKey="count" fill="#805AD5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Teaching Resources */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">Teaching Resources</h2>
                  <p className="text-sm text-gray-500">Materials to enhance your teaching</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Browse All</button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ResourceCard 
                    title="Modern Teaching Methodologies"
                    type="Workshop"
                    date="May 10, 2025"
                    imageUrl="https://images.unsplash.com/photo-1524178232363-1fb2b075b655"
                  />
                  <ResourceCard 
                    title="Interactive Science Labs"
                    type="Lesson Plan"
                    date="Updated 2 days ago"
                    imageUrl="https://images.unsplash.com/photo-1532094349884-543bc11b234d"
                  />
                  <ResourceCard 
                    title="Digital Assessment Tools"
                    type="Webinar Recording"
                    date="Last accessed: Apr 28"
                    imageUrl="https://images.unsplash.com/photo-1501504905252-473c47e087f8"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Quick Stat Card Component
const QuickStatCard = ({ title, value, change, changeType, timeframe, icon, color }) => {
  return (
    <div className={`${color} border p-5 rounded-xl transition-transform hover:scale-[1.02] group`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <div className="flex items-center mt-1">
            {changeType !== "neutral" && (
              <span className={`text-xs font-medium ${
                changeType === "positive" ? "text-green-600" : 
                changeType === "negative" ? "text-red-600" : "text-gray-500"
              }`}>
                {change}
              </span>
            )}
            <span className="text-xs text-gray-500 ml-1">{timeframe}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Schedule Item Component
const ScheduleItem = ({ time, title, subtitle, status, highlight }) => {
  return (
    <div className={`flex items-center p-2 rounded-lg ${highlight ? "bg-blue-50 border border-blue-100" : ""}`}>
      <div className="mr-4 text-right">
        <p className={`text-sm font-medium ${highlight ? "text-blue-600" : "text-gray-700"}`}>{time}</p>
        <div className={`h-2 w-2 rounded-full mt-1 ml-auto ${
          status === "completed" ? "bg-green-500" :
          status === "ongoing" ? "bg-blue-500 animate-pulse" : "bg-gray-300"
        }`}></div>
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${highlight ? "text-blue-700" : "text-gray-800"}`}>{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      {status === "completed" && (
        <FiCheckCircle size={16} className="text-green-500 ml-2" />
      )}
    </div>
  );
};

// Assignments To Grade Component
const AssignmentsToGrade = () => {
  const assignments = [
    { 
      className: "Class 10B",
      title: "Physics Lab Report",
      dueDate: "Due May 3",
      submissions: 22,
      totalStudents: 28,
      priority: "high"
    },
    { 
      className: "Class 9A",
      title: "Essay on Renaissance Art",
      dueDate: "Due May 5",
      submissions: 18,
      totalStudents: 30,
      priority: "medium"
    },
    { 
      className: "Class 11A",
      title: "Programming Assignment",
      dueDate: "Due May 7",
      submissions: 25,
      totalStudents: 32,
      priority: "low"
    },
    { 
      className: "Class 12C",
      title: "Calculus Problem Set",
      dueDate: "Due May 10",
      submissions: 10,
      totalStudents: 26,
      priority: "medium"
    }
  ];

  return (
    <div className="space-y-4">
      {assignments.map((assignment, index) => (
        <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  assignment.priority === "high" ? "bg-red-500" :
                  assignment.priority === "medium" ? "bg-orange-500" : "bg-blue-500"
                }`}></span>
                <h3 className="font-medium text-gray-800">{assignment.className}</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">{assignment.title}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-gray-500">{assignment.dueDate}</span>
                <span className="mx-2 text-gray-300">•</span>
                <div className="flex items-center">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                    <div 
                      className="h-1.5 bg-green-500 rounded-full"
                      style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{assignment.submissions}/{assignment.totalStudents}</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-blue-600 hover:text-blue-800">
              <FiChevronRight />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Resource Card Component
const ResourceCard = ({ title, type, date, imageUrl }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md group">
      <div className="h-32 overflow-hidden relative">
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173"} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-800">{type}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-1">{title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{date}</span>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;
