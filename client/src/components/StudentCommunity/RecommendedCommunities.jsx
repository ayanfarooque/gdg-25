import React from 'react';

const RecommendedCommunities = ({ communities }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md">
      <h2 className="font-bold text-xl mb-4 text-gray-800">Recommended Communities</h2>
      
      <div className="space-y-3">
        {communities.map((community) => (
          <div key={community._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="h-12 w-12">
              <img 
                src={community.avatar} 
                alt={community.name}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 truncate">{community.name}</h3>
              <p className="text-xs text-gray-600 truncate">{community.shortDescription}</p>
              <p className="text-xs text-gray-500">
                {community.memberCount || community.stats?.memberCount} members • {community.subject}
              </p>
            </div>
            
            <button className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-medium rounded transition-colors">
              Join
            </button>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-teal-500 font-medium text-sm">
        View More Recommendations
      </button>
    </div>
  );
};

export default RecommendedCommunities;