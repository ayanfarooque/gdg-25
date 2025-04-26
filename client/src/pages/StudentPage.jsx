import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiCalendar, FiBook, FiFileText, 
  FiTrendingUp, FiSettings, FiBell, FiSearch,
  FiChevronRight, FiChevronsRight, FiCheckCircle
} from 'react-icons/fi';
import Header from '../pages/Dashboardpages/Header';
import CalendarComponent from '../components/studentpage/calendar';
import TestScores from '../components/studentpage/TestScores';
import PendingAssignments from '../components/studentpage/PendingAssignment';
import GrowthRate from '../components/Dashboardcomponents/overview/GrowthRate';
import SubjectPerformance from '../components/studentpage/SubjectPerformance';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function StudentPage() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('Alexander');
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Set appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen text-gray-800 font-sans">
      <Header />
      
      <div className="flex min-h-screen pt-16">
        {/* Elegant Sidebar */}
        

        {/* Main Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`flex-1 p-6 ml-30 transition-all duration-300 ease-in-out`}
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <motion.h1 
                variants={itemVariants}
                className="text-3xl font-bold tracking-tight text-gray-800"
              >
                {greeting}, {studentName}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-gray-500 mt-1">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </motion.p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <QuickStatCard 
              title="Assignments Due" 
              value="4" 
              change="+1" 
              changeType="negative" 
              timeframe="This Week" 
              icon={<FiFileText className="text-orange-500" size={20} />}
              color="bg-orange-50 border-orange-100"
            />
            <QuickStatCard 
              title="Average Score" 
              value="87%" 
              change="+3%" 
              changeType="positive" 
              timeframe="from last month" 
              icon={<FiTrendingUp className="text-green-500" size={20} />}
              color="bg-green-50 border-green-100"
            />
            <QuickStatCard 
              title="Course Progress" 
              value="68%" 
              change="On Track" 
              timeframe="8 weeks remaining" 
              icon={<FiBook className="text-blue-500" size={20} />}
              color="bg-blue-50 border-blue-100"
            />
            <QuickStatCard 
              title="Upcoming Tests" 
              value="2" 
              changeType="neutral" 
              timeframe="Next 7 days" 
              icon={<FiCalendar className="text-purple-500" size={20} />}
              color="bg-purple-50 border-purple-100"
            />
          </motion.div>

          {/* First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Calendar Column */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-semibold text-lg text-gray-800">Schedule</h2>
                  <p className="text-sm text-gray-500">Your upcoming classes and events</p>
                </div>
                <div className="p-4">
                  <CalendarComponent />
                  
                  {/* Today's Schedule */}
                  <div className="mt-4 p-4 border-t border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-3">Today's Classes</h3>
                    <div className="space-y-3">
                      <ScheduleItem 
                        time="09:00 AM" 
                        title="Mathematics" 
                        subtitle="Advanced Calculus" 
                        status="completed" 
                      />
                      <ScheduleItem 
                        time="11:30 AM" 
                        title="Computer Science" 
                        subtitle="Data Structures" 
                        status="ongoing"
                        highlight={true}
                      />
                      <ScheduleItem 
                        time="02:00 PM" 
                        title="Physics Lab" 
                        subtitle="Room 302B" 
                        status="upcoming" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Performance Growth Column */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-semibold text-lg text-gray-800">Performance Growth</h2>
                  <p className="text-sm text-gray-500">Your academic progress over time</p>
                </div>
                <div className="p-4">
                  <GrowthRate bgColor="white" />
                </div>
                <div className="p-4">
                <SubjectPerformance />
              </div>
              </div>
            </motion.div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Pending Assignments */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 h-full">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">Pending Assignments</h2>
                    <p className="text-sm text-gray-500">Tasks that need your attention</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
                </div>
                <div className="p-4">
                  <EnhancedPendingAssignments />
                </div>
              </div>
            </motion.div>
            
            {/* Test Scores */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">Recent Test Scores</h2>
                    <p className="text-sm text-gray-500">Your performance in recent assessments</p>
                  </div>
                  <button 
                    onClick={() => navigate('/test')} 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="p-4">
                  <TestScores />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Learning Resources Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-lg text-gray-800">Learning Resources</h2>
                <p className="text-sm text-gray-500">Recommended materials to boost your learning</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <LearningResourceCard 
                    title="Introduction to Calculus"
                    type="Video Course"
                    completionPercent={35}
                    imageUrl="https://images.unsplash.com/photo-1633613286991-611fe299c4be"
                  />
                  <LearningResourceCard 
                    title="Python Programming Essentials"
                    type="Interactive Tutorial"
                    completionPercent={78}
                    imageUrl="https://images.unsplash.com/photo-1526379879527-8559ecfcaec0"
                  />
                  <LearningResourceCard 
                    title="Physics: Forces & Motion"
                    type="E-Book"
                    completionPercent={12}
                    imageUrl="https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Quick Stat Card Component
const QuickStatCard = ({ title, value, change, changeType, timeframe, icon, color }) => {
  return (
    <div className={`${color} border p-5 rounded-xl transition-transform hover:scale-[1.02] group`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <div className="flex items-center mt-1">
            {changeType !== "neutral" && (
              <span className={`text-xs font-medium ${
                changeType === "positive" ? "text-green-600" : 
                changeType === "negative" ? "text-red-600" : "text-gray-500"
              }`}>
                {change}
              </span>
            )}
            <span className="text-xs text-gray-500 ml-1">{timeframe}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Schedule Item Component
const ScheduleItem = ({ time, title, subtitle, status, highlight }) => {
  return (
    <div className={`flex items-center p-2 rounded-lg ${highlight ? "bg-blue-50 border border-blue-100" : ""}`}>
      <div className="mr-4 text-right">
        <p className={`text-sm font-medium ${highlight ? "text-blue-600" : "text-gray-700"}`}>{time}</p>
        <div className={`h-2 w-2 rounded-full mt-1 ml-auto ${
          status === "completed" ? "bg-green-500" :
          status === "ongoing" ? "bg-blue-500 animate-pulse" : "bg-gray-300"
        }`}></div>
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${highlight ? "text-blue-700" : "text-gray-800"}`}>{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      {status === "completed" && (
        <FiCheckCircle size={16} className="text-green-500 ml-2" />
      )}
    </div>
  );
};

// Enhanced Pending Assignments Component
const EnhancedPendingAssignments = () => {
  const assignments = [
    { 
      subject: "Data Structures",
      title: "Binary Tree Implementation",
      dueDate: "May 5, 2025",
      progress: 25,
      priority: "high"
    },
    { 
      subject: "Operating System",
      title: "Process Scheduling Algorithms",
      dueDate: "May 8, 2025",
      progress: 60,
      priority: "medium"
    },
    { 
      subject: "Advanced Mathematics",
      title: "Differential Equations Problem Set",
      dueDate: "May 10, 2025",
      progress: 15,
      priority: "high"
    },
    { 
      subject: "Computer Networks",
      title: "Network Security Analysis",
      dueDate: "May 15, 2025",
      progress: 0,
      priority: "low"
    }
  ];

  return (
    <div className="space-y-4">
      {assignments.map((assignment, index) => (
        <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  assignment.priority === "high" ? "bg-red-500" :
                  assignment.priority === "medium" ? "bg-orange-500" : "bg-blue-500"
                }`}></span>
                <h3 className="font-medium text-gray-800">{assignment.subject}</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">{assignment.title}</p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-gray-500">Due: {assignment.dueDate}</span>
                <span className="mx-2 text-gray-300">•</span>
                <div className="flex items-center">
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                    <div 
                      className={`h-1.5 rounded-full ${
                        assignment.progress < 30 ? 'bg-red-500' :
                        assignment.progress < 70 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${assignment.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{assignment.progress}%</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-blue-600 hover:text-blue-800">
              <FiChevronRight />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Learning Resource Card Component
const LearningResourceCard = ({ title, type, completionPercent, imageUrl }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md group">
      <div className="h-32 overflow-hidden relative">
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173"} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-800">{type}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-1">{title}</h3>
        <div className="flex items-center">
          <div className="w-full h-1.5 bg-gray-200 rounded-full">
            <div 
              className="h-1.5 rounded-full bg-blue-500"
              style={{ width: `${completionPercent}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs text-gray-600">{completionPercent}%</span>
        </div>
        <button className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium text-center">
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default StudentPage;