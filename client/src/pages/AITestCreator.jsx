import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FacHeader from './Dashboardpages/facheader';
import axios from 'axios'; // Make sure to import axios

const AITestCreator = () => {
  const [testDetails, setTestDetails] = useState({
    subject: 'Mathematics',
    gradeLevel: 'Grade 9',
    chapter: '',
    topic: '',
    questionTypes: {
      multipleChoice: true,
      shortAnswer: false,
      essay: false,
      finalanswer: false
    },
    difficulty: 'medium',
    numberOfQuestions: 10,
    timeLimit: 30
  });

  const [generatedTest, setGeneratedTest] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [error, setError] = useState(null);
  
  // Chapter options based on selected subject
  const chapterOptions = {
    Mathematics: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'],
    Science: ['Biology', 'Chemistry', 'Physics', 'Earth Science', 'Astronomy'],
    English: ['Grammar', 'Literature', 'Composition', 'Vocabulary', 'Comprehension'],
    History: ['Ancient Civilizations', 'World Wars', 'American History', 'European History', 'Asian History']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestDetails(prev => ({ 
      ...prev, 
      [name]: value,
      // Reset chapter if subject changes
      ...(name === 'subject' ? { chapter: '' } : {})
    }));
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

  // Transform React questionTypes object to array format expected by Python
  const getSelectedQuestionTypes = () => {
    return Object.entries(testDetails.questionTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => {
        // Convert camelCase to snake_case for Python backend
        if (type === 'multipleChoice') return 'multiple_choice';
        if (type === 'shortAnswer') return 'short_answer';
        if (type === 'finalanswer') return 'final_answer';
        return type; // essay stays the same
      });
  };

  // Extract grade number from "Grade X" format
  const extractGradeNumber = (gradeText) => {
    const matches = gradeText.match(/\d+/);
    return matches ? parseInt(matches[0], 10) : 9; // Default to 9 if parsing fails
  };

  const generateTest = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Format data for the Python backend
      const requestData = {
        subject: testDetails.subject,
        grade_level: extractGradeNumber(testDetails.gradeLevel),
        topic: testDetails.topic || testDetails.chapter || "General",
        question_types: getSelectedQuestionTypes(),
        difficulty: testDetails.difficulty,
        number_of_questions: parseInt(testDetails.numberOfQuestions, 10),
        time_limit: parseInt(testDetails.timeLimit, 10)
      };
      
      console.log("Sending request to generate test:", requestData);
      
      // Call the API endpoint
      const response = await axios.post('http://localhost:5000/api/generate-test', requestData);
      
      // Process the response, expecting a JSON string in the response.data.test_content
      if (response.data && response.data.test_content) {
        try {
          // Attempt to parse the test content
          const rawContent = response.data.test_content;
          let parsedContent;
          
          // Clean up the content if it comes with markdown code blocks
          if (rawContent.includes('```')) {
            const jsonContent = rawContent
              .replace(/```json/g, '')
              .replace(/```/g, '')
              .trim();
            parsedContent = JSON.parse(jsonContent);
          } else {
            parsedContent = JSON.parse(rawContent);
          }
          
          // Format the test data for the frontend
          const formattedTest = {
            title: parsedContent.title,
            questions: parsedContent.questions.map(q => {
              // Convert question type if needed
              const type = q.type === 'multiple_choice' ? 'multipleChoice' : 
                         q.type === 'short_answer' ? 'shortAnswer' : 
                         q.type === 'final_answer' ? 'finalanswer' : q.type;
                         
              return {
                ...q,
                type,
                id: q.id || Math.random().toString(36).substr(2, 9)
              };
            }),
            answerKey: parsedContent.answer_key,
            estimatedTime: parsedContent.estimated_time,
            instructions: parsedContent.instructions || ''
          };
          
          setGeneratedTest(formattedTest);
          setActiveTab('preview');
        } catch (parseError) {
          console.error("Error parsing test content:", parseError);
          setError("Failed to parse the generated test. Please try again.");
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating test:", error);
      setError(`Failed to generate test: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle test download
  const handleDownloadTest = async () => {
    try {
      // First, we need to stringify the actual test data
      const testJson = JSON.stringify(generatedTest);
      
      // Using Blob approach for file download
      const response = await axios.post('http://localhost:5000/api/download-test', {
        test_data: testJson,
        subject: testDetails.subject,
        filename: `${testDetails.subject.toLowerCase()}_${(testDetails.topic || 'test').toLowerCase().replace(/\s+/g, '_')}.json`
      }, {
        responseType: 'blob' // Important for file downloads
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${testDetails.subject.toLowerCase()}_test.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading test:", error);
      setError(`Failed to download test: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    }
  };

  // Handle assign to class
  const handleAssignTest = () => {
    // This would call another endpoint to assign the test to a class
    alert("Test assignment feature will be implemented soon");
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
              <select
                name="chapter"
                value={testDetails.chapter}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a chapter</option>
                {chapterOptions[testDetails.subject]?.map((chapter) => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>

            <div>
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
              <button 
                onClick={handleDownloadTest}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download
              </button>
              <button 
                onClick={handleAssignTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                <p className="text-sm text-gray-600">Chapter</p>
                <p className="font-medium">{testDetails.chapter || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Grade Level</p>
                <p className="font-medium">{testDetails.gradeLevel}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Topic</p>
                <p className="font-medium">{testDetails.topic || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="font-medium">{testDetails.difficulty.charAt(0).toUpperCase() + testDetails.difficulty.slice(1)}</p>
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
                <div key={q.id || index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-medium">Question {index + 1}: {q.question}</p>
                  {q.type === 'multipleChoice' && (
                    <ul className="mt-2 space-y-2">
                      {q.options?.map((opt, i) => (
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
                  {q.type === 'shortAnswer' && (
                    <div className="mt-2 italic text-gray-600">
                      Expected answer: {q.answer}
                    </div>
                  )}
                  {q.type === 'essay' && (
                    <div className="mt-2 italic text-gray-600">
                      Essay question
                    </div>
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