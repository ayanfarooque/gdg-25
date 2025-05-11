import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  CalendarDays,
  MessageCircle,
  Users,
  Settings,
  Menu,
  Newspaper,
  ChevronLeft,
  FilePlus,
  School,
  FileText,
  FileBarChart,
  LayoutDashboard,
  Bookmark,
  User as UserIcon,
  UserCog,
  Bot,
} from "lucide-react";
import { Link } from "react-router-dom";

const SidebarItem = ({ name, icon: Icon, path, isOpen, isActive, selectedBorderColor }) => {
  return (
    <Link to={path} className="w-full">
      <motion.div
        className={`flex items-center transition-all duration-300 ${
          isActive 
            ? `border-2 border-[${selectedBorderColor}] rounded-lg  ` 
            : " rounded-lg"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`p-2 w-full flex ${isOpen ? "justify-start" : "justify-center"}`}>
          <div className="p-2 rounded-lg flex items-center justify-center">
            <Icon size={20} color="#FFFFFF" strokeWidth={1.75} />
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

const Sidebar = ({ role }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [sidebarItems, setSidebarItems] = useState([]);

  useEffect(() => {
    if (role === "teacher") {
      setSidebarItems([
        { name: "Home", icon: Home, path: "/teacher-home" },
        { name: "Community", icon: Users, path: "/teachers-Community" },
        { name: "Assignment", icon: BookOpen, path: "/teacher-Assignment" },
        { name: "Newspaper", icon: CalendarDays, path: "/teacher-resource" },
        { name: "ChatBot", icon: MessageCircle, path: "/facchat" },
        { name: "Classroom", icon: School, path: "/teacher-classroom" },
        { name: "AI Assistant", icon: Bot, path: "/ai-assistant" },
      ]);
    } else if (role === 'student') {
      setSidebarItems([
        { name: "Home", icon: Home, path: "/student-home" },
        { name: "Assignment", icon: BookOpen, path: "/Assignment" },
        { name: "News", icon: Newspaper, path: "/Resources" },
        { name: "ChatBot", icon: MessageCircle, path: "/chat-page" },
        { name: "Community", icon: Users, path: "/Community" },
        { name: "Classroom", icon: School, path: "/student-classroom" }
      ]);
    } else {
      setSidebarItems([
        { name: "Admin Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
        { name: "Classrooms", icon: School, path: "/admin-classrooms" },
        { name: "Students", icon: UserIcon, path: "/admin-students" },
        { name: "Teachers", icon: UserCog, path: "/admin-teachers" },
        { name: "Settings", icon: Settings, path: "/admin-settings" }
      ]);
    }
  }, [role]);

  const getBackgroundColor = () => {
    return role === "teacher" ? "bg-[#E195AB]" : 
           role === "student" ? "bg-gradient-to-r from-teal-500 to-teal-400" : 
           "bg-[#21294F]";
  };

  return (
    <div className="fixed left-6 top-[92px] z-20">
      <motion.div
        className="rounded-2xl overflow-hidden shadow-lg"
        initial={{ width: 80 }}
        animate={{ 
          width: isSidebarOpen ? 300 : 80,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
      >
        <div className={`min-h-[calc(100vh-100px)] ${getBackgroundColor()} bg-opacity-80 backdrop-blur-md p-4 flex flex-col border border-gray-700`}>
          <div className="flex justify-between items-center mb-6">
            {isSidebarOpen && <span className="text-white font-semibold ml-2 text-lg">Menu</span>}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              {isSidebarOpen ? (
                <ChevronLeft size={20} color="#fff" />
              ) : (
                <Menu size={20} color="#fff" />
              )}
            </motion.button>
          </div>
          
          <nav className="flex-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="space-y-2">
              {sidebarItems.map((item, index) => (
                <SidebarItem 
                  key={index} 
                  {...item} 
                  isOpen={isSidebarOpen} 
                  isActive={location.pathname === item.path} 
                  selectedBorderColor="#ECE7CA"
                />
              ))}
            </div>
          </nav>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;