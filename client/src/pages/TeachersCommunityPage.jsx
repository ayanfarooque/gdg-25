import React from 'react';
import Sidebar from '../components/TeacherHome/Sidebar';
import Solution from '../components/TeachersComunity/Solution';
import Navigation from '../components/TeachersComunity/Navigation';
import Tccomp from '../components/TeachersComunity/Tccomp';
import FacHeader from './Dashboardpages/facheader';

const TeachersCommunityPage = () => {
  return (
    <div className="flex h-screen bg-[#ECE7CA]">
      <FacHeader />
      <div className="flex flex-1 p-6 gap-6">
        

        {/* Main Community Section */}
        <div className="flex-1 ml-30 pt-8 mt-10">
          <Tccomp  
            welcomeText = "Welcome to the Teachers Community, Mr Pawar"
            buttonColor = "#E195AB"
          />
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col w-[30%] gap-6 pt-8 mt-10">
          <div className="bg-[#F5F5DD] p-4 rounded-xl shadow-md border border-gray-200">
            <Solution />
          </div>
          <div className="bg-[#F5F5DD] p-4 rounded-xl shadow-md border border-gray-200">
            <Navigation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersCommunityPage;
