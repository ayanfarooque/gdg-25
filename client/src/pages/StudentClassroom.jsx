import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./Dashboardpages/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentClassroom = () => {
  const [activeTab, setActiveTab] = useState("classes");
  const [classrooms, setClassrooms] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();

  // Fetch classrooms from the backend
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/classrooms/studentclassroom"); // Backend route
        setClassrooms(response.data.data);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
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
    try {
      const response = await axios.post(`/api/student-classroom/request-join/${joinCode}`);
      alert("Join request sent successfully!");
      setJoinCode(""); // Clear the input field
    } catch (error) {
      console.error("Error joining classroom:", error);
      alert("Failed to send join request. Please check the code and try again.");
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-4 md:p-6 text-gray-800 max-w-6xl mt-20 mx-auto bg-gray-50 min-h-screen">
      <Header />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Enrolled Classrooms
        </h1>
        <button
          onClick={() => setActiveTab("join")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Join Classroom
        </button>
      </div>

      {activeTab === "classes" && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="gray-50 rounded-xl p-4 md:p-6 border border-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classrooms.map((classroom) => (
              <motion.div
                key={classroom._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 bg-white"
                onClick={() => handleClassroomClick(classroom._id)}
              >
                {/* Banner */}
                <div
                  className="h-28 relative"
                  style={{
                    backgroundColor: "#4285F4",
                    backgroundImage: "linear-gradient(to right, #4285F4, #6A5ACD)",
                  }}
                >
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-xl">{classroom.name}</h3>
                    <p className="opacity-90 text-sm">{classroom.subject}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        Teacher: {classroom.teacher?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {classroom.students?.length || 0} students
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-start">
                      <svg
                        className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Recent topic:</span>{" "}
                        {classroom.description
                          ? classroom.description.substring(0, 50) + "..."
                          : "No recent topics"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "join" && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="gray-50 rounded-xl p-4 md:p-6 border border-gray-50"
        >
          <h2 className="text-xl font-bold mb-4">Join a Classroom</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter classroom code"
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoinClassroom}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentClassroom;