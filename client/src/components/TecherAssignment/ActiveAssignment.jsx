import React from "react";

const ActiveAssignment = () => {
  return (
    <div className="bg-white p-6 rounded-lg  w-1/2">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Active Assignments</h2>
      <div className="space-y-3">
        <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white">
          📌 17 Feb - SST - AS1002
        </button>
        <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white">
          📌 19 Feb - SCI - AS1003
        </button>
        <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white">
          📌 21 Feb - MATH - AS1006
        </button>
      </div>
    </div>
  );
};

export default ActiveAssignment;

