import React from "react";
import Sidebar from '../components/Dashboardcomponents/Sidebar';
import TestScores from "../components/studentpage/TestScores";
import Header from "./Dashboardpages/Header";

const TestPage = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">

      <Header/>
      {/* Sidebar - Consistent with App.jsx */}
      <Sidebar role="student" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#ECE7CA]">
          {/* Page Header */}
          <div className="mb-8">
            
            <p className="text-gray-600">View your recent test scores and performance</p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid pl-52 grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Test Scores (2/3 width on large screens) */}
            <div className="lg:col-span-2 ">
              <TestScores />
            </div>

            {/* Additional Widgets Section (1/3 width on large screens) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Performance Summary Card */}
              <div className="bg-white p-6 text-black rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Average Score</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Highest Score</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Subjects Taken</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Tests Widget */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Tests</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Mathematics</h4>
                      <p className="text-sm text-gray-500">28/01/2025</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 text-purple-800 rounded-lg p-2 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">English</h4>
                      <p className="text-sm text-gray-500">30/01/2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TestPage;