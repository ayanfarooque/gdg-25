import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SidebarItem = ({ name, icon: Icon, color, path, isOpen, isActive, selectedBorderColor }) => {
  return (
    <Link to={path} className="w-full">
      <motion.div
        className={`flex items-center transition-all duration-300 ${
          isActive 
            ? `border-2 border-[${selectedBorderColor}] rounded-lg` 
            : "hover:bg-white hover:bg-opacity-5 rounded-lg"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`p-2 w-full flex ${isOpen ? "justify-start" : "justify-center"}`}>
          <div
            className="p-2 rounded-lg border border-[#21294F] border-opacity-20"
            style={{ backgroundColor: `rgba(33, 41, 79, 0.08)` }}
          >
            <Icon size={20} color="#21294F" strokeWidth={1.75} />
          </div>
          
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ml-4 text-white font-medium flex-grow"
            >
              {name}
            </motion.span>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default SidebarItem;