import React from "react";
import { FaUserCircle, FaChalkboardTeacher } from "react-icons/fa";
import { useRole } from "../../context/RoleContext"; // Import RoleContext

const FacHeader = () => {
  const { role } = useRole(); // Get role from context

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-[#E195AB] bg-opacity-50 backdrop-blur-md shadow-lg p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">E-LEARNING Faculty</h1>
      <div className="text-3xl text-black">
        {role === "teacher" ? <FaChalkboardTeacher /> : <FaUserCircle />}
      </div>
    </header>
  );
};

export default FacHeader;