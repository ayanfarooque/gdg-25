import React from 'react';
import { FaHeart, FaComment, FaRegClock } from 'react-icons/fa';
import { format } from 'date-fns';

const TrendingPosts = ({ posts }) => {
  // Function to format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd');
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md">
      <h2 className="font-bold text-xl mb-4 text-gray-800">Trending Posts</h2>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0">
                <img 
                  src={post.author.profilePicture} 
                  alt={post.author.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 line-clamp-2">{post.title}</h3>
                
                <div className="flex items-center mt-1 text-xs text-gray-600">
                  <span className="font-medium">{post.author.name}</span>
                  <span className="mx-1.5">•</span>
                  <div className="flex items-center">
                    <FaRegClock className="mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
                
                <div className="flex mt-2 items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center">
                    <FaHeart className="mr-1 text-red-500" />
                    {post.likes}
                  </div>
                  <div className="flex items-center">
                    <FaComment className="mr-1 text-blue-500" />
                    {post.comments?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-teal-500 font-medium text-sm">
        See All Trending Posts
      </button>
    </div>
  );
};

export default TrendingPosts;