import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FacHeader from './Dashboardpages/facheader';
import axios from 'axios';

const API_ENDPOINT = "http://127.0.0.1:5001/api/grade-card";

const AIGradeCardGenerator = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeCard, setGradeCard] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('select');
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch subjects when a student is selected
  useEffect(() => {
    if (selectedStudent) {
      fetchSubjects(selectedStudent.id);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${API_ENDPOINT}/students`);

      if (response.data.success) {
        setStudents(response.data.data.students);
      } else {
        throw new Error(response.data.message || 'Failed to fetch students');
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async (studentId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${API_ENDPOINT}/subjects/${studentId}`);

      if (response.data.success) {
        setSubjects(response.data.data.subjects);
      } else {
        throw new Error(response.data.message || 'Failed to fetch subjects');
      }
    } catch (err) {
      console.error(`Error fetching subjects for student ${studentId}:`, err);
      setError("Failed to load student's subjects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateGradeCard = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const studentData = {
        student: selectedStudent,
        subjects: subjects
      };

      const response = await axios.post(`${API_ENDPOINT}/generate`, studentData);

      if (response.data.success) {
        setGradeCard(response.data.data);
        setActiveTab('preview');
      } else {
        throw new Error(response.data.message || 'Failed to generate grade card');
      }
    } catch (err) {
      console.error("Error generating grade card:", err);
      setError("Failed to generate grade card. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto text-black mt-20 bg-gray-50 min-h-screen">
        <FacHeader />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Grade Card Generator
          </h1>
          <p className="text-gray-600">Generate personalized grade cards with AI insights</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-3 ${activeTab === 'select' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('select')}
        >
          Select Student
        </button>
        <button
          className={`px-4 py-3 ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('preview')}
          disabled={!gradeCard}
        >
          Preview Grade Card
        </button>
      </div>

      {isLoading && !isGenerating ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : activeTab === 'select' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold mb-6">Select a Student</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.map(student => (
              <motion.div
                key={student.id}
                whileHover={{ y: -5 }}
                className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                  selectedStudent?.id === student.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {student.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold">{student.name}</h3>
                    <p className="text-sm text-gray-600">Grade {student.grade}</p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-sm">Avg. Score: {student.avgScore}%</span>
                  {selectedStudent?.id === student.id && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Selected
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {selectedStudent && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Subject Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subjects.map((subject, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{subject.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{subject.score}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {subject.trend === "up" ? (
                            <span className="text-green-600 flex items-center">
                              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                              </svg>
                              Improving
                            </span>
                          ) : subject.trend === "down" ? (
                            <span className="text-red-600 flex items-center">
                              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                              Declining
                            </span>
                          ) : (
                            <span className="text-gray-600 flex items-center">
                              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
                              </svg>
                              Stable
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={generateGradeCard}
              disabled={!selectedStudent || isGenerating}
              className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                !selectedStudent
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  Generate Grade Card
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold">Grade Card</h2>
              <p className="text-gray-600">Generated on: {gradeCard?.generated_on}</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download PDF
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <svg className="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Email to Parent
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {gradeCard?.student.avatar}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{gradeCard?.student.name}</h3>
                    <p className="text-gray-600">Grade {gradeCard?.student.grade}</p>
                    <div className="mt-2 flex items-center">
                      <span className="text-lg font-bold mr-2">{gradeCard?.overall_grade}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        Overall Grade
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">Key Metrics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-blue-700">Attendance</p>
                  <p className="text-xl font-bold">{gradeCard?.attendance}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Average Score</p>
                  <p className="text-xl font-bold">{gradeCard?.student.avgScore}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Subject-wise Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gradeCard?.subjects.map((subject, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{subject.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{subject.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                          ${subject.grade === 'A+' ? 'bg-green-100 text-green-800' : 
                            subject.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                            subject.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                            subject.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}
                        >
                          {subject.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subject.trend === "up" ? (
                          <span className="text-green-600 flex items-center">
                            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                            </svg>
                            Improving
                          </span>
                        ) : subject.trend === "down" ? (
                          <span className="text-red-600 flex items-center">
                            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                            Declining
                          </span>
                        ) : (
                          <span className="text-gray-600 flex items-center">
                            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
                            </svg>
                            Stable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {gradeCard?.strengths.map((strength, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {strength}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Areas for Improvement</h3>
            <div className="flex flex-wrap gap-2">
              {gradeCard?.areas_for_improvement.map((area, index) => (
                <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Teacher Comments</h3>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-gray-800">{gradeCard?.teacher_comments}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIGradeCardGenerator;