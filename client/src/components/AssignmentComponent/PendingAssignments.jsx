import { FiChevronRight, FiClock, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

function PendingAssignments() {
  const assignments = [
    { 
      subject: "DATA STRUCTURES", 
      title: "Binary Tree Implementation",
      date: "May 5, 2025", 
      progress: 25,
      priority: "high",
      isLate: false
    },
    { 
      subject: "OPERATING SYSTEM", 
      title: "Process Scheduling Algorithms",
      date: "May 8, 2025", 
      progress: 60,
      priority: "medium",
      isLate: false
    },
    { 
      subject: "ADVANCED MATHEMATICS", 
      title: "Differential Equations Set",
      date: "May 10, 2025", 
      progress: 0,
      priority: "high",
      isLate: false
    }
  ];

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
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-orange-500",
    low: "bg-blue-500"
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4"
    >
      {assignments.map((assignment, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 border-l-4 border-yellow-500"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* Subject and Priority indicator */}
              <div className="flex items-center">
                <span className={`h-2 w-2 rounded-full mr-2 ${priorityColors[assignment.priority]}`}></span>
                <h3 className="font-semibold text-gray-800">{assignment.subject}</h3>
                {assignment.isLate && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center">
                    <FiAlertCircle size={10} className="mr-1" />
                    Late
                  </span>
                )}
              </div>
              
              {/* Assignment Title */}
              <p className="text-sm text-gray-600 mt-1 font-medium">{assignment.title}</p>

              {/* Due Date and Progress */}
              <div className="flex items-center mt-3">
                <div className="flex items-center text-gray-500 mr-3">
                  <FiClock size={14} className="mr-1 text-[#3A7CA5]" />
                  <span className="text-xs">Due: {assignment.date}</span>
                </div>
                
                {/* Progress bar */}
                <div className="flex-1 flex items-center">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        assignment.progress < 30 ? 'bg-red-500' :
                        assignment.progress < 70 ? 'bg-orange-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${assignment.progress}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500 font-medium">{assignment.progress}%</span>
                </div>
              </div>
            </div>
            
            {/* Action button */}
            <button 
              className="p-2 text-[#3A7CA5] hover:text-[#2F6690] hover:bg-blue-50 rounded-full transition-colors"
              aria-label="View assignment details"
            >
              <FiChevronRight />
            </button>
          </div>
        </motion.div>
      ))}
      
      {/* View All Button */}
      <motion.button 
        variants={itemVariants}
        className="w-full py-2.5 text-sm font-medium text-[#3A7CA5] hover:text-white border border-[#3A7CA5] hover:bg-[#3A7CA5] rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        View All Assignments
        <FiChevronRight className="ml-1" size={16} />
      </motion.button>
    </motion.div>
  );
}

export default PendingAssignments;
