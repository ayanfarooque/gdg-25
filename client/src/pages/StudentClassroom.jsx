import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Dashboardpages/Header';
import { useNavigate } from 'react-router-dom';

const StudentClassroom = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Sample classroom data
  const classrooms = [
    {
      id: 1,
      name: "Advanced Mathematics",
      teacher: "Mr. Smith",
      section: "Period 3",
      bannerColor: "#4285F4", // Google blue
      totalStudents: 28,
      recentTopic: "Calculus Fundamentals",
      unreadAnnouncements: 2
    },
    {
      id: 2,
      name: "Biology 101",
      teacher: "Ms. Johnson",
      section: "Period 1",
      bannerColor: "#0F9D58", // Google green
      totalStudents: 32,
      recentTopic: "Cell Structure",
      unreadAnnouncements: 0
    },
    {
      id: 3,
      name: "English Literature",
      teacher: "Mrs. Davis",
      section: "Period 4",
      bannerColor: "#DB4437", // Google red
      totalStudents: 25,
      recentTopic: "Shakespeare Analysis",
      unreadAnnouncements: 3
    },
    {
      id: 4,
      name: "Physics",
      teacher: "Dr. Wilson",
      section: "Period 2",
      bannerColor: "#F4B400", // Google yellow
      totalStudents: 24,
      recentTopic: "Newton's Laws",
      unreadAnnouncements: 1
    },
    {
      id: 5,
      name: "Computer Science",
      teacher: "Mr. Roberts",
      section: "Period 5",
      bannerColor: "#673AB7", // Purple
      totalStudents: 20,
      recentTopic: "Object-Oriented Programming",
      unreadAnnouncements: 0
    }
  ];

  // Sample data (keeping previous data for other tabs)
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

  const filteredClassmates = classmates.filter(classmate =>
    classmate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            My Classrooms
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
        {['classes', 'classmates', 'teachers'].map((tab) => (
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
        className="gray-50 rounded-xl  p-4 md:p-6 border border-gray-50"
      >
        {activeTab === 'classes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Enrolled Classes</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Join Class
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {classrooms.map((classroom) => (
                <motion.div
                  key={classroom.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                  onClick={() => navigate(`/student-classroom/:${classroom.id}`)}
                >
                  {/* Banner */}
                  <div 
                    className="h-24 relative" 
                    style={{ backgroundColor: classroom.bannerColor }}
                  >
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-bold text-xl">{classroom.name}</h3>
                      <p className="opacity-90 text-sm">{classroom.section}</p>
                    </div>
                    {classroom.unreadAnnouncements > 0 && (
                      <div className="absolute top-4 right-4 bg-white h-6 w-6 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xs font-medium" style={{ color: classroom.bannerColor }}>
                          {classroom.unreadAnnouncements}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-gray-600 text-sm">{classroom.teacher}</p>
                        <p className="text-xs text-gray-500 mt-1">{classroom.totalStudents} students</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex items-start">
                        <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Recent topic:</span> {classroom.recentTopic}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Add class card */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}
                className="rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-64 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Join a New Class</h3>
                <p className="text-sm text-gray-500 text-center mt-1">
                  Use a class code to join a new classroom
                </p>
              </motion.div>
            </div>
          </div>
        )}

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
      </motion.div>
    </div>
  );
};

export default StudentClassroom;