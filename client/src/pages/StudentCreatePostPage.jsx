import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Dashboardpages/Header';
import { FaImage, FaVideo, FaLink, FaPoll, FaChevronLeft } from 'react-icons/fa';

const StudentCreatePostPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [attachmentType, setAttachmentType] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch communities when component mounts
  // useEffect(() => {
  //   const fetchCommunities = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/api/post/communities');
  //       setCommunities(response.data.data);
  //     } catch (error) {
  //       console.error('Error fetching communities:', error);
  //       setError('Failed to load communities');
  //     }
  //   };

  //   fetchCommunities();
  // }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/post/posts', {
        title,
        content,
        communityId: selectedCommunity,
        attachmentType,
        attachmentUrl
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Post created:', response.data);
      // navigate(`/community/${selectedCommunity}`);
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle going back
  const handleGoBack = () => {
    navigate('/Community');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 ml-30">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Top Navigation */}
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            <FaChevronLeft className="mr-2" /> Back to Community
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h1 className="text-2xl font-bold mb-6 text-gray-800">Create a New Post</h1>
              
              <form onSubmit={handleSubmit}>
                {/* Community Selection */}
                <div className="mb-6">
                  {/* <label className="block text-gray-700 font-medium mb-2" htmlFor="community">
                    Select Community
                  </label>
                  <select
                    id="community"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700"
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    required
                  >
                    <option value="">Select a Community</option>
                    {communities.map(community => (
                      <option key={community._id} value={community._id}>
                        {community.name}
                      </option>
                    ))}
                  </select> */}
                </div>
                
                {/* Post Title */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700"
                    placeholder="Enter a title for your post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                {/* Post Content */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="content">
                    Content
                  </label>
                  <textarea
                    id="content"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[200px] text-gray-700"
                    placeholder="Write your post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                {/* Attachment Options */}
                <div className="mb-6">
                  <p className="text-gray-700 font-medium mb-2">Add Attachment (Optional)</p>
                  <div className="flex flex-wrap gap-3">
                    {['image', 'video', 'link', 'poll'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`flex items-center px-4 py-2 rounded-lg ${
                          attachmentType === type 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                        onClick={() => setAttachmentType(attachmentType === type ? null : type)}
                      >
                        {type === 'image' && <FaImage className="mr-2" />}
                        {type === 'video' && <FaVideo className="mr-2" />}
                        {type === 'link' && <FaLink className="mr-2" />}
                        {type === 'poll' && <FaPoll className="mr-2" />}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Attachment Input */}
                {attachmentType && (
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="attachment">
                      {attachmentType === 'image' && 'Image URL'}
                      {attachmentType === 'video' && 'Video URL'}
                      {attachmentType === 'link' && 'Link URL'}
                      {attachmentType === 'poll' && 'Poll Options (comma separated)'}
                    </label>
                    {attachmentType === 'poll' ? (
                      <textarea
                        id="attachment"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Option 1, Option 2, Option 3..."
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                      ></textarea>
                    ) : (
                      <input
                        type="text"
                        id="attachment"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder={`Enter ${attachmentType} URL`}
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                      />
                    )}
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-sm transition-colors ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Creating Post...' : 'Post to Community'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Guidelines Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Community Guidelines</h2>
              
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-teal-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>Be respectful and courteous to other community members.</p>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-teal-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>Share relevant content that adds value to the community.</p>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-teal-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>Avoid posting personal or sensitive information.</p>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-teal-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>No spamming or promotional content without permission.</p>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-teal-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>Help foster a positive learning environment.</p>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-lg">
                <p className="text-teal-800 text-sm">
                  Note: Posts are reviewed by community moderators and may be removed if they violate the community guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCreatePostPage;