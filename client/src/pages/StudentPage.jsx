import React from 'react';
import Sidebar from '../components/studentpage/Sidebar';
import CalendarComponent from '../components/studentpage/calendar';
import Analytics from '../components/studentpage/Analytics';
import TestScores from '../components/studentpage/TestScores';
import PendingAssignments from '../components/studentpage/PendingAssignment';
import Header from '../pages/Dashboardpages/Header';
import ProfileCard from '../components/studentpage/ProfileCard';
import GrowthRate from '../components/Dashboardcomponents/overview/GrowthRate';
import { useNavigate } from 'react-router-dom';

function StudentPage() {
  const navigate = useNavigate();
  
  return (
    <div>
      <Header />
      <div className="min-h-screen text-black font-sans flex mt-10 pt-8">
        
        
        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-6 p-6 w-full max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-[#F5F5DD] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, Student</h1>
                <p className="text-gray-600 mt-1">Track your academic progress and upcoming tasks</p>
              </div>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F5F5DD] rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm text-gray-500 font-medium mb-2">Assignments Due</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">4</span>
                <span className="text-xs text-orange-500 font-medium">This Week</span>
              </div>
            </div>
            <div className="bg-[#F5F5DD] rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm text-gray-500 font-medium mb-2">Average Score</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">87%</span>
                <span className="text-xs text-green-500 font-medium">+3% from last month</span>
              </div>
            </div>
            <div className="bg-[#F5F5DD] rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm text-gray-500 font-medium mb-2">Course Progress</h3>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">68%</span>
                <span className="text-xs text-blue-500 font-medium">On Track</span>
              </div>
            </div>
          </div>
          
          {/* Center Content */}
          <main className="flex-1 space-y-6">
            {/* Calendar and Assignments */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#F5F5DD] rounded-xl p-6 shadow-sm transition-transform transform hover:scale-[1.02]">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Schedule</h2>
                <CalendarComponent />
              </div>
              
              <div className="bg-[#F5F5DD] rounded-xl p-6 shadow-sm transition-transform transform hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Pending Assignments</h2>
                  <button className="text-sm text-blue-600 hover:underline">View All</button>
                </div>
                <PendingAssignments />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-[#F5F5DD] rounded-xl p-6 shadow-sm transition-transform transform hover:scale-[1.02]">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Performance Growth</h2>
                <GrowthRate bgColor="white"/>
              </div>
              
              <div onClick={() => navigate('/test')} className="bg-[#F5F5DD] rounded-xl p-6 shadow-sm cursor-pointer transition-transform transform hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Test Scores</h2>
                  <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">View Details</span>
                </div>
                <TestScores />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentPage;