import React, { useState } from 'react';
import Header from './Dashboardpages/Header';
import CommunityCard from '../components/StudentCommunity/CommunityCard';
import TrendingPosts from '../components/StudentCommunity/TrendingPosts';
import RecommendedCommunities from '../components/StudentCommunity/RecommendedCommunities';
import CommunityCategories from '../components/StudentCommunity/CommunityCategories';
import WelcomeBanner from '../components/StudentCommunity/WelcomeBanner';
import { communities, posts, recommendedCommunities } from '../data/communityData';

const StudentCommunityPage = () => {
  const [category, setCategory] = useState('All Communities');
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="min-h-screen mt-16 ml-30">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <WelcomeBanner />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <CommunityCategories 
              onCategorySelect={setCategory} 
              onSearch={setSearchQuery} 
            />
          </div>
          
          {/* Main Content - Communities Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-2xl text-gray-800">
              {category === 'All Communities' ? 'Communities For You' : category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community._id} community={community} />
              ))}
            </div>
            
            {filteredCommunities.length === 0 && (
              <div className="text-center p-8 bg-white rounded-xl">
                <h3 className="font-semibold text-lg text-gray-600">No communities found</h3>
                <p className="text-gray-500 mt-2">Try a different search or category</p>
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <TrendingPosts posts={posts} />
            <RecommendedCommunities communities={recommendedCommunities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCommunityPage;
