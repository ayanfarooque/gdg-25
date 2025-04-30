import React, { useState } from "react";
import resourcesJson from "../data/resources.json";
import newsJson from "../data/news.json";
import { formatFileSize, formatDuration, getFileIcon, getTypeBadgeColor } from "../utils/resourceUtils.js";
import Header from "../pages/Dashboardpages/Header.jsx";
import { useNavigate } from "react-router-dom";
import { FiDownload, FiEye, FiStar, FiClock, FiUser, FiTag, FiFileText, FiFilm, FiCode, FiBookOpen, FiSearch, FiCalendar, FiMessageCircle, FiThumbsUp, FiInfo, FiAward, FiAlertCircle } from "react-icons/fi";

const ResourcePage = () => {
  const [resources] = useState(resourcesJson.resourcesData);
  const [news] = useState(newsJson.newsData);
  const [showNews, setShowNews] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  // Filter resources by subject
  const filterResources = () => {
    let filtered = resources;
    
    // Apply search filter if search term exists
    if (searchTerm) {
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.metadata.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply subject filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(resource => 
        resource.metadata.subject.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    return filtered;
  };

  // Filter news by category
  const filterNews = () => {
    let filtered = news;
    
    // Apply search filter if search term exists
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    return filtered;
  };

  // Get unique subjects for resource filter
  const getSubjects = () => {
    const subjects = new Set(resources.map(resource => resource.metadata.subject));
    return ["all", ...subjects];
  };

  // Get unique categories for news filter
  const getCategories = () => {
    const categories = new Set(news.map(item => item.category));
    return ["all", ...categories];
  };

  // Get category badge color
  const getCategoryBadgeColor = (category) => {
    const colors = {
      announcement: "bg-blue-100 text-blue-800",
      event: "bg-purple-100 text-purple-800",
      achievement: "bg-green-100 text-green-800",
      general: "bg-gray-100 text-gray-800",
      academic: "bg-yellow-100 text-yellow-800"
    };
    return colors[category] || colors.general;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      announcement: <FiInfo />,
      event: <FiCalendar />,
      achievement: <FiAward />,
      general: <FiAlertCircle />,
      academic: <FiBookOpen />
    };
    return icons[category] || <FiInfo />;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render star rating
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Get icon component based on file type
  const getTypeIcon = (type) => {
    const icons = {
      document: <FiFileText />,
      video: <FiFilm />,
      pdf: <FiBookOpen />,
      code: <FiCode />
    };
    return icons[type] || <FiFileText />;
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-[#ECE7CA] p-6 ml-10">
      <Header />
      <div className="pt-10 mt-10 w-full max-w-7xl">
        {/* Toggle between News and Resources */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setShowNews(true)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${showNews ? 'bg-[#49ABB0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              News
            </button>
            <button
              onClick={() => setShowNews(false)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${!showNews ? 'bg-[#49ABB0] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Resources
            </button>
          </div>
        </div>

        {showNews ? (
          /* News Section - Enhanced Design */
          <>
            {/* Search and Filter Bar for News */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-md">
              <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-600" />
                </div>
                <input
                  type="text"
                  placeholder="Search news..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#49ABB0] text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {getCategories().map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                      activeFilter === category 
                        ? 'bg-[#49ABB0] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* News Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterNews().map((item) => (
                <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 text-gray-900">
                  {/* News Image */}
                  <div className="relative">
                    <img 
                      src={item.imageUrl || "https://via.placeholder.com/600x300?text=No+Image"} 
                      alt={item.title} 
                      className="w-full h-48 object-cover"
                    />
                    {item.isFeatured && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                    <div className={`absolute top-2 right-2 ${getCategoryBadgeColor(item.category)} text-xs font-bold px-2 py-1 rounded flex items-center`}>
                      {getCategoryIcon(item.category)}
                      <span className="ml-1 uppercase">{item.category}</span>
                    </div>
                  </div>
                  
                  {/* News Content */}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">{item.title}</h2>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.excerpt || item.content}</p>
                    
                    {/* Author & Date */}
                    <div className="mt-4 flex items-center">
                      <img 
                        src={item.author.profilePic || "https://via.placeholder.com/40?text=User"} 
                        alt={item.author.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.author.name}</p>
                        <p className="text-xs text-gray-500">
                          <FiCalendar className="inline mr-1" />
                          {formatDate(item.publishedAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                          <FiTag className="mr-1 w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Engagement Stats & Action */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FiEye className="mr-1" />
                          {item.views}
                        </div>
                        <div className="flex items-center">
                          <FiThumbsUp className="mr-1" />
                          {item.likes}
                        </div>
                        <div className="flex items-center">
                          <FiMessageCircle className="mr-1" />
                          {item.commentsCount}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/news/${item.slug}`)}
                        className="inline-flex items-center bg-[#49ABB0] text-white px-4 py-2 rounded hover:bg-[#3a8a8e] transition-colors"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* No Results Message for News */}
            {filterNews().length === 0 && (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No news found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        ) : (
          /* Resources Section - Enhanced Design */
          <>
            {/* Search and Filter Bar for Resources */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-md">
              <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#49ABB0] text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {getSubjects().map(subject => (
                  <button
                    key={subject}
                    onClick={() => setActiveFilter(subject)}
                    className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                      activeFilter === subject 
                        ? 'bg-[#49ABB0] text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filterResources().map((resource) => (
                <div key={resource._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Card Header with Thumbnail */}
                  <div className="relative">
                    <img 
                      src={resource.file.thumbnailUrl || "https://via.placeholder.com/400x225?text=No+Preview"} 
                      alt={resource.title}
                      className="w-full h-48 object-cover"
                    />
                    {resource.isFeatured && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                    <div className={`absolute top-2 right-2 ${getTypeBadgeColor(resource.file.type)} text-xs font-bold px-2 py-1 rounded flex items-center`}>
                      {getTypeIcon(resource.file.type)}
                      <span className="ml-1 uppercase">{resource.file.type}</span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{resource.title}</h2>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{resource.description}</p>
                    
                    {/* Metadata */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiUser className="mr-2 text-[#49ABB0]" />
                        <span>{resource.uploadedBy.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiBookOpen className="mr-2 text-[#49ABB0]" />
                        <span>{resource.metadata.subject} • {resource.metadata.topic}</span>
                      </div>
                      {resource.file.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FiClock className="mr-2 text-[#49ABB0]" />
                          <span>Duration: {formatDuration(resource.file.duration)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                          <FiTag className="mr-1 w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-full">
                          +{resource.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex items-center justify-between">
                        {/* Rating */}
                        <div>
                          {renderStarRating(resource.averageRating)}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiEye className="mr-1" />
                            {resource.views}
                          </div>
                          <div className="flex items-center">
                            <FiDownload className="mr-1" />
                            {resource.downloads}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {formatFileSize(resource.file.size)}
                      </span>
                      <a 
                        href={resource.file.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-[#49ABB0] text-white px-4 py-2 rounded hover:bg-[#3a8a8e] transition-colors"
                      >
                        <FiDownload className="mr-2" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* No Results Message for Resources */}
            {filterResources().length === 0 && (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResourcePage;
