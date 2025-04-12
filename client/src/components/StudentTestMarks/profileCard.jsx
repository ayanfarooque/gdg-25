import profilePic from "../../assets/profile-avatar.png"
import React from "react";
const ProfileCard = () => {
  return (
    <div className="bg-gray-800 w-80 h-150 p-4 rounded-lg text-white shadow-lg">
      <div className="flex items-center justify-center">
        <img src={profilePic} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white" />
      </div>
      <p className="text-center mt-2 text-sm bg-red-500 px-2 py-1 rounded-full inline-block">Performance: 93%</p>
      <div className="mt-4">
        <p><strong>Name:</strong> Sham Singh</p>
        <p><strong>Student ID:</strong> 621008</p>
        <p><strong>Address:</strong> 402, Rocky Garden, Bhavnagar</p>
        <p><strong>Guardian:</strong> Vikram Singh</p>
        <p><strong>Class:</strong> 12th</p>
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        <span className="bg-yellow-400 px-2 py-1 rounded-lg">🏅</span>
        <span className="bg-gray-300 px-2 py-1 rounded-lg">🥈</span>
        <span className="bg-green-400 px-2 py-1 rounded-lg">🥉</span>
      </div>
    </div>
  );
};

export default ProfileCard;
