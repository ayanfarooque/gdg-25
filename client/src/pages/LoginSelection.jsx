import React from "react";
import { FaUserGraduate, FaChalkboardTeacher, FaUserCog } from "react-icons/fa";
import { motion } from "framer-motion";

function LoginSelection({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ECE7CA] text-gray-800 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold mb-4 text-[#21294F]">Welcome to E-LEARNING</h1>
        <p className="text-lg text-gray-700 mb-2">Select your role to continue</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
        {/* Teacher Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full md:w-64 p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer overflow-hidden relative"
          onClick={() => onSelect("teacher")}
        >
          <div className="absolute inset-0 bg-[#E195AB] opacity-10 rounded-2xl"></div>
          <div className="bg-[#E195AB] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
            <FaChalkboardTeacher className="text-white text-5xl" />
          </div>
          <h3 className="text-2xl font-semibold text-[#21294F] mb-3">Faculty</h3>
          <p className="text-gray-600 text-sm">Login as a teacher to manage classes and resources</p>
          <div className="mt-6">
            <span className="py-2 px-4 bg-[#E195AB] text-white rounded-full text-sm font-medium">
              Access Portal
            </span>
          </div>
        </motion.div>

        {/* Student Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full md:w-64 p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer overflow-hidden relative"
          onClick={() => onSelect("student")}
        >
          <div className="absolute inset-0 bg-[#49ABB0] opacity-10 rounded-2xl"></div>
          <div className="bg-[#49ABB0] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
            <FaUserGraduate className="text-white text-5xl" />
          </div>
          <h3 className="text-2xl font-semibold text-[#21294F] mb-3">Student</h3>
          <p className="text-gray-600 text-sm">Login as a student to access courses and assignments</p>
          <div className="mt-6">
            <span className="py-2 px-4 bg-[#49ABB0] text-white rounded-full text-sm font-medium">
              Access Portal
            </span>
          </div>
        </motion.div>

        {/* Admin Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full md:w-64 p-8 bg-white rounded-2xl shadow-lg text-center cursor-pointer overflow-hidden relative"
          onClick={() => onSelect("admin")}
        >
          <div className="absolute inset-0 bg-black opacity-10 rounded-2xl"></div>
          <div className="bg-black w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
            <FaUserCog className="text-white text-5xl" />
          </div>
          <h3 className="text-2xl font-semibold text-[#21294F] mb-3">Administrator</h3>
          <p className="text-gray-600 text-sm">Login as admin to manage system settings and users</p>
          <div className="mt-6">
            <span className="py-2 px-4 bg-black text-white rounded-full text-sm font-medium">
              Access Portal
            </span>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 text-center text-gray-500 text-sm"
      >
        <p>© 2025 E-Learning Platform. All rights reserved.</p>
      </motion.div>
    </div>
  );
}

export default LoginSelection;