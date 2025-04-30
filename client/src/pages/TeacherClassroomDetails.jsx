import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import FacHeader from './Dashboardpages/facheader';
// Import classroom data from local JSON file
import classroomData from '../data/classroom.json';

const TeacherClassroomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', url: '', type: 'Document' });

  // Fetch classroom details from local data
  useEffect(() => {
    const fetchClassroomDetails = async () => {
      try {
        setLoading(true);
        
        // Find the classroom with matching ID from local data
        const foundClassroom = classroomData.find(c => c._id === id);
        
        if (foundClassroom) {
          setClassroom(foundClassroom);
          
          // Initialize attendance records for students
          const initialAttendance = {};
          if (foundClassroom.students) {
            foundClassroom.students.forEach(student => {
              // If student is an object with _id or a string ID directly
              const studentId = typeof student === 'object' ? student._id : student;
              initialAttendance[studentId] = { present: true, comment: '' };
            });
          }
          setAttendanceRecords(initialAttendance);
          setError(null);
        } else {
          setError("Classroom not found in local data");
        }
      } catch (error) {
        console.error("Error loading classroom details:", error);
        setError("Failed to load classroom details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomDetails();
  }, [id]);

  // Handle attendance toggle
  const handleAttendanceToggle = (studentId) => {
    setAttendanceRecords(prevRecords => ({
      ...prevRecords,
      [studentId]: {
        ...prevRecords[studentId],
        present: !prevRecords[studentId]?.present
      }
    }));
  };

  // Handle attendance comment change
  const handleCommentChange = (studentId, comment) => {
    setAttendanceRecords(prevRecords => ({
      ...prevRecords,
      [studentId]: {
        ...prevRecords[studentId],
        comment
      }
    }));
  };

  // Save attendance (local update only since we're using JSON data)
  const saveAttendance = async () => {
    try {
      // In a real app, this would send data to the server
      // Here we just show a success message
      alert("Attendance saved successfully! (Local Demo)");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance. Please try again.");
    }
  };
  
  // Add new resource (local update only)
  const handleAddResource = async (e) => {
    e.preventDefault();
    
    try {
      const mockResource = {
        ...newResource,
        addedBy: localStorage.getItem('teacherId') || 'currentTeacher',
        addedByModel: 'Teacher',
        addedAt: new Date().toISOString()
      };
      
      setClassroom(prevClassroom => ({
        ...prevClassroom,
        resources: [...(prevClassroom.resources || []), mockResource]
      }));
      
      // Reset form and close modal
      setNewResource({ title: '', url: '', type: 'Document' });
      setShowResourceModal(false);
      
      alert("Resource added successfully! (Local Demo)");
    } catch (error) {
      console.error("Error adding resource:", error);
      alert("Failed to add resource. Please try again.");
    }
  };
  
  // Handle grading assignment
  const handleGradeAssignment = (assignmentId) => {
    navigate(`/grade-assignment/${id}/${assignmentId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="p-4 md:p-6 mt-20 text-gray-800 max-w-6xl mx-auto bg-gray-50 min-h-screen">
        <FacHeader />
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
          <svg className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Classroom</h2>
          <p className="text-red-700">{error || "Classroom not found"}</p>
          <button 
            onClick={() => navigate('/teacher-classroom')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Classrooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 mt-20 text-gray-800 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <FacHeader />
      
      {/* Back Button and Classroom Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/teacher-classroom')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Classrooms
        </button>
      </div>
      
      {/* Classroom Header */}
      <div 
        className="rounded-xl overflow-hidden mb-6 shadow-sm"
        style={{
          backgroundImage: classroom.coverImage?.url 
            ? `url(${classroom.coverImage.url})` 
            : 'linear-gradient(to right, #4776E6, #8E54E9)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <div className="bg-blue-600/30 text-blue-100 text-sm px-3 py-1 rounded-full inline-block mb-3">
                {classroom.subject}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{classroom.name}</h1>
              <p className="text-blue-100">{classroom.gradeLevel || 'No grade level specified'}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <svg className="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{classroom.students?.length || 0} Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "attendance"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab("assignments")}
          className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "assignments"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Assignments
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "resources"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Resources
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "students"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("announcements")}
          className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
            activeTab === "announcements"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Announcements
        </button>
      </div>
      
      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100"
      >
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Classroom Overview</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Classroom
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h3 className="font-medium text-lg mb-3 text-gray-800">Description</h3>
                <p className="text-gray-600">{classroom.description || "No description available."}</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h3 className="font-medium text-lg mb-3 text-gray-800">Classroom Code</h3>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                  <span className="text-xl font-mono font-medium">{classroom.code}</span>
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      navigator.clipboard.writeText(classroom.code);
                      alert("Classroom code copied to clipboard!");
                    }}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Share this code with students to join your classroom.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-1">Students</h3>
                <p className="text-2xl font-bold text-blue-600">{classroom.students?.length || 0}</p>
                <p className="text-sm text-blue-600 mt-1">Enrolled students</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h3 className="font-medium text-green-800 mb-1">Performance</h3>
                <p className="text-2xl font-bold text-green-600">{classroom.performanceStats?.averageScore || "N/A"}%</p>
                <p className="text-sm text-green-600 mt-1">Average score</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <h3 className="font-medium text-purple-800 mb-1">Assignments</h3>
                <p className="text-2xl font-bold text-purple-600">{classroom.assignments?.length || 0}</p>
                <p className="text-sm text-purple-600 mt-1">Total assignments</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-4 text-gray-800">Recent Activity</h3>
              <div className="space-y-4">
                {classroom.announcements?.slice(0, 2).map((announcement, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-600">{announcement.content}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {(!classroom.announcements || classroom.announcements.length === 0) && (
                  <p className="text-gray-500 italic">No recent announcements.</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3 text-gray-800">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab("attendance")}
                  className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-100 transition-colors"
                >
                  <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span className="text-blue-800">Take Attendance</span>
                </button>
                
                <button 
                  onClick={() => navigate('/createassignment', { state: { classroomId: id } })}
                  className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-100 transition-colors"
                >
                  <svg className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800">Add Assignment</span>
                </button>
                
                <button 
                  onClick={() => setShowResourceModal(true)}
                  className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-100 transition-colors"
                >
                  <svg className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-purple-800">Add Resource</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab("announcements")}
                  className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg border border-yellow-100 transition-colors"
                >
                  <svg className="h-8 w-8 text-yellow-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                  <span className="text-yellow-800">Make Announcement</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Attendance Tab */}
        {activeTab === "attendance" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-semibold">Attendance</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <label htmlFor="datePicker" className="mr-2 text-sm text-gray-700">Date:</label>
                  <input
                    type="date"
                    id="datePicker"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <button 
                  onClick={saveAttendance}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Attendance
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(classroom.students) ? (
                      classroom.students.map((student, index) => {
                        // Get student ID (depends on data structure)
                        const studentId = typeof student === 'object' ? student._id : student;
                        // Get student name (if available, otherwise use placeholder)
                        const studentName = typeof student === 'object' ? student.name : `Student ${index + 1}`;
                        
                        return (
                          <tr key={studentId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                  {studentName.split(' ').map(name => name[0]).join('')}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{studentName}</div>
                                  <div className="text-sm text-gray-500">ID: {studentId.substring(0, 8)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  checked={attendanceRecords[studentId]?.present || false}
                                  onChange={() => handleAttendanceToggle(studentId)}
                                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className={`ml-2 ${attendanceRecords[studentId]?.present ? 'text-green-600' : 'text-red-600'}`}>
                                  {attendanceRecords[studentId]?.present ? 'Present' : 'Absent'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input 
                                type="text" 
                                value={attendanceRecords[studentId]?.comment || ''}
                                onChange={(e) => handleCommentChange(studentId, e.target.value)}
                                placeholder="Add a comment (optional)"
                                className="border border-gray-300 rounded-lg px-3 py-1 w-full focus:ring-blue-500 focus:border-blue-500"
                              />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                          No students in this classroom.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Assignments</h2>
              <button
                onClick={() => navigate('/createassignment', { state: { classroomId: id } })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Assignment
              </button>
            </div>
            
            {Array.isArray(classroom.assignments) && classroom.assignments.length > 0 ? (
              <div className="space-y-4">
                {classroom.assignments.map((assignment) => (
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
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-2 text-gray-600">{assignment.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{assignment.submissions} submissions</p>
                        <p className="text-sm text-gray-600">{assignment.graded} graded</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {Math.round((assignment.graded / assignment.submissions) * 100)}% complete
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button 
                        onClick={() => handleGradeAssignment(assignment.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Grade
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        View Submissions
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                        Edit
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 text-red-600">
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No assignments yet</h3>
                <p className="text-gray-500 mb-4">
                  You haven't created any assignments for this classroom.
                </p>
                <button
                  onClick={() => navigate('/createassignment', { state: { classroomId: id } })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Assignment
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Learning Resources</h2>
              <button 
                onClick={() => setShowResourceModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Resource
              </button>
            </div>
            
            {Array.isArray(classroom.resources) && classroom.resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classroom.resources.map((resource, index) => (
                  <div 
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className={`h-2 ${
                      resource.type === 'Document' ? 'bg-blue-500' :
                      resource.type === 'Video' ? 'bg-red-500' :
                      resource.type === 'Link' ? 'bg-green-500' :
                      resource.type === 'Presentation' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg mr-3 ${
                          resource.type === 'Document' ? 'bg-blue-100 text-blue-700' :
                          resource.type === 'Video' ? 'bg-red-100 text-red-700' :
                          resource.type === 'Link' ? 'bg-green-100 text-green-700' :
                          resource.type === 'Presentation' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {resource.type === 'Document' && (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                          {resource.type === 'Video' && (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                          {resource.type === 'Link' && (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          )}
                          {resource.type === 'Presentation' && (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                          )}
                        </div>
                        <h3 className="font-medium">{resource.title}</h3>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <a 
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                        >
                          Open Resource
                          <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        
                        <div className="text-xs text-gray-500">
                          Added {resource.addedAt ? new Date(resource.addedAt).toLocaleDateString() : 'recently'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No resources yet</h3>
                <p className="text-gray-500 mb-4">
                  You haven't added any resources to this classroom yet.
                </p>
                <button
                  onClick={() => setShowResourceModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Resource
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Students Tab */}
        {activeTab === "students" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Students</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Students
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(classroom.students) ? (
                      classroom.students.map((student, index) => {
                        // Get student ID and data (depends on data structure)
                        const studentId = typeof student === 'object' ? student._id : student;
                        const studentName = typeof student === 'object' ? student.name : `Student ${index + 1}`;
                        const studentEmail = typeof student === 'object' ? student.email : `student${index + 1}@example.com`;
                        const performance = typeof student === 'object' && student.performance ? student.performance.averageScore : Math.round(70 + Math.random() * 30);
                        
                        return (
                          <tr key={studentId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                  {studentName.split(' ').map(name => name[0]).join('')}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{studentName}</div>
                                  <div className="text-sm text-gray-500">ID: {studentId.substring(0, 8)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {studentEmail}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div
                                    className={`h-2.5 rounded-full ${
                                      performance >= 90 ? 'bg-green-500' :
                                      performance >= 75 ? 'bg-blue-500' :
                                      performance >= 60 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${performance}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{performance}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button className="text-blue-600 hover:text-blue-800 mr-3">
                                View Profile
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No students in this classroom.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Join Requests Section */}
            <div className="mt-8">
              <h3 className="font-medium text-lg mb-4">Join Requests</h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-2">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                        JS
                      </div>
                      <div>
                        <p className="font-medium">Jane Smith</p>
                        <p className="text-sm text-gray-500">jane.smith@example.com</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        Approve
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 text-red-600">
                        Deny
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500 text-sm">
                    No other join requests at this time.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">Announcements</h2>
            </div>
            
            <div className="mb-6">
              <form className="bg-white rounded-lg border border-gray-200 p-4">
                <textarea
                  placeholder="Write an announcement to share with your class..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                ></textarea>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pinAnnouncement"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                    />
                    <label htmlFor="pinAnnouncement" className="text-sm text-gray-700">
                      Pin announcement
                    </label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      type="reset"
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="space-y-4">
              {Array.isArray(classroom.announcements) && classroom.announcements.map((announcement, index) => (
                <div
                  key={index}
                  className={`border ${announcement.isPinned ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-white'} rounded-lg p-4`}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-2">
                        T
                      </div>
                      <span className="font-medium">Teacher</span>
                    </div>
                    
                    {announcement.isPinned && (
                      <div className="flex items-center text-yellow-700 text-sm">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Pinned
                      </div>
                    )}
                  </div>
                  
                  <p className="mb-3">{announcement.content}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div>
                      Posted on {new Date(announcement.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!classroom.announcements || classroom.announcements.length === 0) && (
                <div className="text-center text-gray-500 py-6">
                  No announcements have been posted yet.
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Add Resource Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Add Learning Resource</h2>
                <button
                  onClick={() => setShowResourceModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddResource} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title*</label>
                  <input
                    type="text"
                    required
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="E.g., Calculus Textbook PDF"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resource URL*</label>
                  <input
                    type="url"
                    required
                    value={newResource.url}
                    onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                    placeholder="https://example.com/resource.pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Document">Document (PDF, DOCX, etc.)</option>
                    <option value="Video">Video</option>
                    <option value="Link">Link / Website</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowResourceModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Resource
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

export default TeacherClassroomDetails;