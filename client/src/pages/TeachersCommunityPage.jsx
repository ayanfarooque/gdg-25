import React from 'react';
import Sidebar from '../components/TeacherHome/Sidebar';
import Solution from '../components/TeachersComunity/Solution';
import Navigation from '../components/TeachersComunity/Navigation';
import Tccomp from '../components/TeachersComunity/Tccomp';

const TeachersCommunityPage = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div className="flex flex-1 p-6 gap-6">
        

        {/* Main Community Section */}
        <div className="flex-1">
          <Tccomp />
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col w-[30%] gap-6">
          <div className="bg-gray-300 p-4 rounded-xl shadow-md border border-gray-200">
            <Solution />
          </div>
          <div className="bg-gray-400 p-4 rounded-xl shadow-md border border-gray-200">
            <Navigation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersCommunityPage;
