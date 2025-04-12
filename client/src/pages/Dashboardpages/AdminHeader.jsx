import React from "react";
import { FaUserCircle, FaChalkboardTeacher } from "react-icons/fa";
import { useRole } from "../../context/RoleContext"; // Import RoleContext

const AdminHeader = () => {
  const { role } = useRole(); 

  return (
    <header className="fixed text-white top-0 left-0 right-0 z-30 bg-[#21294F] bg-opacity-50 backdrop-blur-md shadow-lg p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-white">E-LEARNING Admin</h1>
      <div className="text-3xl text-white">
        <FaUserCircle />
      </div>
    </header>
  );
};

export default AdminHeader;