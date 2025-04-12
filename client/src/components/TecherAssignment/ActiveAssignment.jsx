import React from "react";

const ActiveAssignment = () => {
  return (
    <div className="bg-[#E195AB] p-6 rounded-[30px] text-white w-full max-w-md mx-auto ">
      <h2 className="text-2xl text-[#21294F] font-semibold mb-4 text-center tracking-wide">Active Assignments</h2>

      <div className="flex flex-col gap-3">
        {["Maths", "Science", "English", "SST"].map((subject, index) => (
          <button
            key={index}
            className="bg-[rgba(33,41,79,0.3)] text-black font-medium py-3 rounded-[30px] shadow-md transition-all transform hover:scale-105 hover:shadow-xl"
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActiveAssignment;
