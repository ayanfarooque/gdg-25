import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const WelcomeBanner = ({ username = "Ronit", themeColor = 'teal', userRole = 'student' }) => {
  const navigate = useNavigate();
  
  const handleCreatePost = () => {
    // Navigate to the appropriate post creation page based on user role
    if (userRole === 'teacher') {
      navigate('/teacher-create-post');
    } else {
      navigate('/student-create-post');
    }
  };
  
  // Define color schemes based on theme
  const colorSchemes = {
    teal: {
      bg: 'from-teal-500 to-teal-400',
      text: 'text-teal-50',
      button: 'text-teal-600 hover:bg-teal-50',
    },
    pink: {
      bg: 'from-pink-500 to-pink-300',
      text: 'text-pink-50',
      button: 'text-pink-600 hover:bg-pink-50',
    }
  };

  const colors = colorSchemes[themeColor] || colorSchemes.teal;
  
  return (
    <div className={`bg-gradient-to-r ${colors.bg} rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-center`}>
      <div>
        <h1 className="font-bold text-2xl mb-2">
          Welcome to {userRole === 'teacher' ? 'Teacher' : 'Student'} Community, {username}!
        </h1>
        <p className={colors.text}>
          {userRole === 'teacher' 
            ? 'Connect with other educators, share resources, and discuss teaching methods.'
            : 'Connect with peers, join subject communities, and collaborate on academic challenges.'}
        </p>
      </div>
      
      <div className="mt-4 md:mt-0">
        <button 
          onClick={handleCreatePost}
          className={`bg-white ${colors.button} px-5 py-2.5 rounded-lg font-semibold flex items-center shadow-sm transition-colors`}
        >
          <FaPlus className="mr-2" /> Create Post
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;