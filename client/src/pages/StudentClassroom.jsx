import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./Dashboardpages/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentClassroom = () => {
  const [activeTab, setActiveTab] = useState("classes");
  const [classrooms, setClassrooms] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch classrooms from the backend
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/classrooms/studentclassroom");
        setClassrooms(response.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
        setError("Failed to load classrooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  // Handle classroom click
  const handleClassroomClick = (classroomId) => {
    navigate(`/student-classroom/${classroomId}`);
  };

  // Handle join classroom
  const handleJoinClassroom = async () => {
    if (!joinCode.trim()) {
      alert("Please enter a valid classroom code");
      return;
    }
    
    try {
      const response = await axios.post(`http://localhost:5000/api/student-classroom/request-join/${joinCode}`);
      alert("Join request sent successfully!");
      setJoinCode(""); // Clear the input field
      // Refresh the classroom list
      const refreshedClassrooms = await axios.get("http://localhost:5000/api/classrooms/studentclassroom");
      setClassrooms(refreshedClassrooms.data.data);
    } catch (error) {
      console.error("Error joining classroom:", error);
      alert("Failed to send join request. Please check the code and try again.");
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
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="px-4 py-6 md:px-8 lg:px-12 max-w-7xl mx-auto mt-16">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Learning Environment
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your enrolled classrooms and join new ones
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setActiveTab("classes")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "classes"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                My Classes
              </button>
              <button
                onClick={() => setActiveTab("join")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "join"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Join Classroom
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === "classes" && (
          <motion.div
            key="classes"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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
                  You haven't joined any classrooms yet. Click the "Join Classroom" button to get started.
                </p>
                <button
                  onClick={() => setActiveTab("join")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Join Your First Classroom
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map((classroom) => (
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
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-gray-700 font-medium">
                              {classroom.teacher?.name || "Teacher not assigned"}
                            </p>
                          </div>
                          <div className="flex items-center mt-2">
                            <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-gray-600 text-sm">
                              {classroom.students?.length || 0} students enrolled
                            </p>
                          </div>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Active</span>
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
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "join" && (
          <motion.div
            key="join"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Join a New Classroom</h2>
            <p className="text-gray-600 mb-6">
              Enter the classroom code provided by your teacher to request access
            </p>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-2/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter classroom code"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
              <button
                onClick={handleJoinClassroom}
                disabled={!joinCode.trim()}
                className={`px-6 py-3 rounded-lg font-medium w-full md:w-auto ${
                  joinCode.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                } transition-colors`}
              >
                Request to Join
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex">
                <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-blue-800 font-medium">How it works</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Enter the code and submit a join request. Once approved by your teacher, you'll gain access to the classroom materials and assignments.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentClassroom;