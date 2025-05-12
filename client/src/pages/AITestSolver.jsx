import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FacHeader from './Dashboardpages/facheader';
import axios from 'axios';

const AITestSolver = () => {
  const [testText, setTestText] = useState('');
  const [testFile, setTestFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);

  const handleTextChange = (e) => {
    setTestText(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setTestFile(e.target.files[0]);
      // Clear text input when file is selected
      setTestText('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setTestFile(e.dataTransfer.files[0]);
      // Clear text input when file is dropped
      setTestText('');
    }
  };

  const solveTest = async () => {
    if (!testText && !testFile) {
      setError("Please provide test questions either by text or file upload");
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      let response;
      const formData = new FormData();
      
      if(!testFile) {
         response = await axios.post('http://127.0.0.1:5000/api/solve-test', {
          test_content: testText
        });
      }
      if (testFile) {
        formData.append('file', testFile);
        response = await axios.post('http://127.0.0.1:5000/api/solve-test-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
       } 
       //else {
      //   response = await axios.post('http://127.0.0.1:5000/api/solve-test', {
      //     test_content: testText
      //   });
      // }

      if (response.data && response.data.solutions) {
        setSolution(response.data.solutions);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error solving test:", error);
      setError(`Failed to solve test: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 md:p-6 mt-20 max-w-6xl text-black mx-auto bg-gray-50 min-h-screen">
      <FacHeader />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Test Solver
          </h1>
          <p className="text-gray-600">Get solutions and explanations for test questions</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4">Input Test Questions</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste your test questions here
            </label>
            <textarea
              value={testText}
              onChange={handleTextChange}
              disabled={testFile !== null}
              placeholder="Enter test questions here... (e.g., 1. What is the capital of France? 2. Solve for x: 2x + 5 = 15)"
              className="w-full h-60 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or upload a file (.txt, .pdf, .docx, .json)
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                testFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input 
                id="file-input"
                type="file"
                onChange={handleFileChange}
                accept=".txt,.pdf,.docx,.json"
                className="hidden"
              />
              
              {testFile ? (
                <div>
                  <svg className="w-8 h-8 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p className="mt-2 font-medium text-green-700">{testFile.name}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setTestFile(null);
                    }}
                    className="mt-2 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Click to select or drag and drop a file here</p>
                  <p className="mt-1 text-xs text-gray-500">Supported formats: TXT, PDF, DOCX, JSON</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={solveTest}
              disabled={isProcessing || (!testText && !testFile)}
              className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                (!testText && !testFile) || isProcessing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                  Solve Test
                </>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-4">Solutions</h2>
          
          {!solution ? (
            <div className="flex flex-col items-center justify-center h-60 text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <p className="mt-4 text-center">
                Submit your test questions to see AI-generated solutions
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {solution.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
                  <h3 className="font-bold text-blue-900">Question {index + 1}:</h3>
                  <p className="mt-1 text-gray-900">{item.question}</p>
                  <div className="mt-3">
                    <h4 className="font-semibold text-green-700">Solution:</h4>
                    <p className="mt-1 text-gray-900">{item.solution}</p>
                  </div>
                  {item.explanation && (
                    <div className="mt-3">
                      <h4 className="font-semibold text-purple-700">Explanation:</h4>
                      <p className="mt-1 text-gray-900">{item.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
                
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    // Create downloadable text file with solutions
                    const text = solution.map((item, i) => (
                      `Question ${i+1}: ${item.question}\n\n` +
                      `Solution: ${item.solution}\n\n` +
                      `${item.explanation ? `Explanation: ${item.explanation}\n\n` : ''}` +
                      `----------------------------------------\n\n`
                    )).join('');
                    
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'test-solutions.txt';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download Solutions
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AITestSolver;
