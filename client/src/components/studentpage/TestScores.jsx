import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiChevronRight, 
  FiDownload, 
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiBriefcase,
  FiCalendar
} from 'react-icons/fi';

function TestScores() {
  const navigate = useNavigate();
  
  // Mock test score data
  const scores = [
    {
      id: "SSTUT01",
      date: "Apr 22, 2025",
      subject: "Social Science",
      subjectCode: "SS301",
      teacher: "Vikul J Pawar",
      score: "12",
      maxScore: "15",
      percentage: 80,
      trend: "up",
      change: "+5%"
    },
    {
      id: "SCIUT01",
      date: "Apr 23, 2025",
      subject: "Science",
      subjectCode: "SC405",
      teacher: "S C Sharma",
      score: "15",
      maxScore: "15",
      percentage: 100,
      trend: "up",
      change: "+12%",
      perfect: true
    },
    {
      id: "HINUT01",
      date: "Apr 24, 2025",
      subject: "Hindi",
      subjectCode: "HI201",
      teacher: "V C Pandey",
      score: "14",
      maxScore: "15",
      percentage: 93,
      trend: "neutral",
      change: "0%"
    },
    {
      id: "MATHUT01",
      date: "Apr 25, 2025",
      subject: "Mathematics",
      subjectCode: "MA401",
      teacher: "R K Mishra",
      score: "13",
      maxScore: "15",
      percentage: 87,
      trend: "down",
      change: "-3%"
    }
  ];

  // Calculate the overall percentage
  const overallPercentage = Math.round(
    scores.reduce((acc, score) => acc + score.percentage, 0) / scores.length
  );

  const handleViewPerformance = (testId) => {
    navigate(`/test-performance/${testId}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl overflow-hidden"
    >
      <div className="p-1">
        {/* Summary Stats */}
        <motion.div variants={itemVariants} className="mb-6 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Tests Taken</h3>
            <div className="text-2xl font-bold text-gray-800">{scores.length}</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Average</h3>
            <div className="text-2xl font-bold text-gray-800">{overallPercentage}%</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Perfect Scores</h3>
            <div className="text-2xl font-bold text-gray-800">
              {scores.filter(s => s.percentage === 100).length}
            </div>
          </div>
        </motion.div>

        {/* Test Scores Table */}
        <motion.div variants={itemVariants} className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Test Details
                </th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scores.map((score, index) => (
                <motion.tr 
                  key={score.id} 
                  className="hover:bg-gray-50 transition-colors"
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="p-3">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-500 mr-3">
                        <FiBriefcase size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{score.id}</div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <FiCalendar size={12} className="mr-1" />
                          {score.date}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="font-medium text-gray-800">{score.subject}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {score.subjectCode} • {score.teacher}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-gray-800">{score.score}</span>
                      <span className="text-sm text-gray-500 ml-1">/ {score.maxScore}</span>
                    </div>
                    
                    {score.perfect && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Perfect!
                      </span>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center mb-1">
                      <div className="w-24 bg-gray-100 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${getColorByPercentage(score.percentage)}`}
                          style={{ width: `${score.percentage}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${getTextColorByPercentage(score.percentage)}`}>
                        {score.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      {score.trend === 'up' && (
                        <FiTrendingUp size={12} className="text-green-500 mr-1" />
                      )}
                      {score.trend === 'down' && (
                        <FiTrendingDown size={12} className="text-red-500 mr-1" />
                      )}
                      {score.trend === 'neutral' && (
                        <FiMinus size={12} className="text-gray-500 mr-1" />
                      )}
                      <span className={`${getTrendColor(score.trend)}`}>
                        {score.change} from last
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <button 
                      onClick={() => handleViewPerformance(score.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      Details
                      <FiChevronRight size={14} className="ml-1" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Footer Actions */}
        <motion.div 
          variants={itemVariants} 
          className="mt-6 flex flex-wrap justify-between items-center gap-3 border-t border-gray-200 pt-4"
        >
          <div className="text-sm text-gray-500">
            Showing {scores.length} of {scores.length} tests from this semester
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors">
              <FiDownload size={16} className="mr-2" />
              Download Report
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              View All Tests
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Helper functions for styling based on score percentage
function getColorByPercentage(percentage) {
  if (percentage >= 90) return 'bg-green-500';
  if (percentage >= 75) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getTextColorByPercentage(percentage) {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 75) return 'text-blue-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

function getTrendColor(trend) {
  if (trend === 'up') return 'text-green-500';
  if (trend === 'down') return 'text-red-500';
  return 'text-gray-500';
}

export default TestScores;