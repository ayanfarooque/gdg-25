import React, { useState, useEffect } from 'react';
import FacHeader from './Dashboardpages/facheader';
import CommunityCard from '../components/StudentCommunity/CommunityCard';
import TrendingPosts from '../components/StudentCommunity/TrendingPosts';
import RecommendedCommunities from '../components/StudentCommunity/RecommendedCommunities';
import CommunityCategories from '../components/StudentCommunity/CommunityCategories';
import WelcomeBanner from '../components/StudentCommunity/WelcomeBanner';
import { communities, posts, recommendedCommunities } from '../data/communityData';

const TeachersCommunityPage = () => {
  const [category, setCategory] = useState('All Communities');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('teacher');

  // Filter communities based on selected category
  const filteredCommunities = communities.filter(community => {
    if (category === 'All Communities') return true;
    
    // Check if the category is in the community categories array
    // For other predefined categories, match against subject or other fields
    const categoryLower = category.toLowerCase();
    return (
      community.subject?.toLowerCase().includes(categoryLower) ||
      community.categories?.some(cat => cat.toLowerCase().includes(categoryLower))
    );
  });

  // Filter teacher-specific communities if needed
  const teacherCommunities = filteredCommunities.filter(community => 
    community.allowedRoles?.includes('teacher') || !community.allowedRoles
  );

  return (
    <div className="min-h-screen mt-16 ml-30">
      <FacHeader />
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Banner - Pink theme for teachers */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-pink-500 to-pink-300 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome to Teachers Community</h1>
          <p className="text-lg opacity-90">Connect with other educators, share resources, and discuss teaching methods</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-pink-500">
              <CommunityCategories 
                onCategorySelect={setCategory} 
                onSearch={setSearchQuery} 
                themeColor="pink"
              />
            </div>
          </div>
          
          {/* Main Content - Communities Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-2xl text-pink-800">
              {category === 'All Communities' ? 'Teacher Communities' : category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {teacherCommunities.map((community) => (
                <CommunityCard 
                  key={community._id} 
                  community={community} 
                  themeColor="pink" 
                />
              ))}
            </div>
            
            {teacherCommunities.length === 0 && (
              <div className="text-center p-8 bg-white rounded-xl border border-pink-200">
                <h3 className="font-semibold text-lg text-pink-600">No communities found</h3>
                <p className="text-gray-500 mt-2">Try a different search or category</p>
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md border-t-4 border-pink-500 p-5">
              <TrendingPosts posts={posts} themeColor="pink" />
            </div>
            <div className="bg-white rounded-xl shadow-md border-t-4 border-pink-500 p-5">
              <RecommendedCommunities communities={recommendedCommunities} themeColor="pink" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersCommunityPage;
