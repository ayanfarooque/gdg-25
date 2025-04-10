import React from 'react';
import Sidebar from '../components/TeacherHome/Sidebar';
import TeacherProfile from '../components/TeacherHome/TeacherProfile';
import Analytics from '../components/TeacherHome/Analytics';
import ClassPerformance from '../components/TeacherHome/ClassPerformance';

const TeacherHomePage = () => {
  return (
    <div className=" h-full w-full bg-gray-300 font-sans flex">
      {/* Sidebar */}
      <Sidebar className="w-20 bg-[#d39faa] p-4 flex flex-col items-center" />

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-6 w-full max-w-7xl mx-auto">
        
        {/* Center Content */}
        <main className="flex-1 space-y-6">
          {/* Analytics Section */}
          <div className="w-full transition-transform transform hover:scale-105 gap-6">
              <Analytics />
          </div>

          {/* Class Performance Section */}
          <div className="bg-[#f8f3e7] h-100 rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">CLASS PERFORMANCE</h2>
              <select className="p-2 bg-white border rounded-md">
                <option>Select Class</option>
              </select>
            </div>
            <ClassPerformance />
          </div>
        </main>

        {/* Profile Card */}
        <div className="hidden h-full lg:block w-72 p-4 ] rounded-xl ">
          <TeacherProfile />
        </div>
      </div>
    </div>
  );
};

export default TeacherHomePage;
