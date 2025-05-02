import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Dashboardpages/Header';
import CommunityCard from '../components/StudentCommunity/CommunityCard';
import TrendingPosts from '../components/StudentCommunity/TrendingPosts';
import RecommendedCommunities from '../components/StudentCommunity/RecommendedCommunities';
import CommunityCategories from '../components/StudentCommunity/CommunityCategories';
import WelcomeBanner from '../components/StudentCommunity/WelcomeBanner';

const StudentCommunityPage = () => {
  const [category, setCategory] = useState('All Communities');
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch communities with category and search filters
        const communitiesResponse = await axios.get(
          `http://localhost:5000/api/communities/communities`
        );
        setCommunities(communitiesResponse.data.data);

        // Fetch trending posts
        // const postsResponse = await axios.get('http://localhost:5000/api/trending-posts');
        // setTrendingPosts(postsResponse.data.data);

        // Fetch recommended communities
        // const recommendedResponse = await axios.get('http://localhost:5000/api/recommended-communities');
        // setRecommended(recommendedResponse.data.data);

        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, searchQuery]);

  // Handle join community
  const handleJoinCommunity = async (communityId) => {
    try {
      await axios.post(`http://localhost:5000/api/communities/${communityId}/join`);
      // Refresh communities list
      const response = await axios.get(`http://localhost:5000/api/communities`);
      setCommunities(response.data.data);
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Failed to join community. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 ml-30">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <WelcomeBanner themeColor="teal" userRole="student" />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <CommunityCategories 
              onCategorySelect={setCategory} 
              onSearch={setSearchQuery} 
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-2xl text-gray-800">
              {category === 'All Communities' ? 'Communities For You' : category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {communities.map((community) => (
                <CommunityCard 
                  key={community._id} 
                  community={community}
                  onJoin={() => handleJoinCommunity(community._id)}
                />
              ))}
            </div>
            
            {communities.length === 0 && (
              <div className="text-center p-8 bg-white rounded-xl">
                <h3 className="font-semibold text-lg text-gray-600">No communities found</h3>
                <p className="text-gray-500 mt-2">Try a different search or category</p>
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* <TrendingPosts posts={trendingPosts} /> */}
            {/* <RecommendedCommunities communities={recommended} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCommunityPage;