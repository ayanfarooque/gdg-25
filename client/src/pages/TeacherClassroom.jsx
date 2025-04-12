import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FacHeader from './Dashboardpages/facheader';

const TeacherClassroom = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()
  // Sample data
  const studentList = [
    { 
      id: 1, 
      name: "John Doe", 
      email: "john@example.com", 
      submissions: 8, 
      avgScore: 85,
      attendance: "95%",
      lastSubmission: "2023-11-15",
      performanceTrend: "up",
      avatar: "JD"
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "jane@example.com", 
      submissions: 7, 
      avgScore: 92,
      attendance: "98%",
      lastSubmission: "2023-11-18",
      performanceTrend: "up",
      avatar: "JS"
    },
    { 
      id: 3, 
      name: "Alex Johnson", 
      email: "alex@example.com", 
      submissions: 5, 
      avgScore: 78,
      attendance: "88%",
      lastSubmission: "2023-11-12",
      performanceTrend: "down",
      avatar: "AJ"
    }
  ];

  const assignments = [
    {
      id: 1,
      title: "Algebra Homework",
      subject: "Mathematics",
      dueDate: "2023-11-15",
      submissions: 24,
      graded: 18
    }
  ];

  const topPerformers = [...studentList]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);

  const teacherAttendance = [
    { month: "November", present: 20, absent: 0 },
    { month: "October", present: 19, absent: 1 },
    { month: "September", present: 18, absent: 2 }
  ];

  // Filter students based on search term
  const filteredStudents = studentList.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 mt-20 text-gray-800 max-w-6xl mx-auto bg-gray-50 min-h-screen">
        <FacHeader />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Teacher Classroom
          </h1>
          <p className="text-gray-600">Manage your classroom and track student progress</p>
        </div>
        <div className="flex space-x-3">
          
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-6 scrollbar-hide">
        {['students', 'attendance', 'assignments'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100"
      >
        {activeTab === 'students' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-semibold">Students</h2>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Top Performers Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Top Performers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topPerformers.map((student, index) => (
                  <motion.div
                    key={student.id}
                    whileHover={{ y: -5 }}
                    className="p-4 border border-gray-200 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {student.avatar}
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold">{student.name}</h4>
                        <p className="text-sm text-gray-600">Avg: {student.avgScore}%</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-gray-600">{student.submissions} submissions</span>
                      <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Work
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Student List */}
            <div>
              <h3 className="text-lg font-medium mb-4">All Students</h3>
              {filteredStudents.length > 0 ? (
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3 }}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div 
                        className="p-4 cursor-pointer flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                              {student.avatar}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.avgScore >= 90 ? 'bg-green-100 text-green-800' :
                            student.avgScore >= 70 ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Avg: {student.avgScore}%
                          </span>
                          <svg
                            className={`ml-2 h-5 w-5 text-gray-500 transform transition-transform ${
                              expandedStudent === student.id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {expandedStudent === student.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 pb-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <div>
                              <h4 className="font-medium text-gray-900">Performance</h4>
                              <div className="mt-2 flex items-center">
                                <span className="text-sm font-medium mr-2">Trend:</span>
                                {student.performanceTrend === "up" ? (
                                  <span className="text-green-600 flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                    Improving
                                  </span>
                                ) : (
                                  <span className="text-red-600 flex items-center">
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    Declining
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm">
                                <span className="font-medium">Last Submission:</span> {student.lastSubmission}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Attendance</h4>
                              <p className="mt-1 text-sm">{student.attendance}</p>
                              <p className="mt-1 text-sm">
                                <span className="font-medium">Submissions:</span> {student.submissions}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Actions</h4>
                              <div className="mt-2 flex space-x-2">
                                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                  Message
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                  View Work
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No students found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search query</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Attendance</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Your Attendance</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  98%
                </span>
              </div>
            </div>

            {/* Teacher Attendance */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Your Attendance Record</h3>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Present
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Absent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teacherAttendance.map((record, index) => {
                        const percentage = Math.round((record.present / (record.present + record.absent)) * 100);
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              {record.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.present}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{record.absent}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      percentage >= 90
                                        ? "bg-green-500"
                                        : percentage >= 75
                                        ? "bg-blue-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span
                                  className={`text-xs font-medium ${
                                    percentage >= 90
                                      ? "text-green-600"
                                      : percentage >= 75
                                      ? "text-blue-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {percentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Class Attendance Summary */}
            <div>
              <h3 className="text-lg font-medium mb-4">Class Attendance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-medium text-blue-800">Best Attendance</h4>
                  <div className="mt-2 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                      JS
                    </div>
                    <div>
                      <p className="font-medium">Jane Smith</p>
                      <p className="text-sm text-blue-600">98% attendance</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <h4 className="font-medium text-green-800">Class Average</h4>
                  <p className="mt-2 text-2xl font-bold text-green-600">92%</p>
                  <p className="text-sm text-green-600 mt-1">+2% from last month</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <h4 className="font-medium text-red-800">Needs Improvement</h4>
                  <div className="mt-2 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium mr-3">
                      AJ
                    </div>
                    <div>
                      <p className="font-medium">Alex Johnson</p>
                      <p className="text-sm text-red-600">88% attendance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Assignments</h2>
              <button 
                onClick={() => navigate('/createassignment')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Assignment
              </button>
            </div>
            
            <div className="space-y-4">
              {assignments.map(assignment => (
                <motion.div
                  key={assignment.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{assignment.title}</h3>
                      <div className="flex items-center mt-1 space-x-3 text-sm text-gray-600">
                        <span>{assignment.subject}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                        <span>Due: {assignment.dueDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{assignment.submissions} submissions</p>
                      <p className="text-sm text-gray-600">{assignment.graded} graded</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      Grade
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      View Submissions
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Create Assignment Modal */}
      {showCreateAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">Create New Assignment</h2>
                <button
                  onClick={() => setShowCreateAssignment(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Assignment title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>History</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Assignment instructions..."
                  ></textarea>
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateAssignment(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassroom;