import React from 'react';
import FacHeader from './Dashboardpages/facheader';

const TeacherAssignment = () => {
  // Sample data matching the screenshot
  const currentAssignment = {
    code: "RS2002N",
    subject: "HINDI",
    date: "17 FEBRUARY 25'"
  };

  const submissions = [
    { id: "SC001", name: "Hashim Ansari", status: "Pending", score: "", file: "" },
    { id: "SC001", name: "Ryan Farooque", status: "Pending", score: "", file: "" },
    { id: "SC001", name: "Vedant Karade", status: "Pending", score: "", file: "" },
    { id: "SC001", name: "Ronit Dhose", status: "Pending", score: "", file: "" },
    { id: "SC001", name: "Himanshu Mishra", status: "Pending", score: "", file: "" },
    { id: "SC001", name: "Soiesh Sharma", date: "10/02/2025", score: "10/10", file: "View File" },
    { id: "SC001", name: "Sulabh Ambulé", date: "11/02/2025", score: "09/10", file: "View File" },
    { id: "SC001", name: "Siva Dadpe", date: "11/02/2025", score: "02/10", file: "View File" },
    { id: "SC001", name: "Rkshay Ambulge", date: "11/02/2025", score: "10/10", file: "View File" },
    { id: "SC001", name: "Suyosh Munje", date: "13/02/2025", score: "07/10", file: "View File" }
  ];

  const activeAssignments = [
    { date: "17 Feb", subject: "HIN", code: "RS2002" },
    { date: "19 Feb", subject: "SCI", code: "RS3001" }
  ];

  const previousAssignments = [
    { date: "11 Feb", subject: "HIN", code: "RS2001" },
    { date: "9 Feb", subject: "SCI", code: "RS3000" },
    { date: "1 Feb", subject: "SRT", code: "RS4001" },
    { date: "21 JBN", subject: "SCI", code: "RS3003" }
  ];

  return (
    <div className="flex h-screen bg-[#ECE7CA] text-black overflow-hidden">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <FacHeader />

        <div className="flex-1 overflow-auto p-6">
          {/* Main Content Grid */}
          <div className="grid pt-20 pl-32 grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Assignment Details */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              {/* Current Assignment Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#21294F]">E-LEARNING Faculty Portal</h1>
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">{currentAssignment.code}</h2>
                    <p className="text-lg">{currentAssignment.subject}</p>
                    <p className="text-gray-600">{currentAssignment.date}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search......"
                      className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-xs"
                    />
                    <span className="absolute left-3 top-2.5">🔍</span>
                  </div>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold">Date Submitted</th>
                      <th className="text-left py-3 px-2 font-semibold">Std.ID.</th>
                      <th className="text-left py-3 px-2 font-semibold">Std. Name</th>
                      <th className="text-left py-3 px-2 font-semibold">Status</th>
                      <th className="text-left py-3 px-2 font-semibold">Score</th>
                      <th className="text-left py-3 px-2 font-semibold">File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">{submission.date || "-"}</td>
                        <td className="py-3 px-2">{submission.id}</td>
                        <td className="py-3 px-2 font-medium">{submission.name}</td>
                        <td className="py-3 px-2">
                          {submission.status || (
                            <span className="text-green-600">Submitted</span>
                          )}
                        </td>
                        <td className="py-3 px-2">{submission.score || "-"}</td>
                        <td className="py-3 px-2 text-blue-600 hover:underline cursor-pointer">
                          {submission.file || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Assignment Actions */}
              <div className="mt-6 flex justify-between items-center border-t pt-4">
                <div className="text-sm">
                  <p>Total: {submissions.length}</p>
                  <p>Submitted: {submissions.filter(s => s.date).length}</p>
                  <p>Pending: {submissions.filter(s => !s.date).length}</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                    Send Warning
                  </button>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Extend Date
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Close Assignment
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Assignment Lists */}
            <div className="space-y-6">
  {/* Active Assignments */}
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="bg-gradient-to-r from-[#E195AB] to-[#49ABB0] p-4">
      <h2 className="text-xl font-bold text-white">ACTIVE ASSIGNMENTS</h2>
    </div>
    <div className="divide-y divide-gray-100">
      {activeAssignments.map((assignment, index) => (
        <div 
          key={index} 
          className="flex items-center text-black justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center">
            <div className="bg-[#E195AB] bg-opacity-20 p-2 rounded-lg mr-3">
              <svg 
                className="w-5 h-5 text-[#E195AB]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-[#21294F]">
                {assignment.subject} <span className="text-sm text-gray-500 ml-2">{assignment.code}</span>
              </p>
              <div className="flex items-center mt-1">
                <svg 
                  className="w-4 h-4 text-gray-400 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">{assignment.date}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#49ABB0] text-white bg-opacity-10 px-3 py-1 rounded-full text-sm  font-medium">
            Active
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Previous Assignments */}
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="bg-gradient-to-r from-[#21294F] to-[#49ABB0] p-4">
      <h2 className="text-xl font-bold text-white">PREVIOUS ASSIGNMENTS</h2>
    </div>
    <div className="divide-y divide-gray-100">
      {previousAssignments.map((assignment, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center">
            <div className="bg-[#21294F] bg-opacity-20 p-2 rounded-lg mr-3">
              <svg 
                className="w-5 h-5 text-[#21294F]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 group-hover:text-[#21294F]">
                {assignment.subject} <span className="text-sm text-gray-500 ml-2">{assignment.code}</span>
              </p>
              <div className="flex items-center mt-1">
                <svg 
                  className="w-4 h-4 text-gray-400 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">{assignment.date}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-500 font-medium">
            Completed
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TeacherAssignment;