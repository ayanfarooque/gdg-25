import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart2,
  Home,
  BookOpen,
  CalendarDays,
  MessageCircle,
  Users,
  Settings,
  Menu,
  Newspaper,
  Bell,
  FilePlus 
} from "lucide-react";
import SidebarItem from "./SidebarItem";

const Sidebar = ({ role }) => {
  const [issidebaropen, setsidebaropen] = useState(true);
  const location = useLocation();

  const STUDENT_ITEMS = [
    { name: "Overview", icon: BarChart2, color: "#6366f1", path: "/Stu-Dash" },
    { name: "Home", icon: Home, color: "#6366f1", path: "/student-home" },
    { name: "Assignment", icon: BookOpen, color: "#8B5CF6", path: "/Assignment" },
    { name: "News", icon: Newspaper, color: "#EC4899", path: "/Resources" },
    { name: "ChatBot", icon: MessageCircle, color: "#10B981", path: "/chat-page" },
    { name: "Settings", icon: Settings, color: "#6EE7B7", path: "/settings" },
    { name: "Notifications", icon: Bell, color: "#8B5CF6", path: "/notification"},
    
  ];

  const TEACHER_ITEMS = [
    { name: "Home", icon: Home, color: "#F59E0B", path: "/teacher-home" }, 
    { name: "Community", icon: Users, color: "#D946EF", path: "/teachers-Community" }, 
    { name: "Assignment", icon: BookOpen, color: "#14B8A6", path: "/teacher-Assignment" }, 
    { name: "Newspaper", icon: CalendarDays, color: "#F43F5E", path: "/Resources" }, 
    { name: "CreateAssignment", icon: FilePlus, color: "#F59E0B", path: "/createassignment" }
  ];

  const SIDEBAR_ITEMS = role === "teacher" ? TEACHER_ITEMS : STUDENT_ITEMS;

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        issidebaropen ? "w-64" : "w-20"
      }`}
      animate={{ width: issidebaropen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setsidebaropen(!issidebaropen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item, index) => (
            <SidebarItem key={index} {...item} isOpen={issidebaropen} isActive={location.pathname === item.path} />
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
