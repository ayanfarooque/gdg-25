import React from 'react';
import { FaUsers, FaCheckCircle, FaChartLine, FaComments } from 'react-icons/fa';

const CommunityCard = ({ community }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Banner Image */}
      <div 
        className="h-32 w-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${community.banner || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&auto=format&fit=crop'})` 
        }}
      />
      
      {/* Community Info */}
      <div className="p-5">
        <div className="flex items-center mb-3">
          {/* Avatar */}
          <div className="h-14 w-14 rounded-full mr-4 overflow-hidden border-2 border-white -mt-10 shadow-md">
            <img 
              src={community.avatar} 
              alt={community.name}
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Name & Verification */}
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-lg text-gray-800">{community.name}</h3>
              {community.isVerified && (
                <FaCheckCircle className="ml-1 text-teal-500 text-sm" />
              )}
            </div>
            <p className="text-sm text-gray-600">
              {community.subject} • Grade {community.grade}
            </p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {community.shortDescription || community.description.substring(0, 100) + '...'}
        </p>
        
        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-600 border-t pt-3">
          <div className="flex items-center">
            <FaUsers className="mr-1" />
            <span>{community.stats?.memberCount || community.memberCount} members</span>
          </div>
          <div className="flex items-center">
            <FaComments className="mr-1" />
            <span>{community.stats?.postCount || 0} posts</span>
          </div>
          <div className="flex items-center">
            <FaChartLine className="mr-1" />
            <span>{community.stats?.dailyActiveUsers || 0} active</span>
          </div>
        </div>
      </div>
      
      {/* Join Button */}
      <div className="px-5 pb-4">
        <button className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-200">
          Join Community
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;