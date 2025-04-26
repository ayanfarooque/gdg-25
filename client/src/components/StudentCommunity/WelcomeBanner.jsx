import React from 'react';
import { FaPlus } from 'react-icons/fa';

const WelcomeBanner = ({ username = "Ronit" }) => {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-center">
      <div>
        <h1 className="font-bold text-2xl mb-2">Welcome to Student Community, {username}!</h1>
        <p className="text-teal-50">Connect with peers, join subject communities, and collaborate on academic challenges.</p>
      </div>
      
      <div className="mt-4 md:mt-0">
        <button className="bg-white text-teal-600 hover:bg-teal-50 px-5 py-2.5 rounded-lg font-semibold flex items-center shadow-sm transition-colors">
          <FaPlus className="mr-2" /> Create Post
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;