import { FaHome, FaBook, FaUser, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-20 bg-teal-700 h-screen flex flex-col items-center py-6 space-y-6">
      <FaHome className="text-white text-2xl cursor-pointer" />
      <FaBook className="text-white text-2xl cursor-pointer" />
      <FaUser className="text-white text-2xl cursor-pointer" />
      <FaChartBar className="text-white text-2xl cursor-pointer" />
    </div>
  );
};

export default Sidebar;
