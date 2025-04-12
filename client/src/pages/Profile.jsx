import React from 'react';

function Profile() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-300 relative transition-all duration-300 hover:shadow-3xl">
        
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden shadow-lg transition-transform transform hover:scale-110 duration-300">
            <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
          </div>

          {/* Email Tag */}
          <div className="mt-4 px-4 py-1 text-sm font-medium bg-red-600 text-white rounded-full shadow-md transition-all hover:bg-red-700">
            myfriend@gmail.com
          </div>
        </div>

        {/* Student Info */}
        <div className="mt-6 space-y-4 text-sm text-gray-800">
          {[
            { label: "Name", value: "Ali" },
            { label: "Student ID", value: "50" },
            { label: "Address", value: "402, Sprayday Canga, Bhanunogor" },
            { label: "DOB", value: "02-05-2005" },
            { label: "Guardian", value: "Usman Suleman" },
            { label: "Class", value: "9th" }
          ].map((item, index) => (
            <div key={index} className="flex justify-between border-b border-gray-300 pb-2">
              <span className="font-semibold text-gray-700">{item.label}:</span> 
              <span className="text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Badges Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Badges</h3>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="px-4 py-2 bg-gray-600 text-white rounded-full text-sm shadow-md transition-transform transform hover:scale-110 duration-300">🎯 15</span>
            <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 font-semibold rounded-full text-sm shadow-md transition-transform transform hover:scale-110 duration-300">🏆 Gold</span>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full text-sm shadow-md transition-transform transform hover:scale-110 duration-300">⭐ 10</span>
          </div>
        </div>

        {/* Download Button */}
        <button className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
          Download Result
        </button>
      </div>
    </div>
  );
}

export default Profile;
