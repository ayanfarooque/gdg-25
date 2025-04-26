import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import { FiBarChart2, FiActivity } from 'react-icons/fi';

const SubjectPerformance = () => {
  const [activeChart, setActiveChart] = useState('radar');
  
  // Sample data for subject performance
  const subjects = [
    { subject: 'Mathematics', score: 82, classAvg: 75, fullMark: 100, improvement: '+5%' },
    { subject: 'Science', score: 90, classAvg: 72, fullMark: 100, improvement: '+12%' },
    { subject: 'English', score: 76, classAvg: 70, fullMark: 100, improvement: '+4%' },
    { subject: 'History', score: 68, classAvg: 65, fullMark: 100, improvement: '+2%' },
    { subject: 'Computer Science', score: 95, classAvg: 78, fullMark: 100, improvement: '+10%' },
    { subject: 'Art', score: 72, classAvg: 74, fullMark: 100, improvement: '-2%' },
  ];
  
  // Functions to determine colors based on performance
  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981'; // green
    if (score >= 75) return '#3b82f6'; // blue
    if (score >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Chart type toggle */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveChart('radar')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeChart === 'radar' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiActivity size={16} />
            <span>Radar View</span>
          </button>
          <button 
            onClick={() => setActiveChart('bar')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeChart === 'bar' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiBarChart2 size={16} />
            <span>Bar View</span>
          </button>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></span>
            <span className="text-gray-600">Your Score</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
            <span className="text-gray-600">Class Average</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'radar' ? (
            <RadarChart outerRadius="80%" data={subjects}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#64748b', fontSize: 12 }}  
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <Radar 
                name="Class Average" 
                dataKey="classAvg" 
                stroke="#94a3b8" 
                fill="#94a3b8" 
                fillOpacity={0.3} 
              />
              <Radar 
                name="Your Score" 
                dataKey="score" 
                stroke="#4f46e5" 
                fill="#4f46e5" 
                fillOpacity={0.45} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  border: '1px solid #e5e7eb'
                }} 
              />
            </RadarChart>
          ) : (
            <BarChart
              data={subjects}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="subject" 
                tick={{ fill: '#64748b', fontSize: 11 }} 
                axisLine={false}
                tickLine={false}
                interval={0}
                height={60}
                angle={-20}
                textAnchor="end"
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  border: '1px solid #e5e7eb'
                }}
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Bar 
                dataKey="classAvg" 
                name="Class Average"
                fill="#94a3b8" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
              <Bar 
                dataKey="score" 
                name="Your Score" 
                fill="#4f46e5" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Subject Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.subject}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 hover:shadow-md transition-shadow"
          >
            <div className="text-xs font-medium text-gray-500 mb-1">{subject.subject}</div>
            <div className="flex items-baseline">
              <span 
                className="text-lg font-bold"
                style={{ color: getScoreColor(subject.score) }}
              >
                {subject.score}%
              </span>
              <span className={`ml-1 text-xs ${
                subject.improvement.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {subject.improvement}
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-100 h-1.5 rounded-full">
              <div
                className="h-1.5 rounded-full"
                style={{ 
                  width: `${subject.score}%`,
                  backgroundColor: getScoreColor(subject.score)
                }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SubjectPerformance;