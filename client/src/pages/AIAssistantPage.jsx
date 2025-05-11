import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FacHeader from './Dashboardpages/facheader';
import { FileText, FileBarChart, Brain } from 'lucide-react';

const AIAssistantPage = () => {
  const navigate = useNavigate();

  const aiTools = [
    {
      id: 1,
      title: 'AI Test Generator',
      description: 'Create customized tests in minutes using AI technology. Generate questions based on subject, grade level, and difficulty.',
      icon: FileText,
      color: 'from-blue-600 to-purple-600',
      path: '/create-test',
      buttonText: 'Create Test'
    },
    {
      id: 2,
      title: 'AI Grade Card Generator',
      description: 'Generate personalized grade cards with AI insights. Create comprehensive performance reports for students.',
      icon: FileBarChart,
      color: 'from-green-600 to-teal-600',
      path: '/generate-reportcard',
      buttonText: 'Generate Cards'
    },
    {
      id: 3,
      title: 'AI Test Solver',
      description: 'Get step-by-step solutions to test questions. Upload tests or input questions to receive detailed explanations.',
      icon: Brain,
      color: 'from-orange-500 to-pink-500',
      path: '/test-solver',
      buttonText: 'Solve Tests'
    }
  ];

  return (
    <div className="p-4 md:p-6 mt-20 max-w-6xl text-black mx-auto bg-gray-50 min-h-screen">
      <FacHeader />
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Teaching Assistants
        </h1>
        <p className="text-gray-600">Select an AI tool to enhance your teaching experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {aiTools.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className={`bg-gradient-to-r ${tool.color} h-2`}></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`rounded-full p-3 bg-gradient-to-r ${tool.color} text-white`}>
                  <tool.icon size={24} />
                </div>
                <h2 className="ml-3 text-xl font-bold">{tool.title}</h2>
              </div>
              
              <p className="text-gray-600 mb-6 h-24">{tool.description}</p>
              
              <button 
                onClick={() => navigate(tool.path)}
                className={`w-full py-3 rounded-lg bg-gradient-to-r ${tool.color} text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center`}
              >
                <tool.icon size={18} className="mr-2" />
                {tool.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AIAssistantPage;
