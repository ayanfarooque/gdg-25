import React from "react";

const PreviousAssignment = () => {

  return (
    <div className="bg-white p-6 rounded-lg  w-1/2">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Previous Assignments</h2>
      <div className="space-y-3">
        <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white">
          📌 20 Feb - DS - AS1008
        </button>
        <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:text-white">
          📌 22 Feb - DS - AS1009
        </button>
      </div>
    </div>
  );
};

export default PreviousAssignment;

