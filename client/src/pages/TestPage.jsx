import React from "react";
import Sidebar from '../components/Dashboardcomponents/Sidebar';
import TestScores from "../components/studentpage/TestScores";
import Header from "./Dashboardpages/Header";

const TestPage = () => {
  return (
    <div className="flex min-h-screen max-w-[1400px] bg-gradient-to-br from-gray-50 to-gray-100 ml-30 mt-22 rounded-2xl shadow-lg overflow-hidden">
      <Header />
      {/* Sidebar - Consistent with App.jsx */}
      <Sidebar role="student" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          {/* Page Header */}
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Test Performance Dashboard</h1>
            <p className="text-gray-600 max-w-2xl">
              Track your academic progress, view recent test scores, and prepare for upcoming assessments.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Test Scores */}
            <div className="lg:col-span-8 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Average Score</p>
                    <h3 className="text-3xl font-bold mt-1">87%</h3>
                  </div>
                  <div className="mt-4 bg-blue-400/30 h-2 rounded-full w-full">
                    <div className="bg-white h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Highest Score</p>
                    <h3 className="text-3xl font-bold mt-1">100%</h3>
                  </div>
                  <div className="mt-4 bg-indigo-400/30 h-2 rounded-full w-full">
                    <div className="bg-white h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Subjects Taken</p>
                    <h3 className="text-3xl font-bold mt-1">3</h3>
                  </div>
                  <div className="mt-4 flex items-center space-x-1">
                    <span className="w-3 h-3 bg-white rounded-full block"></span>
                    <span className="w-3 h-3 bg-white rounded-full block"></span>
                    <span className="w-3 h-3 bg-white rounded-full block"></span>
                  </div>
                </div>
              </div>
              
              {/* Test Scores Component */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">Recent Test Scores</h2>
                  <p className="text-sm text-gray-500 mt-1">Detailed breakdown of your academic performance</p>
                </div>
                <TestScores />
              </div>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-4 space-y-6">
              {/* Performance Summary Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Performance Summary</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Last 30 days</span>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Average Score</span>
                      <span className="font-semibold text-blue-600">87%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Highest Score</span>
                      <span className="font-semibold text-green-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">Completion Rate</span>
                      <span className="font-semibold text-indigo-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Tests Widget */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Upcoming Tests</h3>
                  <button className="text-blue-500 hover:text-blue-700 text-sm font-medium">View All</button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-3 mr-4 self-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold text-gray-800">Mathematics</h4>
                        <span className="ml-2 px-2 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-md">Important</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">January 28, 2025</p>
                      <p className="text-xs text-gray-500 mt-1">Room A104 • 10:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex p-3 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="bg-purple-100 text-purple-600 rounded-lg p-3 mr-4 self-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold text-gray-800">English</h4>
                        <span className="ml-2 px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded-md">Essay</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">January 30, 2025</p>
                      <p className="text-xs text-gray-500 mt-1">Room B201 • 2:15 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="bg-amber-100 text-amber-600 rounded-lg p-3 mr-4 self-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold text-gray-800">Science</h4>
                        <span className="ml-2 px-2 py-0.5 bg-amber-200 text-amber-800 text-xs rounded-md">Lab</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">February 2, 2025</p>
                      <p className="text-xs text-gray-500 mt-1">Lab C130 • 9:30 AM</p>
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