import React from "react";


const assignments = [
  { id: 1, title: "Math - AS1010", date: "20 Feb", checked: true },
  { id: 2, title: "Science - AS1011", date: "22 Feb", checked: false },
  { id: 3, title: "History - AS1012", date: "24 Feb", checked: true },
  { id: 4, title: "English - AS1013", date: "26 Feb", checked: false },
];

const ReviewSection = () => {
  return (
    <div className="bg-white w-full p-6 rounded-lg text-center min-h-[300px] ">
      
      {/* Search Bar */}
      <div className="p-3 w-full rounded-md shadow-md flex bg-[#f4f1ea] items-center max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search assignments..."
          className="flex-1 p-2 border-none rounded-md outline-none text-gray-600"
        />
        <button className="ml-2 p-2 bg-white text-gray-600 rounded-md shadow-md">
          🔍
        </button>
      </div>

      {/* Section Title */}
      <h2 className="text-xl mt-5 font-bold text-gray-800">
        SELECT ASSIGNMENT TO CHECK STATUS
      </h2>

      {/* Assignments List */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center justify-between transition-transform transform hover:scale-105"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {assignment.title}
              </h3>
              <p className="text-gray-600">{assignment.date}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                assignment.checked
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {assignment.checked ? "Checked ✅" : "Not Checked ❌"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;

