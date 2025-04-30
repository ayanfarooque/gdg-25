import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from './Dashboardpages/Header';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiClock, FiUsers, FiFileText, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';

const ClassroomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assignments');
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassroomData = async () => {
      setLoading(true);
      try {
        // Fetch classroom details
        const {id} = req.params
        const classroomResponse = await axios.get(`http://localhost:5000/api/classrooms/studentclassroom/${id}`);
        const classroomData = classroomResponse.data.data;

        // Fetch assignments for this classroom
        const assignmentsResponse = await axios.get(`http://localhost:5000/api/classrooms/${id}/assignments`);
        const assignmentsData = assignmentsResponse.data.data;

        // Fetch students enrolled in this classroom
        const studentsResponse = await axios.get(`http://localhost:5000/api/classrooms/${id}/students`);

        const studentsData = studentsResponse.data.data;

        // Fetch grades for this classroom
        const gradesResponse = await axios.get(`http://localhost:5000/api/classrooms/${id}/grades`);

        const gradesData = gradesResponse.data.data;

        // Fetch resources for this classroom
        const resourcesResponse = await axios.get(`http://localhost:5000/api/classrooms/${id}/resources`);
        const resourcesData = resourcesResponse.data.data;

        // Fetch announcements for this classroom
        const announcementsResponse = await axios.get(`http://localhost:5000/api/classrooms/${id}/announcements`);
        const announcementsData = announcementsResponse.data.data;

        // Combine all data
        const combinedData = {
          ...classroomData,
          assignments: assignmentsData,
          students: studentsData,
          grades: gradesData,
          resources: resourcesData,
          announcements: announcementsData,
          performanceStats: {
            averageScore: calculateAverageScore(gradesData),
            assignmentsPending: assignmentsData.filter(a => a.status === 'pending').length,
            assignmentsCompleted: assignmentsData.filter(a => a.status === 'completed').length
          }
        };

        setClassroom(combinedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching classroom data:', error);
        setError(error.response?.data?.message || 'Failed to load classroom data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassroomData();
    }
  }, [id]);

  // Helper function to calculate average score
  const calculateAverageScore = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
    return Math.round(totalScore / grades.length);
  };

  // Handle assignment submission
  const handleSubmitAssignment = async (assignmentId, formData) => {
    try {
      await axios.post(`http://localhost:5000/api/classrooms/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Refresh assignments after submission
      const response = await axios.get(`http://localhost:5000/api/classrooms/${id}/assignments`);
      setClassroom(prev => ({
        ...prev,
        assignments: response.data.data
      }));
    } catch (error) {
      console.error('Error submitting assignment:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit assignment');
    }
  };

  // Handle announcement creation
  const handleCreateAnnouncement = async (announcementData) => {
    try {
      await axios.post(`http://localhost:5000/api/classrooms/${id}/announcements`, announcementData);
      // Refresh announcements
      const response = await axios.get(`http://localhost:5000/api/classrooms/${id}/announcements`);
      setClassroom(prev => ({
        ...prev,
        announcements: response.data.data
      }));
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw new Error(error.response?.data?.message || 'Failed to create announcement');
    }
  };

  // Handle resource upload
  const handleResourceUpload = async (resourceData) => {
    try {
      await axios.post(`http://localhost:5000/api/classrooms/${id}/resources`, resourceData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Refresh resources
      const response = await axios.get(`http://localhost:5000/api/classrooms/${id}/resources`);
      setClassroom(prev => ({
        ...prev,
        resources: response.data.data
      }));
    } catch (error) {
      console.error('Error uploading resource:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload resource');
    }
  };

  // Helper function to handle view assignment navigation
  const handleViewAssignment = (assignmentId) => {
    navigate(`/assignments/${assignmentId}`);
  };

  // Helper function to calculate banner color based on subject
  const getBannerColor = () => {
    if (!classroom?.subject) return "#4285F4"; // Default blue
    
    const subjectColors = {
      "Math": "#4285F4", // Blue
      "Science": "#0F9D58", // Green
      "History": "#DB4437", // Red
      "English": "#F4B400", // Yellow
      "Art": "#AA46BC", // Purple
      "Music": "#E91E63", // Pink
      "Computer Science": "#00ACC1", // Teal
      "Foreign Language": "#FF6D00", // Orange
      "Physical Education": "#5E35B1", // Deep Purple
    };
    
    return subjectColors[classroom.subject] || "#4285F4";
  };

  // Helper function to get status badge
  const getStatusBadge = (status, daysLeft) => {
    const statusClasses = {
      pending: daysLeft <= 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      late: 'bg-purple-100 text-purple-800',
      canceled: 'bg-red-100 text-red-800'
    };

    const statusText = status === 'pending' 
      ? (daysLeft <= 0 ? 'Overdue' : `Due in ${daysLeft} days`)
      : status;

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusText}
      </span>
    );
  };

  // Helper function to get tab content
  const getTabContent = () => {
    if (!classroom) return null;
    
    switch (activeTab) {
      case 'announcements':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcements
            </h3>
            
            {classroom.announcements && classroom.announcements.length > 0 ? (
              <div className="space-y-4">
                {classroom.announcements.filter(a => a.isPinned).length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">PINNED</h4>
                    {classroom.announcements
                      .filter(announcement => announcement.isPinned)
                      .map(announcement => (
                        <div key={announcement._id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-gray-800">{announcement.content}</p>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span>{announcement.postedBy?.name || "Teacher"}</span>
                                <span className="mx-1">•</span>
                                <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.414 3.586a2 2 0 1 1 2.828 2.828l-.793.793 7.072 7.072a1 1 0 1 1-1.414 1.414L10.035 8.621l-.793.793a2 2 0 0 1-2.828-2.828l3-3z" />
                            </svg>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
                
                {classroom.announcements
                  .filter(announcement => !announcement.isPinned)
                  .map(announcement => (
                    <div key={announcement._id} className="bg-white border border-gray-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-800">{announcement.content}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span>{announcement.postedBy?.name || "Teacher"}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for updates from your teacher</p>
              </div>
            )}
          </div>
        );

      case 'assignments':
        const pendingAssignments = classroom.assignments?.filter(a => a.status === "pending") || [];
        const completedAssignments = classroom.assignments?.filter(a => a.status === "completed") || [];
        
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                All Assignments
              </h3>
              <Link to="/viewall" className="text-sm text-blue-600 font-medium hover:text-blue-800">
                View All Assignments
              </Link>
            </div>
            
            {classroom.assignments && classroom.assignments.length > 0 ? (
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200 divide-y divide-gray-200">
                {classroom.assignments.map((assignment) => {
                  const dueDate = new Date(assignment.dueDate || assignment.submitDate);
                  const today = new Date();
                  const daysLeft = assignment.dueDate 
                    ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
                    : null;
                    
                  return (
                    <div key={assignment._id} className="p-4 hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-grow mb-3 md:mb-0">
                          <div className="flex items-center">
                            {assignment.status === 'completed' ? (
                              <div className="bg-green-100 p-2 rounded-full mr-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            ) : (
                              <div className="bg-orange-100 p-2 rounded-full mr-3">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="text-base font-medium text-gray-900">{assignment.title}</h4>
                              <div className="flex items-center mt-1 space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {dueDate.toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                  {assignment.points} points
                                </div>
                                <div>
                                  {getStatusBadge(assignment.status, daysLeft)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 items-center">
                          {assignment.status === 'pending' && (
                            <button onClick={() => handleViewAssignment(assignment._id)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              Submit
                            </button>
                          )}
                          <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(`/assignments/${assignment._id}`)}
                            className="px-3 py-1 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </div>
                      
                      {assignment.status === 'completed' && assignment.score && (
                        <div className="mt-3 ml-10">
                          <div className="flex items-center">
                            <div className="bg-green-50 px-2 py-1 rounded text-sm">
                              <span className="font-medium text-green-800">Score: {assignment.score}</span>
                              <span className="text-green-600 ml-1">/ {assignment.points}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
                <p className="mt-1 text-sm text-gray-500">No assignments have been posted in this classroom yet.</p>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Assignment Statistics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-semibold text-gray-900">{pendingAssignments.length}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Assignments that need to be completed</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">{completedAssignments.length}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Assignments you've submitted</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {classroom.performanceStats?.averageScore || 
                        (completedAssignments.length > 0 
                          ? Math.round(completedAssignments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssignments.length) 
                          : 'N/A')}
                      {classroom.performanceStats?.averageScore ? '%' : ''}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Your performance in this class</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'grades':
        const grades = classroom.grades || [];
        
        const calculateOverallGrade = () => {
          if (!grades.length) return 'N/A';
          
          const gradedItems = grades.filter(grade => grade.score !== null);
          if (!gradedItems.length) return 'Pending';
          
          const totalWeightedScore = gradedItems.reduce((sum, grade) => {
            return sum + (grade.score / grade.maxScore * grade.weight);
          }, 0);
          
          const totalWeight = gradedItems.reduce((sum, grade) => sum + grade.weight, 0);
          
          return Math.round(totalWeightedScore / totalWeight * 100);
        };
        
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiBarChart2 className="w-5 h-5 mr-2 text-purple-500" />
                Grades and Performance
              </h3>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Overall Grade</h4>
                  <p className="text-sm text-gray-500">Based on weighted average of all assessments</p>
                </div>
                <div className="text-3xl font-bold">
                  {(() => {
                    const grade = calculateOverallGrade();
                    if (grade === 'N/A' || grade === 'Pending') {
                      return <span className="text-gray-500">{grade}</span>;
                    }
                    
                    let colorClass = 'text-green-600';
                    if (grade < 60) colorClass = 'text-red-600';
                    else if (grade < 70) colorClass = 'text-orange-500';
                    else if (grade < 80) colorClass = 'text-yellow-600';
                    
                    return <span className={colorClass}>{grade}%</span>;
                  })()}
                </div>
              </div>
              
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {grades.map((grade) => (
                      <tr key={grade._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{grade.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(grade.date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{grade.weight}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {grade.score !== null ? (
                            <div className="flex items-center">
                              <div className="mr-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {grade.score} / {grade.maxScore}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {Math.round((grade.score / grade.maxScore) * 100)}%
                                </div>
                              </div>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    grade.score / grade.maxScore >= 0.8 ? 'bg-green-500' : 
                                    grade.score / grade.maxScore >= 0.7 ? 'bg-yellow-500' : 
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${(grade.score / grade.maxScore) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-800">
                              {grade.status || 'Pending'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {grades.length === 0 && (
                <div className="text-center py-8 text-gray-500">No grades available yet</div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button 
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Download Grade Report
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Breakdown</h4>
                <div className="space-y-4">
                  {grades
                    .filter(grade => grade.score !== null)
                    .map(grade => (
                      <div key={`chart-${grade._id}`}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{grade.title}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {Math.round((grade.score / grade.maxScore) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              grade.score / grade.maxScore >= 0.8 ? 'bg-green-500' : 
                              grade.score / grade.maxScore >= 0.7 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${(grade.score / grade.maxScore) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Upcoming Assessments</h4>
                <div className="space-y-4">
                  {grades
                    .filter(grade => grade.score === null)
                    .map(grade => (
                      <div key={`upcoming-${grade._id}`} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{grade.title}</div>
                          <div className="text-xs text-gray-500">{new Date(grade.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">
                            {grade.weight}% of grade
                          </div>
                        </div>
                      </div>
                  ))}
                  
                  {!grades.some(g => g.score === null) && (
                    <div className="text-center py-6 text-gray-500">No upcoming assessments</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'resources':
        const resources = classroom.resources || [];
        
        const resourcesByType = resources.reduce((acc, resource) => {
          acc[resource.type] = acc[resource.type] || [];
          acc[resource.type].push(resource);
          return acc;
        }, {});
        
        const resourceTypeIcons = {
          "Document": (
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          "Video": (
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          "Link": (
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          ),
          "Presentation": (
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          ),
          "Other": (
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )
        };
        
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Learning Resources
              </h3>
            </div>
            
            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(resourcesByType).map((type) => (
                  <div key={type} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex items-center mb-4">
                      {resourceTypeIcons[type] || resourceTypeIcons["Other"]}
                      <h4 className="ml-2 text-lg font-medium text-gray-800">{type}s</h4>
                    </div>
                    
                    <ul className="space-y-4">
                      {resourcesByType[type].map((resource) => (
                        <li key={resource._id || resource.title} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex justify-between items-center group"
                          >
                            <div>
                              <h5 className="font-medium text-gray-800 group-hover:text-blue-600">{resource.title}</h5>
                              <p className="text-sm text-gray-500">
                                Added {new Date(resource.addedAt).toLocaleDateString()} 
                                {resource.addedBy?.name && ` by ${resource.addedBy.name}`}
                              </p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No resources available</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for learning materials</p>
              </div>
            )}
          </div>
        );
        
      case 'students':
        const students = classroom.students || [];
        
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Classmates ({students.length})
              </h3>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Find classmate..." 
                  className="w-48 pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                />
                <div className="absolute left-2 top-2.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {students.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {students.map((student) => (
                  <div key={student._id} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-medium">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">{student.name}</h4>
                      <p className="text-xs text-gray-500">Student</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students enrolled</h3>
                <p className="mt-1 text-sm text-gray-500">Be the first to join this classroom!</p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pl-32">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen pl-32">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classroom) return null;

  return (
    <div className="min-h-screen flex">
      {/* Main content container - appears to right of sidebar */}
      <div className="flex-1 ml-24 overflow-hidden"> {/* ml-24 accounts for the sidebar */}
        <Header />
        
        <div className="mx-auto max-w-6xl px-4 py-6"> {/* Centered container */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Classroom Header Banner */}
            <div 
              className="h-48 relative" 
              style={{ 
                backgroundColor: getBannerColor(),
                backgroundImage: classroom.coverImage?.url ? `url(${classroom.coverImage.url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white">{classroom.name}</h1>
                    <div className="flex items-center mt-1">
                      <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {classroom.subject}
                      </span>
                      <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
                        {classroom.gradeLevel}
                      </span>
                      <span className="text-white/80 text-xs ml-3">
                        {classroom.code}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mb-20">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-md text-sm font-medium backdrop-blur-sm"
                    >
                      Settings
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="bg-white py-2 px-4 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                    >
                      Join Meet
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="px-6 mt-6 relative z-10 -translate-y-16 bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
                    <FiUsers className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Students</p>
                    <p className="text-2xl font-semibold">{classroom.students?.length || 0}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mr-4">
                    <FiCheckCircle className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-2xl font-semibold">{classroom.performanceStats?.averageScore || 0}%</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mr-4">
                    <FiClock className="text-orange-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-semibold">{classroom.performanceStats?.assignmentsPending || 0}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mr-4">
                    <FiFileText className="text-purple-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-semibold">{classroom.performanceStats?.assignmentsCompleted || 0}</p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Tabs and Content */}
            <div className="p-6 pt-0">
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                  {['assignments', 'announcements', 'resources', 'students', 'grades'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="overflow-auto">
                {getTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;







// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import Header from './Dashboardpages/Header';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { FiClock, FiUsers, FiFileText, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';
// import classroomData from '../data/classroom.json';

// const ClassroomPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('assignments');
//   const [classroom, setClassroom] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Just use local JSON data directly
//     setLoading(true);
    
//     console.log("Looking for classroom with ID:", id);
    
//     try {
//       // Check if classroomData is properly loaded
//       if (!classroomData || !Array.isArray(classroomData)) {
//         throw new Error("Classroom data is not loaded properly");
//       }
      
//       console.log("Available classrooms in JSON:", classroomData.map(c => c._id));
      
//       // Find exact match for the ID - trim any whitespace that might be in the ID
//       const cleanId = id ? id.trim() : id;
//       const foundClassroom = classroomData.find(room => room._id === cleanId);
      
//       if (foundClassroom) {
//         console.log("Found matching classroom:", foundClassroom.name);
        
//         // Create a deep copy to avoid mutating the original data
//         const classroom = JSON.parse(JSON.stringify(foundClassroom));
        
//         // Add detailed assignment data for UI display based on this specific classroom
//         classroom.assignments = [
//           { _id: `${id}-a1`, title: `${classroom.subject} Assignment 1`, dueDate: "2025-04-25", status: "pending", points: 100 },
//           { _id: `${id}-a2`, title: `${classroom.subject} Assignment 2`, dueDate: "2025-04-28", status: "pending", points: 75 },
//           { _id: `${id}-a3`, title: `${classroom.subject} Homework`, submitDate: "2025-04-10", score: 92, points: 100, status: "completed" }
//         ];
        
//         // Add detailed studentsc data specific to this classroom
//         classroom.students = classroom.students?.map((studentId, index) => ({
//           _id: studentId,
//           name: `${classroom.subject} Student ${index + 1}`,
//           email: `student${index + 1}@example.com`,
//           role: "Student"
//         })) || [];
      
//         // Add grades data for the grades tab
//         classroom.grades = [
//           { _id: `${id}-g1`, title: `${classroom.subject} Midterm Exam`, score: 87, maxScore: 100, date: "2025-03-15", weight: 30 },
//           { _id: `${id}-g2`, title: `${classroom.subject} Quizzes Average`, score: 42, maxScore: 50, date: "2025-04-01", weight: 20 }
//         ];
        
//         setClassroom(classroom);
//         setLoading(false);
//       } else {
//         console.warn("No classroom found with ID:", id);
        
//         // Fallback to first classroom, but mark it clearly
//         if (classroomData.length > 0) {
//           const fallbackClassroom = JSON.parse(JSON.stringify(classroomData[0]));
//           console.log("Using fallback classroom:", fallbackClassroom.name);
          
//           // Same setup as above
//           fallbackClassroom.assignments = [
//             { _id: `fallback-a1`, title: `${fallbackClassroom.subject} Assignment 1`, dueDate: "2025-04-25", status: "pending", points: 100 },
//             { _id: `fallback-a2`, title: `${fallbackClassroom.subject} Assignment 2`, dueDate: "2025-04-28", status: "pending", points: 75 },
//             { _id: `fallback-a3`, title: `${fallbackClassroom.subject} Homework`, submitDate: "2025-04-10", score: 92, points: 100, status: "completed" }
//           ];
          
//           fallbackClassroom.students = fallbackClassroom.students?.map((studentId, index) => ({
//             _id: studentId,
//             name: `${fallbackClassroom.subject} Student ${index + 1}`,
//             email: `student${index + 1}@example.com`,
//             role: "Student"
//           })) || [];
        
//           fallbackClassroom.grades = [
//             { _id: `fallback-g1`, title: `${fallbackClassroom.subject} Midterm Exam`, score: 87, maxScore: 100, date: "2025-03-15", weight: 30 },
//             { _id: `fallback-g2`, title: `${fallbackClassroom.subject} Quizzes Average`, score: 42, maxScore: 50, date: "2025-04-01", weight: 20 }
//           ];
          
//           setClassroom(fallbackClassroom);
//           setError(`Classroom with ID ${id} not found. Showing default classroom instead.`);
//           setLoading(false);
//         } else {
//           throw new Error("No classrooms available in the data");
//         }
//       }
//     } catch (err) {
//       console.error("Error processing classroom data:", err);
//       setError(`Failed to load classroom data: ${err.message}`);
//       setLoading(false);
//     }
//   }, [id]);

//   // Helper function to handle view assignment navigation
//   const Assignment = () => {
//     navigate("/Assignment", { state: { classroomId: id } });
//   };
  
//   // Helper function to calculate banner color based on subject
//   const getBannerColor = () => {
//     if (!classroom?.subject) return "#4285F4"; // Default blue
    
//     const subjectColors = {
//       "Math": "#4285F4", // Blue
//       "Science": "#0F9D58", // Green
//       "History": "#DB4437", // Red
//       "English": "#F4B400", // Yellow
//       "Art": "#AA46BC", // Purple
//       "Music": "#E91E63", // Pink
//       "Computer Science": "#00ACC1", // Teal
//       "Foreign Language": "#FF6D00", // Orange
//       "Physical Education": "#5E35B1", // Deep Purple
//     };
    
//     return subjectColors[classroom.subject] || "#4285F4";
//   };

//   // Helper function to get status badge
//   const getStatusBadge = (status, daysLeft) => {
//     const statusClasses = {
//       pending: daysLeft <= 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800',
//       completed: 'bg-green-100 text-green-800',
//       late: 'bg-purple-100 text-purple-800',
//       canceled: 'bg-red-100 text-red-800'
//     };

//     const statusText = status === 'pending' 
//       ? (daysLeft <= 0 ? 'Overdue' : `Due in ${daysLeft} days`)
//       : status;

//     return (
//       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
//         {statusText}
//       </span>
//     );
//   };

//   // Helper function to get tab content
//   const getTabContent = () => {
//     if (!classroom) return null;
    
//     switch (activeTab) {
//       case 'announcements':
//         return (
//           <div className="space-y-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//               <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
//               </svg>
//               Announcements
//             </h3>
            
//             {classroom.announcements && classroom.announcements.length > 0 ? (
//               <div className="space-y-4">
//                 {classroom.announcements.filter(a => a.isPinned).length > 0 && (
//                   <div className="mb-6">
//                     <h4 className="text-sm font-medium text-gray-500 mb-3">PINNED</h4>
//                     {classroom.announcements
//                       .filter(announcement => announcement.isPinned)
//                       .map(announcement => (
//                         <div key={announcement._id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-3">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <p className="text-gray-800">{announcement.content}</p>
//                               <div className="mt-2 flex items-center text-sm text-gray-500">
//                                 <span>{announcement.postedBy?.name || "Teacher"}</span>
//                                 <span className="mx-1">•</span>
//                                 <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
//                               </div>
//                             </div>
//                             <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                               <path d="M9.414 3.586a2 2 0 1 1 2.828 2.828l-.793.793 7.072 7.072a1 1 0 1 1-1.414 1.414L10.035 8.621l-.793.793a2 2 0 0 1-2.828-2.828l3-3z" />
//                             </svg>
//                           </div>
//                         </div>
//                       ))
//                     }
//                   </div>
//                 )}
                
//                 {classroom.announcements
//                   .filter(announcement => !announcement.isPinned)
//                   .map(announcement => (
//                     <div key={announcement._id} className="bg-white border border-gray-200 p-4 rounded-lg">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="text-gray-800">{announcement.content}</p>
//                           <div className="mt-2 flex items-center text-sm text-gray-500">
//                             <span>{announcement.postedBy?.name || "Teacher"}</span>
//                             <span className="mx-1">•</span>
//                             <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 }
//               </div>
//             ) : (
//               <div className="text-center py-8 bg-gray-50 rounded-xl">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
//                 <p className="mt-1 text-sm text-gray-500">Check back later for updates from your teacher</p>
//               </div>
//             )}
//           </div>
//         );

//       case 'assignments':
//         // Prepare assignments data from model
//         const pendingAssignments = classroom.assignments?.filter(a => a.status === "pending") || [];
//         const completedAssignments = classroom.assignments?.filter(a => a.status === "completed") || [];
        
//         return (
//           <div className="space-y-8">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 All Assignments
//               </h3>
//               <Link to="/viewall" className="text-sm text-blue-600 font-medium hover:text-blue-800">
//                 View All Assignments
//               </Link>
//             </div>
            
//             {classroom.assignments && classroom.assignments.length > 0 ? (
//               <div className="bg-white rounded-xl overflow-hidden border border-gray-200 divide-y divide-gray-200">
//                 {classroom.assignments.map((assignment) => {
//                   const dueDate = new Date(assignment.dueDate || assignment.submitDate);
//                   const today = new Date();
//                   const daysLeft = assignment.dueDate 
//                     ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
//                     : null;
                    
//                   return (
//                     <div key={assignment._id} className="p-4 hover:bg-gray-50">
//                       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                         <div className="flex-grow mb-3 md:mb-0">
//                           <div className="flex items-center">
//                             {assignment.status === 'completed' ? (
//                               <div className="bg-green-100 p-2 rounded-full mr-3">
//                                 <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                 </svg>
//                               </div>
//                             ) : (
//                               <div className="bg-orange-100 p-2 rounded-full mr-3">
//                                 <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                               </div>
//                             )}
                            
//                             <div>
//                               <h4 className="text-base font-medium text-gray-900">{assignment.title}</h4>
//                               <div className="flex items-center mt-1 space-x-4">
//                                 <div className="flex items-center text-sm text-gray-500">
//                                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                   </svg>
//                                   {dueDate.toLocaleDateString()}
//                                 </div>
//                                 <div className="flex items-center text-sm text-gray-500">
//                                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                                   </svg>
//                                   {assignment.points} points
//                                 </div>
//                                 <div>
//                                   {getStatusBadge(assignment.status, daysLeft)}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
                        
//                         <div className="flex space-x-2 items-center">
//                           {assignment.status === 'pending' && (
//                             <button onClick={() => Assignment()}
//                               className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                               Submit
//                             </button>
//                           )}
//                           <motion.button 
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={() => navigate(`/assignments/${assignment._id}`)}
//                             className="px-3 py-1 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
//                           >
//                             View Details
//                           </motion.button>
//                         </div>
//                       </div>
                      
//                       {assignment.status === 'completed' && assignment.score && (
//                         <div className="mt-3 ml-10">
//                           <div className="flex items-center">
//                             <div className="bg-green-50 px-2 py-1 rounded text-sm">
//                               <span className="font-medium text-green-800">Score: {assignment.score}</span>
//                               <span className="text-green-600 ml-1">/ {assignment.points}</span>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-16 bg-gray-50 rounded-xl">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
//                 <p className="mt-1 text-sm text-gray-500">No assignments have been posted in this classroom yet.</p>
//               </div>
//             )}
            
//             <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-800">Assignment Statistics</h3>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white rounded-xl p-4 border border-gray-200">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm text-gray-500">Pending</p>
//                     <p className="text-2xl font-semibold text-gray-900">{pendingAssignments.length}</p>
//                   </div>
//                   <div className="p-2 bg-yellow-100 rounded-lg">
//                     <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="mt-2">
//                   <p className="text-xs text-gray-500">Assignments that need to be completed</p>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-xl p-4 border border-gray-200">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm text-gray-500">Completed</p>
//                     <p className="text-2xl font-semibold text-gray-900">{completedAssignments.length}</p>
//                   </div>
//                   <div className="p-2 bg-green-100 rounded-lg">
//                     <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="mt-2">
//                   <p className="text-xs text-gray-500">Assignments you've submitted</p>
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-xl p-4 border border-gray-200">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm text-gray-500">Average Score</p>
//                     <p className="text-2xl font-semibold text-gray-900">
//                       {classroom.performanceStats?.averageScore || 
//                         (completedAssignments.length > 0 
//                           ? Math.round(completedAssignments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssignments.length) 
//                           : 'N/A')}
//                       {classroom.performanceStats?.averageScore ? '%' : ''}
//                     </p>
//                   </div>
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div className="mt-2">
//                   <p className="text-xs text-gray-500">Your performance in this class</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
      
//       case 'grades':
//         // Get grades data from classroom model
//         const grades = classroom.grades || [];
        
//         // Calculate overall grade
//         const calculateOverallGrade = () => {
//           if (!grades.length) return 'N/A';
          
//           const gradedItems = grades.filter(grade => grade.score !== null);
//           if (!gradedItems.length) return 'Pending';
          
//           const totalWeightedScore = gradedItems.reduce((sum, grade) => {
//             return sum + (grade.score / grade.maxScore * grade.weight);
//           }, 0);
          
//           const totalWeight = gradedItems.reduce((sum, grade) => sum + grade.weight, 0);
          
//           return Math.round(totalWeightedScore / totalWeight * 100);
//         };
        
//         return (
//           <div className="space-y-8">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                 <FiBarChart2 className="w-5 h-5 mr-2 text-purple-500" />
//                 Grades and Performance
//               </h3>
//             </div>
            
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h4 className="text-lg font-medium text-gray-900">Overall Grade</h4>
//                   <p className="text-sm text-gray-500">Based on weighted average of all assessments</p>
//                 </div>
//                 <div className="text-3xl font-bold">
//                   {(() => {
//                     const grade = calculateOverallGrade();
//                     if (grade === 'N/A' || grade === 'Pending') {
//                       return <span className="text-gray-500">{grade}</span>;
//                     }
                    
//                     let colorClass = 'text-green-600';
//                     if (grade < 60) colorClass = 'text-red-600';
//                     else if (grade < 70) colorClass = 'text-orange-500';
//                     else if (grade < 80) colorClass = 'text-yellow-600';
                    
//                     return <span className={colorClass}>{grade}%</span>;
//                   })()}
//                 </div>
//               </div>
              
//               <div className="overflow-hidden border border-gray-200 rounded-lg">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {grades.map((grade) => (
//                       <tr key={grade._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{grade.title}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">{new Date(grade.date).toLocaleDateString()}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-500">{grade.weight}%</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {grade.score !== null ? (
//                             <div className="flex items-center">
//                               <div className="mr-2">
//                                 <div className="text-sm font-medium text-gray-900">
//                                   {grade.score} / {grade.maxScore}
//                                 </div>
//                                 <div className="text-xs text-gray-500">
//                                   {Math.round((grade.score / grade.maxScore) * 100)}%
//                                 </div>
//                               </div>
//                               <div className="w-16 bg-gray-200 rounded-full h-2">
//                                 <div 
//                                   className={`h-2 rounded-full ${
//                                     grade.score / grade.maxScore >= 0.8 ? 'bg-green-500' : 
//                                     grade.score / grade.maxScore >= 0.7 ? 'bg-yellow-500' : 
//                                     'bg-red-500'
//                                   }`}
//                                   style={{ width: `${(grade.score / grade.maxScore) * 100}%` }}
//                                 ></div>
//                               </div>
//                             </div>
//                           ) : (
//                             <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-800">
//                               {grade.status || 'Pending'}
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
              
//               {grades.length === 0 && (
//                 <div className="text-center py-8 text-gray-500">No grades available yet</div>
//               )}
              
//               <div className="mt-6 flex justify-end">
//                 <button 
//                   className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md"
//                 >
//                   Download Grade Report
//                 </button>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h4 className="text-lg font-medium text-gray-900 mb-4">Performance Breakdown</h4>
//                 <div className="space-y-4">
//                   {grades
//                     .filter(grade => grade.score !== null)
//                     .map(grade => (
//                       <div key={`chart-${grade._id}`}>
//                         <div className="flex justify-between mb-1">
//                           <span className="text-sm font-medium text-gray-700">{grade.title}</span>
//                           <span className="text-sm font-medium text-gray-700">
//                             {Math.round((grade.score / grade.maxScore) * 100)}%
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div 
//                             className={`h-2 rounded-full ${
//                               grade.score / grade.maxScore >= 0.8 ? 'bg-green-500' : 
//                               grade.score / grade.maxScore >= 0.7 ? 'bg-yellow-500' : 
//                               'bg-red-500'
//                             }`}
//                             style={{ width: `${(grade.score / grade.maxScore) * 100}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//                 <h4 className="text-lg font-medium text-gray-900 mb-4">Upcoming Assessments</h4>
//                 <div className="space-y-4">
//                   {grades
//                     .filter(grade => grade.score === null)
//                     .map(grade => (
//                       <div key={`upcoming-${grade._id}`} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{grade.title}</div>
//                           <div className="text-xs text-gray-500">{new Date(grade.date).toLocaleDateString()}</div>
//                         </div>
//                         <div>
//                           <div className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">
//                             {grade.weight}% of grade
//                           </div>
//                         </div>
//                       </div>
//                   ))}
                  
//                   {!grades.some(g => g.score === null) && (
//                     <div className="text-center py-6 text-gray-500">No upcoming assessments</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'resources':
//         // Get resources from classroom model
//         const resources = classroom.resources || [];
        
//         // Group resources by type
//         const resourcesByType = resources.reduce((acc, resource) => {
//           acc[resource.type] = acc[resource.type] || [];
//           acc[resource.type].push(resource);
//           return acc;
//         }, {});
        
//         // Resource type icons
//         const resourceTypeIcons = {
//           "Document": (
//             <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//             </svg>
//           ),
//           "Video": (
//             <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           ),
//           "Link": (
//             <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//             </svg>
//           ),
//           "Presentation": (
//             <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
//             </svg>
//           ),
//           "Other": (
//             <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//             </svg>
//           )
//         };
        
//         return (
//           <div className="space-y-8">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//                 Learning Resources
//               </h3>
//             </div>
            
//             {resources.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {Object.keys(resourcesByType).map((type) => (
//                   <div key={type} className="bg-white p-6 rounded-xl shadow-sm">
//                     <div className="flex items-center mb-4">
//                       {resourceTypeIcons[type] || resourceTypeIcons["Other"]}
//                       <h4 className="ml-2 text-lg font-medium text-gray-800">{type}s</h4>
//                     </div>
                    
//                     <ul className="space-y-4">
//                       {resourcesByType[type].map((resource) => (
//                         <li key={resource._id || resource.title} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
//                           <a 
//                             href={resource.url} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="flex justify-between items-center group"
//                           >
//                             <div>
//                               <h5 className="font-medium text-gray-800 group-hover:text-blue-600">{resource.title}</h5>
//                               <p className="text-sm text-gray-500">
//                                 Added {new Date(resource.addedAt).toLocaleDateString()} 
//                                 {resource.addedBy?.name && ` by ${resource.addedBy.name}`}
//                               </p>
//                             </div>
//                             <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                             </svg>
//                           </a>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 bg-gray-50 rounded-xl">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No resources available</h3>
//                 <p className="mt-1 text-sm text-gray-500">Check back later for learning materials</p>
//               </div>
//             )}
//           </div>
//         );
        
//       case 'students':
//         const students = classroom.students || [];
        
//         return (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                 <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 Classmates ({students.length})
//               </h3>
              
//               <div className="relative">
//                 <input 
//                   type="text" 
//                   placeholder="Find classmate..." 
//                   className="w-48 pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
//                 />
//                 <div className="absolute left-2 top-2.5">
//                   <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             {students.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {students.map((student) => (
//                   <div key={student._id} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
//                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
//                       <span className="text-gray-600 font-medium">
//                         {student.name.charAt(0)}
//                       </span>
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-800">{student.name}</h4>
//                       <p className="text-xs text-gray-500">Student</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 bg-gray-50 rounded-xl">
//                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">No students enrolled</h3>
//                 <p className="mt-1 text-sm text-gray-500">Be the first to join this classroom!</p>
//               </div>
//             )}
//           </div>
//         );
        
//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen pl-32">
//         <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen pl-32">
//         <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden p-6">
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
//             <div className="flex">
//               <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <div>
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!classroom) return null;

//   return (
//     <div className="min-h-screen flex">
//       {/* Main content container - appears to right of sidebar */}
//       <div className="flex-1 ml-24 overflow-hidden"> {/* ml-24 accounts for the sidebar */}
//         <Header />
        
//         <div className="mx-auto max-w-6xl px-4 py-6"> {/* Centered container */}
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             {/* Classroom Header Banner */}
//             <div 
//               className="h-48 relative" 
//               style={{ 
//                 backgroundColor: getBannerColor(),
//                 backgroundImage: classroom.coverImage?.url ? `url(${classroom.coverImage.url})` : 'none',
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//               }}
//             >
//               <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 flex flex-col justify-end p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h1 className="text-3xl font-bold text-white">{classroom.name}</h1>
//                     <div className="flex items-center mt-1">
//                       <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
//                         {classroom.subject}
//                       </span>
//                       <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full ml-2">
//                         {classroom.gradeLevel}
//                       </span>
//                       <span className="text-white/80 text-xs ml-3">
//                         {classroom.code}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2 mb-20">
//                     <motion.button 
//                       whileHover={{ scale: 1.05 }} 
//                       whileTap={{ scale: 0.95 }}
//                       className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-md text-sm font-medium backdrop-blur-sm"
//                     >
//                       Settings
//                     </motion.button>
//                     <motion.button 
//                       whileHover={{ scale: 1.05 }} 
//                       whileTap={{ scale: 0.95 }}
//                       className="bg-white py-2 px-4 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
//                     >
//                       Join Meet
//                     </motion.button>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Stats Cards */}
//             <div className="px-6 mt-6 relative z-10 -translate-y-16 bg-white rounded-xl shadow-lg p-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                 <motion.div 
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 0.3 }}
//                   className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-4">
//                     <FiUsers className="text-blue-500 text-xl" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Students</p>
//                     <p className="text-2xl font-semibold">{classroom.students?.length || 0}</p>
//                   </div>
//                 </motion.div>
                
//                 <motion.div 
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 0.3, delay: 0.1 }}
//                   className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mr-4">
//                     <FiCheckCircle className="text-green-500 text-xl" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Average Score</p>
//                     <p className="text-2xl font-semibold">{classroom.performanceStats?.averageScore || 0}%</p>
//                   </div>
//                 </motion.div>
                
//                 <motion.div 
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 0.3, delay: 0.2 }}
//                   className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mr-4">
//                     <FiClock className="text-orange-500 text-xl" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Pending</p>
//                     <p className="text-2xl font-semibold">{classroom.performanceStats?.assignmentsPending || 0}</p>
//                   </div>
//                 </motion.div>
                
//                 <motion.div 
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 0.3, delay: 0.3 }}
//                   className="bg-white rounded-xl shadow-sm p-4 flex items-center border border-gray-100"
//                 >
//                   <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mr-4">
//                     <FiFileText className="text-purple-500 text-xl" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Completed</p>
//                     <p className="text-2xl font-semibold">{classroom.performanceStats?.assignmentsCompleted || 0}</p>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
            
//             {/* Tabs and Content */}
//             <div className="p-6 pt-0">
//               <div className="border-b border-gray-200 mb-6">
//                 <nav className="-mb-px flex space-x-6 overflow-x-auto">
//                   {['assignments', 'announcements', 'resources', 'students', 'grades'].map(tab => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`py-4 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
//                         activeTab === tab
//                           ? 'border-blue-500 text-blue-600'
//                           : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </nav>
//               </div>
              
//               {/* Tab Content */}
//               <div className="overflow-auto">
//                 {getTabContent()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClassroomPage;