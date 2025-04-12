import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Dashboardpages/Header';

const StudentClassroom = () => {
  const [activeTab, setActiveTab] = useState('classmates');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const classmates = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", submissions: 12, avatar: "AJ" },
    { id: 2, name: "Sam Wilson", email: "sam@example.com", submissions: 15, avatar: "SW" },
    { id: 3, name: "Taylor Smith", email: "taylor@example.com", submissions: 8, avatar: "TS" }
  ];

  const teachers = [
    { 
      id: 1, 
      name: "Mr. Smith", 
      subject: "Mathematics", 
      email: "smith@school.edu",
      officeHours: "Mon/Wed 3-5pm",
      bio: "10 years teaching experience. Specializes in Algebra and Calculus."
    },
    { 
      id: 2, 
      name: "Ms. Johnson", 
      subject: "Science", 
      email: "johnson@school.edu",
      officeHours: "Tue/Thu 2-4pm",
      bio: "Former research scientist with a passion for teaching biology."
    }
  ];

  const submittedAssignments = [
    {
      id: 1,
      title: "Algebra Homework",
      subject: "Mathematics",
      submittedDate: "2023-11-14",
      status: "Graded",
      score: "18/20",
      teacher: "Mr. Smith",
      feedback: "Good work on the algebraic equations. Remember to show all steps for full credit next time."
    },
    {
      id: 2,
      title: "Science Lab Report",
      subject: "Science",
      submittedDate: "2023-11-18",
      status: "Pending Review",
      score: null,
      teacher: "Ms. Johnson",
      feedback: ""
    }
  ];

  const attendance = [
    { month: "November", present: 18, absent: 2, late: 1 },
    { month: "October", present: 20, absent: 0, late: 1 },
    { month: "September", present: 19, absent: 1, late: 0 }
  ];

  // Filter classmates based on search term
  const filteredClassmates = classmates.filter(classmate =>
    classmate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate attendance percentage
  const calculateAttendancePercentage = (present, absent) => {
    const totalDays = present + absent;
    return Math.round((present / totalDays) * 100);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-4 md:p-6 text-gray-800 max-w-6xl mt-20 mx-auto bg-gray-50 min-h-screen">
        <Header />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Classroom 
          </h1>
          
        </div>
        <div className="w-full md:w-auto">
          {activeTab === 'classmates' && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search classmates..."
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-6 scrollbar-hide">
        {['classmates', 'teachers', 'attendance'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-3 whitespace-nowrap font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
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
        {activeTab === 'classmates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Classmates</h2>
              <span className="text-sm text-gray-500">
                {filteredClassmates.length} {filteredClassmates.length === 1 ? 'classmate' : 'classmates'}
              </span>
            </div>
            
            {filteredClassmates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClassmates.map((classmate) => (
                  <motion.div
                    key={classmate.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {classmate.avatar}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{classmate.name}</h3>
                        <p className="text-gray-600 text-sm truncate">{classmate.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">{classmate.submissions} submissions</span>
                      </div>
                      <button className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        Message
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No classmates found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search query</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'teachers' && (
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Teachers</h2>
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <motion.div
                  key={teacher.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div 
                    className="p-4 cursor-pointer flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{teacher.name}</h3>
                        <p className="text-gray-600">{teacher.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Teacher
                      </span>
                      <svg
                        className={`ml-2 h-5 w-5 text-gray-500 transform transition-transform ${
                          expandedTeacher === teacher.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {expandedTeacher === teacher.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <h4 className="font-medium text-gray-900">Contact Information</h4>
                          <p className="mt-1 text-sm text-gray-600">{teacher.email}</p>
                          <p className="mt-2 text-sm">
                            <span className="font-medium">Office Hours:</span> {teacher.officeHours}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">About</h4>
                          <p className="mt-1 text-sm text-gray-600">{teacher.bio}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Send Email
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          Schedule Meeting
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Submitted Assignments</h2>
            <div className="space-y-4">
              {submittedAssignments.length > 0 ? (
                submittedAssignments.map((assignment) => (
                  <motion.div
                    key={assignment.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{assignment.title}</h3>
                        <div className="flex items-center mt-1 space-x-3 text-sm text-gray-600">
                          <span>{assignment.subject}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                          <span>Submitted: {assignment.submittedDate}</span>
                          <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                          <span>{assignment.teacher}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          assignment.status === "Graded"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                    
                    {assignment.score && (
                      <div className="mt-3 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${parseInt(assignment.score.split('/')[0]) / parseInt(assignment.score.split('/')[1]) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 font-medium">{assignment.score}</span>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No assignments submitted yet</h3>
                  <p className="mt-1 text-gray-500">Your submitted work will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Attendance Record</h2>
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
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
                        Late
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map((record, index) => {
                      const percentage = calculateAttendancePercentage(record.present, record.absent);
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {record.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{record.present}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{record.absent}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{record.late}</td>
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
              
              <div className="p-4 bg-blue-50 border-t border-blue-100">
                <h3 className="font-semibold text-blue-800">Current Month Summary</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-xs">
                    <p className="text-sm text-gray-600">Present Days</p>
                    <p className="text-xl font-bold">{attendance[0].present}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-xs">
                    <p className="text-sm text-gray-600">Absent Days</p>
                    <p className="text-xl font-bold text-red-600">{attendance[0].absent}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-xs">
                    <p className="text-sm text-gray-600">Late Arrivals</p>
                    <p className="text-xl font-bold text-yellow-600">{attendance[0].late}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-blue-700">
                    Your current attendance rate is{' '}
                    <span className="font-medium">
                      {calculateAttendancePercentage(attendance[0].present, attendance[0].absent)}%
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedAssignment.title}</h2>
                  <div className="flex items-center mt-1 space-x-3 text-sm text-gray-600">
                    <span>{selectedAssignment.subject}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    <span>Submitted: {selectedAssignment.submittedDate}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                    <span>{selectedAssignment.teacher}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">Status</h3>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedAssignment.status === "Graded"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {selectedAssignment.status}
                      </span>
                    </p>
                  </div>
                  
                  {selectedAssignment.score && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900">Score</h3>
                      <div className="mt-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${parseInt(selectedAssignment.score.split('/')[0]) / parseInt(selectedAssignment.score.split('/')[1]) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{selectedAssignment.score}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Assignment Description</h3>
                  <p className="mt-1 text-gray-600">
                    Complete all problems in Chapter 3 of your textbook. Show all work for full credit.
                    The assignment should be submitted as a PDF document with clear images of your work.
                  </p>
                </div>
                
                {selectedAssignment.status === "Graded" && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800">Teacher Feedback</h3>
                    <p className="mt-1 text-blue-700">{selectedAssignment.feedback}</p>
                    <div className="mt-3">
                      <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                        View Graded Assignment
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedAssignment(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    {selectedAssignment.status === "Graded" ? (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Request Regrade
                      </button>
                    ) : (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Submission
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentClassroom;