import React, { useState, useEffect } from 'react';
import Sidebar from '../components/TeacherHome/Sidebar';
import TeacherProfile from '../components/TeacherHome/TeacherProfile';
import Analytics from '../components/TeacherHome/Analytics';
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

const TeacherHomePage = () => {
  const [selectedClass, setSelectedClass] = useState('Class 9A');
  const [graphType, setGraphType] = useState('performance');
  
  const classes = [
    'Class 9A',
    'Class 10B',
    'Class 11A',
    'Class 12C',
  ];
  
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
    <div className="h-full w-full bg-gray-100 font-sans flex">
      {/* Sidebar */}
      <Sidebar className="w-20 bg-[#d39faa] p-4 flex flex-col items-center" />

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-6 w-full max-w-7xl mx-auto">
        
        {/* Center Content */}
        <main className="flex-1 space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, Teacher!</h1>
            <p className="text-gray-600 mt-1">Here's an overview of your classes and student performance.</p>
          </div>
        
          {/* Analytics Section */}
          <div className="transition-transform transform hover:scale-101 duration-300">
            <Analytics />
          </div>

          {/* Class Performance Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-gray-800">Class Performance Dashboard</h2>
              
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
            
            {/* Quick Stats for the selected class */}
            {renderQuickStats()}
            
            {/* Class Performance Graph */}
            {renderClassPerformanceGraph()}
            
            {/* Legend and Insights */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Performance Insights</h3>
              <p className="text-gray-600 text-sm">
                {graphType === 'performance' ? 
                  `Class ${selectedClass} has shown ${Math.random() > 0.5 ? 'improvement' : 'consistent performance'} across assessments. The average score is above ${Math.floor(Math.random() * 10 + 70)}%.` :
                 graphType === 'attendance' ? 
                  `${selectedClass} maintains an average attendance rate of ${Math.floor(Math.random() * 10 + 85)}%, which is ${Math.random() > 0.5 ? 'above' : 'near'} the school average.` :
                  `The grade distribution shows ${Math.random() > 0.5 ? 'a good spread' : 'room for improvement'}, with ${Math.random() > 0.5 ? 'most' : 'many'} students achieving B grades or higher.`
                }
              </p>
            </div>
          </div>
          
          {/* Student Comparison Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Student Distribution by Class</h2>
            <div className="h-64">
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
        </main>

        {/* Profile Card */}
        <div className="hidden h-full lg:block w-72">
          <TeacherProfile />
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;
