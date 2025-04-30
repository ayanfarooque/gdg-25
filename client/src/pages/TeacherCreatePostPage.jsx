import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacHeader from './Dashboardpages/facheader';
import { FaImage, FaVideo, FaLink, FaPoll, FaChevronLeft } from 'react-icons/fa';
import { communities } from '../data/communityData';

const TeacherCreatePostPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [attachmentType, setAttachmentType] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically handle the API call to create a new post
    console.log({
      title,
      content,
      communityId: selectedCommunity,
      attachmentType,
      attachmentUrl,
      role: 'teacher'
    });
    
    // Redirect back to the community page after submission
    navigate('/teachers-community');
  };

  // Function to handle going back
  const handleGoBack = () => {
    navigate('/teachers-community');
  };

  // Filter teacher-specific communities
  const teacherCommunities = communities.filter(community => 
    community.allowedRoles?.includes('teacher') || !community.allowedRoles
  );

  return (
    <div className="min-h-screen mt-16 ml-30">
      <FacHeader />
      <div className="container mx-auto px-4 py-6">
        {/* Top Navigation */}
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-pink-600 font-medium hover:text-pink-700 transition-colors"
          >
            <FaChevronLeft className="mr-2" /> Back to Community
          </button>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h1 className="text-2xl font-bold mb-6 text-gray-800">Create a New Post</h1>
              
              <form onSubmit={handleSubmit}>
                {/* Community Selection */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="community">
                    Select Community
                  </label>
                  <select
                    id="community"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700"
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    required
                  >
                    <option value="">Select a Community</option>
                    {teacherCommunities.map(community => (
                      <option key={community._id} value={community._id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Post Title */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent min-h-[200px] text-gray-700"
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
                    <button
                      type="button"
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        attachmentType === 'image' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                      onClick={() => setAttachmentType(attachmentType === 'image' ? null : 'image')}
                    >
                      <FaImage className="mr-2" /> Image
                    </button>
                    <button
                      type="button"
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        attachmentType === 'video' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                      onClick={() => setAttachmentType(attachmentType === 'video' ? null : 'video')}
                    >
                      <FaVideo className="mr-2" /> Video
                    </button>
                    <button
                      type="button"
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        attachmentType === 'link' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                      onClick={() => setAttachmentType(attachmentType === 'link' ? null : 'link')}
                    >
                      <FaLink className="mr-2" /> Link
                    </button>
                    <button
                      type="button"
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        attachmentType === 'poll' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                      onClick={() => setAttachmentType(attachmentType === 'poll' ? null : 'poll')}
                    >
                      <FaPoll className="mr-2" /> Poll
                    </button>
                  </div>
                </div>
                
                {/* Conditional input based on attachment type */}
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Option 1, Option 2, Option 3..."
                        value={attachmentUrl}
                        onChange={(e) => setAttachmentUrl(e.target.value)}
                      ></textarea>
                    ) : (
                      <input
                        type="text"
                        id="attachment"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                    className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Post to Community
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Guidelines Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Educator Guidelines</h2>
              
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-pink-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>Share educational insights and teaching strategies.</p>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-pink-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>Provide supportive feedback to fellow educators.</p>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-pink-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>Respect student privacy when discussing classroom experiences.</p>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-pink-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>Contribute to professional development discussions.</p>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-pink-500 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                  <p>Focus on evidence-based educational practices.</p>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-pink-50 border border-pink-100 rounded-lg">
                <p className="text-pink-800 text-sm">
                  Note: As an educator, your contributions help shape the learning community. Posts are moderated to maintain professional standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreatePostPage;