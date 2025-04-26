import React, { useState } from "react";
import { FaUserCircle, FaChalkboardTeacher, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRole } from "../../context/RoleContext";

const Header = ({ title }) => {
  const { role } = useRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-teal-500 to-teal-400 bg-opacity-50 backdrop-blur-md shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-100">E-LEARNING</h1>
        <div 
          className="text-teal-600 text-3xl cursor-pointer hover:opacity-80 transition-opacity"
          onClick={toggleDrawer}
        >
          {role === "teacher" ? <FaChalkboardTeacher /> : <FaUserCircle />}
        </div>
      </header>

      {/* Profile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={toggleDrawer}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ right: "-320px" }}
              animate={{ right: 0 }}
              exit={{ right: "-320px" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-screen w-100 bg-[#49ABB0] z-50 shadow-xl overflow-y-auto pt-10"
            >
              {/* Drawer Content */}
              <div className="p-6 bg-[#F5F5DD] m-4 rounded-2xl shadow-2xl">
                {/* Close Button */}
                <button 
                  onClick={toggleDrawer}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2"
                >
                  <FaTimes size={20} />
                </button>
                
                {/* Profile Image */}
                <div className="flex flex-col items-center pt-4">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden shadow-lg transition-transform hover:scale-105 duration-300">
                    <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
                  </div>

                  {/* Email Tag */}
                  <div className="mt-4 px-4 py-1 text-sm font-medium bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors">
                    myfriend@gmail.com
                  </div>
                </div>

                {/* Student Info */}
                <div className="mt-6 space-y-3 text-sm">
                  {[
                    { label: "Name", value: "Ali" },
                    { label: "Student ID", value: "50" },
                    { label: "Address", value: "402, Sprayday Canga, Bhanunogor" },
                    { label: "DOB", value: "02-05-2005" },
                    { label: "Guardian", value: "Usman Suleman" },
                    { label: "Class", value: "9th" }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="font-semibold text-gray-700">{item.label}:</span> 
                      <span className="text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Badges Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-gray-600 text-white rounded-full text-sm shadow-md hover:scale-105 transition-transform">
                      🎯 15
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-semibold rounded-full text-sm shadow-md hover:scale-105 transition-transform">
                      🏆 Gold
                    </span>
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full text-sm shadow-md hover:scale-105 transition-transform">
                      ⭐ 10
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <button className="mt-8 w-full bg-[#49ABB0] hover:bg-[#ECE7CA] hover:text-black hover:border-2 font-semibold py-3 rounded-lg shadow-xl hover:scale-105 transition-all duration-300">
                  Download Result
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;