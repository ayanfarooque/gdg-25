import React from "react";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";

function LoginSelection({ onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f1f1f1] text-gray-800">
      <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Select Your Role</h1>
      <p className="text-lg text-gray-600 mb-8">Login to handle your role</p>
      <div className="flex gap-8">
        {/* Teacher Card */}
        <div
          className="w-64 p-8 bg-white rounded-xl shadow-lg text-center cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => onSelect("teacher")}
        >
          <FaChalkboardTeacher className="text-blue-600 text-6xl mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-blue-700">Teacher</h3>
        </div>

        {/* Student Card */}
        <div
          className="w-64 p-8 bg-white rounded-xl shadow-lg text-center cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          onClick={() => onSelect("student")}
        >
          <FaUserGraduate className="text-green-600 text-6xl mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-green-700">Student</h3>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;
