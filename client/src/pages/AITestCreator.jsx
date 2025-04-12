import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FacHeader from './Dashboardpages/facheader';

const AITestCreator = () => {
  const [testDetails, setTestDetails] = useState({
    subject: 'Mathematics',
    gradeLevel: 'Grade 9',
    topic: '',
    questionTypes: {
      multipleChoice: true,
      shortAnswer: false,
      essay: false
    },
    difficulty: 'medium',
    numberOfQuestions: 10,
    timeLimit: 30
  });

  const [generatedTest, setGeneratedTest] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionTypeChange = (type) => {
    setTestDetails(prev => ({
      ...prev,
      questionTypes: {
        ...prev.questionTypes,
        [type]: !prev.questionTypes[type]
      }
    }));
  };

  const generateTest = () => {
    setIsGenerating(true);
    // Simulate AI generation with timeout
    setTimeout(() => {
      setGeneratedTest({
        title: `${testDetails.topic || testDetails.subject} Test`,
        questions: [
          {
            id: 1,
            type: 'multipleChoice',
            question: 'What is the quadratic formula?',
            options: [
              'x = (-b ± √(b²-4ac))/2a',
              'x = b²-4ac',
              'y = mx + b',
              'A = πr²'
            ],
            answer: 0
          },
          // More sample questions...
        ],
        answerKey: "1. A\n2. C\n3. B...",
        estimatedTime: testDetails.timeLimit
      });
      setIsGenerating(false);
      setActiveTab('preview');
    }, 2000);
  };

  return (
    <div className="p-4 md:p-6 mt-20 max-w-6xl text-black mx-auto bg-gray-50 min-h-screen">
        <FacHeader />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Test Generator
          </h1>
          <p className="text-gray-600">Create customized tests in minutes using AI</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-3 ${activeTab === 'create' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('create')}
        >
          Create Test
        </button>
        <button
          className={`px-4 py-3 ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('preview')}
          disabled={!generatedTest}
        >
          Preview Test
        </button>
      </div>

      {activeTab === 'create' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                name="subject"
                value={testDetails.subject}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>History</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
              <select
                name="gradeLevel"
                value={testDetails.gradeLevel}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i}>Grade {i + 1}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic (optional)</label>
              <input
                type="text"
                name="topic"
                value={testDetails.topic}
                onChange={handleInputChange}
                placeholder="E.g., Quadratic Equations, World War II"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Types</label>
              <div className="flex flex-wrap gap-3">
                {Object.entries(testDetails.questionTypes).map(([type, isSelected]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleQuestionTypeChange(type)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={testDetails.difficulty}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
              <input
                type="number"
                name="numberOfQuestions"
                min="1"
                max="50"
                value={testDetails.numberOfQuestions}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
              <input
                type="number"
                name="timeLimit"
                min="5"
                max="180"
                value={testDetails.timeLimit}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={generateTest}
              disabled={isGenerating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Generate Test
                </>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{generatedTest?.title}</h2>
            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
                Assign to Class
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Test Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-medium">{testDetails.subject}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Grade Level</p>
                <p className="font-medium">{testDetails.gradeLevel}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Estimated Time</p>
                <p className="font-medium">{testDetails.timeLimit} minutes</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Questions</h3>
            <div className="space-y-6">
              {generatedTest?.questions?.map((q, index) => (
                <div key={q.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-medium">Question {index + 1}: {q.question}</p>
                  {q.type === 'multipleChoice' && (
                    <ul className="mt-2 space-y-2">
                      {q.options.map((opt, i) => (
                        <li key={i} className="flex items-center">
                          <span className="mr-2 font-medium">{String.fromCharCode(65 + i)}.</span>
                          <span>{opt}</span>
                          {i === q.answer && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                              Correct
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Answer Key</h3>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap font-mono">
              {generatedTest?.answerKey}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AITestCreator;