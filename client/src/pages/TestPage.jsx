import React from "react";
import Sidebar from '../components/StudentTestMarks/Sidebar'
import TestScores from "../components/studentpage/TestScores";
import ProfileCard from "../components/StudentTestMarks/profileCard";

const TestPage = () => {
  return (
    <div className="flex h-screen w-full text-black bg-gray-100">

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Test Scores */}
          <section className="col-span-2">
            <TestScores />
          </section>

          {/* Profile Section */}
          <aside>
            <ProfileCard />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
