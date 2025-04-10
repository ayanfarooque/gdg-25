import React from 'react';
import Sidebar from '../components/studentpage/Sidebar';
import CalendarComponent from '../components/studentpage/calendar';
import Analytics from '../components/studentpage/Analytics';
import TestScores from '../components/studentpage/TestScores';
import PendingAssignments from '../components/studentpage/PendingAssignment';
import ProfileCard from '../components/studentpage/ProfileCard';
import GrowthRate from '../components/Dashboardcomponents/overview/GrowthRate';
import { useNavigate } from 'react-router-dom';
function StudentPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen text-black bg-[#f4f1ea] font-sans flex">

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-6 w-full max-w-7xl mx-auto">
        
        {/* Center Content */}
        <main className="flex-1 space-y-6">
          <div className="grid md:grid-cols-2 cursor-pointer gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md transition-transform transform hover:scale-105">
              <h2 className="text-xl font-semibold mb-4">Calendar</h2>
              <CalendarComponent />
            </div>
            <div className="bg-white rounded-xl cursor-pointer p-6 shadow-md transition-transform transform hover:scale-105">
              <PendingAssignments />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 cursor-pointer  transition-transform transform hover:scale-105">
              <GrowthRate bgColor="white"/>
            </div>
            <div onClick={() => navigate('/test')} className="bg-white rounded-xl p-6 cursor-pointer  transition-transform transform hover:scale-105">
              <TestScores />
            </div>
          </div>
        </main>

        {/* Profile Card */}
        <div className="hidden h-96 cursor-pointer lg:block w-72 transition-transform transform hover:scale-105">
          <ProfileCard />
          
        </div>
      </div>
    </div>
  );
}

export default StudentPage;

