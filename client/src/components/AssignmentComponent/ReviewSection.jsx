import React, { useState } from "react";
import { FiSearch, FiChevronRight, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const assignments = [
  { id: 1, title: "Math - AS1010", date: "20 Feb", checked: true },
  { id: 2, title: "Science - AS1011", date: "22 Feb", checked: false },
  { id: 3, title: "History - AS1012", date: "24 Feb", checked: true },
  { id: 4, title: "English - AS1013", date: "26 Feb", checked: false },
];

const ReviewSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const filteredAssignments = searchQuery 
    ? assignments.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : assignments;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full p-6 rounded-lg text-center min-h-[300px]">
      {/* Search Bar */}
      <div className="p-3 w-full rounded-lg shadow-sm flex bg-white items-center max-w-lg mx-auto border border-gray-200 focus-within:border-[#3A7CA5] focus-within:ring-2 focus-within:ring-[#3A7CA5] focus-within:ring-opacity-20 transition-all">
        <FiSearch className="text-gray-400 ml-1 mr-2" size={18} />
        <input
          type="text"
          placeholder="Search assignments..."
          className="flex-1 p-1 border-none rounded-md outline-none text-gray-700 placeholder-gray-400"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            onClick={() => setSearchQuery("")}
          >
            <FiXCircle size={16} />
          </button>
        )}
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-center mt-6 mb-6">
        <div className="h-0.5 bg-gray-200 flex-1 mr-4"></div>
        <h2 className="text-xl font-bold text-gray-800">
          ASSIGNMENT STATUS
        </h2>
        <div className="h-0.5 bg-gray-200 flex-1 ml-4"></div>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-2 justify-center mb-6">
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedSubject === null ? 'bg-[#3A7CA5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedSubject(null)}
        >
          All
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedSubject === 'Math' ? 'bg-[#3A7CA5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedSubject('Math')}
        >
          Math
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedSubject === 'Science' ? 'bg-[#3A7CA5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedSubject('Science')}
        >
          Science
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedSubject === 'Other' ? 'bg-[#3A7CA5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedSubject('Other')}
        >
          Other
        </button>
      </div>

      {/* Assignments List */}
      {filteredAssignments.length > 0 ? (
        <motion.div 
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredAssignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 text-left">
                    {assignment.title}
                  </h3>
                  {assignment.checked ? (
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full flex items-center">
                      <FiCheckCircle className="mr-1" size={12} />
                      Checked
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full flex items-center">
                      <FiXCircle className="mr-1" size={12} />
                      Pending
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">{assignment.date}</p>
                </div>
              </div>
              <div className="mt-4 flex">
                <button 
                  className={`w-full py-2 px-3 rounded-md text-sm font-medium flex justify-center items-center gap-1 ${
                    assignment.checked 
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-[#ECE7CA] text-[#3A7CA5] hover:bg-[#e5dfbb]'
                  } transition-colors`}
                >
                  {assignment.checked ? 'View Results' : 'Check Now'}
                  <FiChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="mt-10 p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No assignments found</h3>
            <p className="text-gray-500 text-center">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
