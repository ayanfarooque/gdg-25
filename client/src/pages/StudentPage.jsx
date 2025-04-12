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
  const navigate = useNavigate()
  return (
    <div>
      <Header/>
    <div className="min-h-screen text-black  font-sans flex mt-10 pt-8">
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-6 w-full max-w-7xl mx-auto">
        
        {/* Center Content */}
        <main className="flex-1 space-y-6">
          <div className="grid md:grid-cols-2 cursor-pointer gap-6">
              <CalendarComponent />
              <PendingAssignments />
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#F5F5DD] rounded-xl p-6 cursor-pointer  transition-transform transform hover:scale-105">
              <GrowthRate bgColor="white"/>
            </div>
            <div onClick={() => navigate('/test')} className="bg-[#F5F5DD] rounded-xl p-6 cursor-pointer  transition-transform transform hover:scale-105">
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

