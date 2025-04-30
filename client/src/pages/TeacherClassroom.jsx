import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FacHeader from './Dashboardpages/facheader';
import axios from 'axios';

const TeacherClassroom = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateClassroom, setShowCreateClassroom] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    name: '',
    subject: '',
    gradeLevel: '',
    description: ''
  });
  
  const navigate = useNavigate();

  // Fetch teacher's classrooms
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint for teacher classrooms
        const response = await axios.get("http://localhost:5000/api/classrooms/studentclassroom", {
          params: { teacher: localStorage.getItem('teacherId') } // Assuming teacherId is stored in localStorage
        });
        setClassrooms(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
        setError("Failed to load classrooms. Please try again later.");
        
        // Use sample data from classroom.json for demo purposes
        try {
          const mockResponse = await axios.get('/src/data/classroom.json');
          setClassrooms(mockResponse.data);
        } catch (mockError) {
          console.error("Error loading mock data:", mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  // Handle classroom click
  const handleClassroomClick = (classroomId) => {
    navigate(`/teacher-classroom-details/${classroomId}`);
  };

  // Handle create classroom
  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.post("http://localhost:5000/api/classrooms", {
        ...newClassroom,
        teacher: localStorage.getItem('teacherId')
      });
      
      setClassrooms([...classrooms, response.data.data]);
      setShowCreateClassroom(false);
      setNewClassroom({ name: '', subject: '', gradeLevel: '', description: '' });
      alert("Classroom created successfully!");
    } catch (error) {
      console.error("Error creating classroom:", error);
      alert("Failed to create classroom. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getRandomGradient = () => {
    const gradients = [
      "linear-gradient(to right, #4776E6, #8E54E9)",
      "linear-gradient(to right, #11998e, #38ef7d)",
      "linear-gradient(to right, #FF8008, #FFC837)",
      "linear-gradient(to right, #2193b0, #6dd5ed)",
      "linear-gradient(to right, #834d9b, #d04ed6)",
      "linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d)"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

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
          <button
            onClick={() => setActiveTab("classes")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "classes"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Classes
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "create"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Create Classroom
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "attendance"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "assignments"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Assignments
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100"
      >
        {activeTab === 'classes' && (
          <motion.div
            key="classes"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-semibold">My Classrooms</h2>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search classrooms..."
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

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-800 text-center">
                {error}
              </div>
            ) : classrooms.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No classrooms yet</h3>
                <p className="text-gray-500 mb-4">
                  You haven't created any classrooms yet. Click the "Create Classroom" button to get started.
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Classroom
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms
                  .filter(classroom => 
                    classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    classroom.subject.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((classroom) => (
                  <motion.div
                    key={classroom._id}
                    variants={cardVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer"
                    onClick={() => handleClassroomClick(classroom._id)}
                  >
                    {/* Banner with gradient background */}
                    <div
                      className="h-32 relative"
                      style={{
                        background: getRandomGradient(),
                      }}
                    >
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-bold text-xl">{classroom.name}</h3>
                        <p className="opacity-90 text-sm">{classroom.subject}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center mt-2">
                            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-gray-600 text-sm">
                              {classroom.students?.length || 0} students enrolled
                            </p>
                          </div>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-2">
                        <div className="flex items-start">
                          <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Description:</span>{" "}
                            {classroom.description
                              ? (classroom.description.length > 80 
                                 ? classroom.description.substring(0, 80) + "..." 
                                 : classroom.description)
                              : "No description available"}
                          </p>
                        </div>
                      </div>
                      
                      {/* Performance Stats */}
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 font-medium">Avg Score:</span>
                          <span className="text-sm font-medium text-blue-600">
                            {classroom.performanceStats?.averageScore || "N/A"}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600 font-medium">Assignments:</span>
                          <span className="text-sm">
                            {classroom.assignments?.length || 0} total
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Create New Classroom</h2>
            
            <form onSubmit={handleCreateClassroom} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classroom Name*</label>
                <input
                  type="text"
                  required
                  value={newClassroom.name}
                  onChange={(e) => setNewClassroom({...newClassroom, name: e.target.value})}
                  placeholder="Enter classroom name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject*</label>
                <input
                  type="text"
                  required
                  value={newClassroom.subject}
                  onChange={(e) => setNewClassroom({...newClassroom, subject: e.target.value})}
                  placeholder="Enter subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                <select
                  value={newClassroom.gradeLevel}
                  onChange={(e) => setNewClassroom({...newClassroom, gradeLevel: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Grade Level</option>
                  <option value="Elementary">Elementary</option>
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newClassroom.description}
                  onChange={(e) => setNewClassroom({...newClassroom, description: e.target.value})}
                  placeholder="Enter classroom description"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Creating...' : 'Create Classroom'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex">
                <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-blue-800 font-medium">Pro Tips</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Create a unique, descriptive name for your classroom. After creation, you'll be able to add students, assignments, and resources.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
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
                      {[
                        { month: "November", present: 20, absent: 0 },
                        { month: "October", present: 19, absent: 1 },
                        { month: "September", present: 18, absent: 2 }
                      ].map((record, index) => {
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
              {[
                {
                  id: 1,
                  title: "Algebra Homework",
                  subject: "Mathematics",
                  dueDate: "2023-11-15",
                  submissions: 24,
                  graded: 18
                },
                {
                  id: 2,
                  title: "Geometry Quiz",
                  subject: "Mathematics",
                  dueDate: "2023-11-20",
                  submissions: 18,
                  graded: 12
                },
                {
                  id: 3,
                  title: "Calculus Project",
                  subject: "Mathematics",
                  dueDate: "2023-12-05",
                  submissions: 5,
                  graded: 0
                }
              ].map(assignment => (
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