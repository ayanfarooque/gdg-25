import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Dashboardpages/Header';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FiDownload, FiArrowLeft, FiCalendar, FiFileText, FiBook, FiCheckCircle, FiClock, FiAlertCircle, FiAward } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AssignmentDetail = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssignment = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/assignments/assignment/${assignmentId}`);
            setAssignment(response.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching assignment:", err);
            setError(err.response?.data?.message || err.message || "Failed to load assignment");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignment();
    }, [assignmentId]);

    const getStatusIcon = () => {
        if (!assignment) return null;
        
        switch(assignment.status) {
            case 'submitted': return <FiCheckCircle className="text-blue-500 mr-2" />;
            case 'graded': return <FiAward className="text-green-500 mr-2" />;
            case 'pending': return <FiClock className="text-yellow-500 mr-2" />;
            case 'late': return <FiAlertCircle className="text-purple-500 mr-2" />;
            default: return <FiClock className="text-gray-500 mr-2" />;
        }
    };

    const chartData = assignment?.status === 'submitted' && assignment.grading ? {
        labels: ['Class Average', 'Your Score'],
        datasets: [
            {
                label: 'Scores',
                data: [assignment.grading.classAverage, assignment.grading.score],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(16, 185, 129, 0.7)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 2,
                borderRadius: 4
            }
        ]
    } : null;

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: assignment?.points || 100,
                grid: {
                    color: 'rgba(229, 231, 235, 0.8)'
                },
                ticks: {
                    color: 'rgba(107, 114, 128, 1)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(107, 114, 128, 1)'
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Performance Comparison',
                color: 'rgba(17, 24, 39, 1)',
                font: {
                    size: 16,
                    weight: '600'
                },
                padding: {
                    bottom: 20
                }
            },
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: 'white',
                bodyColor: 'white',
                padding: 12,
                cornerRadius: 8
            }
        }
    };

    const calculateGradePercentage = () => {
        if (!assignment?.grading) return 0;
        return Math.round((assignment.grading.score / assignment.points) * 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ECE7CA] py-8 px-4 sm:px-6 lg:px-8">
                <Header />
                <div className="max-w-5xl pt-24 mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#ECE7CA] py-8 px-4 sm:px-6 lg:px-8">
                <Header />
                <div className="max-w-5xl pt-24 mx-auto">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Back to Assignments
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="min-h-screen bg-[#ECE7CA] py-8 px-4 sm:px-6 lg:px-8">
                <Header />
                <div className="max-w-5xl pt-24 mx-auto">
                    <div className="bg-white rounded-xl shadow-md p-6 text-center">
                        <p className="text-gray-500">Assignment not found.</p>
                        <button 
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Back to Assignments
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#ECE7CA] py-8 px-4 sm:px-6 lg:px-8">
            <Header />
            <div className="max-w-5xl pt-24 mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to Assignments
                </button>

                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                                <div className="flex items-center mt-1">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        {assignment.subjectId?.name} ({assignment.subjectId?.code})
                                    </span>
                                    <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                        assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
                                        assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {getStatusIcon()}
                                        {assignment.status?.charAt(0).toUpperCase() + assignment.status?.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-3 sm:mt-0">
                                <div className="text-lg font-semibold text-gray-900">
                                    {assignment.points} Points
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {/* Description and Due Date */}
                        <div className="mb-8">
                            <div className="flex items-start mb-4">
                                <FiFileText className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                                    <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <FiCalendar className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Due Date</h2>
                                    <p className="text-gray-700">
                                        {new Date(assignment.dueDate).toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    {assignment.status === 'submitted' && assignment.submissionDate && (
                                        <p className="text-gray-700 mt-1">
                                            <span className="font-medium">Submitted:</span> {new Date(assignment.submissionDate).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mb-8 bg-blue-50 rounded-lg p-5">
                            <div className="flex items-start">
                                <FiBook className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h2>
                                    <div className="prose prose-blue max-w-none">
                                        <p className="text-gray-700 whitespace-pre-line">{assignment.instructions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Attachments */}
                        {assignment.attachments && assignment.attachments.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {assignment.attachments.map((file, index) => (
                                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                                            <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                                <FiDownload className="text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                                <p className="text-xs text-gray-500">{file.size} • {file.type.toUpperCase()}</p>
                                            </div>
                                            <a 
                                                href={`http://localhost:5000/uploads/${file.name}`} 
                                                download
                                                className="ml-3 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                            >
                                                <FiDownload />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Grading Section */}
                        {assignment.status === 'submitted' && assignment.grading && (
                            <div className="mt-10">
                                <div className="border-t border-gray-200 pt-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Grading Results</h2>
                                    
                                    {/* Score Summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Your Score</h3>
                                            <div className="flex items-baseline">
                                                <span className="text-3xl font-bold text-gray-900">{assignment.grading.score}</span>
                                                <span className="ml-1 text-lg text-gray-500">/ {assignment.points}</span>
                                            </div>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Percentage</h3>
                                            <div className="text-3xl font-bold text-gray-900">
                                                {calculateGradePercentage()}%
                                            </div>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Class Average</h3>
                                            <div className="text-3xl font-bold text-gray-900">
                                                {assignment.grading.classAverage}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Performance Chart */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
                                        {chartData && (
                                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                                                <div className="h-64">
                                                    <Bar data={chartData} options={chartOptions} />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Feedback */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructor Feedback</h3>
                                        <div className="bg-blue-50 rounded-lg p-5">
                                            <p className="text-gray-700 whitespace-pre-line">{assignment.grading.feedback}</p>
                                        </div>
                                    </div>

                                    {/* Rubric */}
                                    {assignment.grading.rubric && assignment.grading.rubric.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Rubric Breakdown</h3>
                                            <div className="overflow-hidden shadow-sm border border-gray-200 rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Criterion
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Score
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Max Score
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Percentage
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {assignment.grading.rubric.map((item, index) => (
                                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {item.criterion}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {item.score}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {item.maxScore}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {Math.round((item.score / item.maxScore) * 100)}%
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetail;





// import {React, useState,useEffect } from 'react';
// import { useParams, useNavigate} from 'react-router-dom';
// import Header from './Dashboardpages/Header';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { FiDownload, FiArrowLeft, FiCalendar, FiFileText, FiBook, FiCheckCircle, FiClock, FiAlertCircle, FiAward } from 'react-icons/fi';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const AssignmentDetail = () => {
//     const { assignmentId } = useParams();
//     const navigate = useNavigate();
    
//     const [assignmentnew,setassginmetnew] = useState([])

//     const getsingleassignment = async () => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/assignments/assignment/${assignmentId}`);
//             setassginmetnew(response.data.data)
//             console.log(response.data.data)
//         }catch (error) { 
//             console.error("Error fetching assignment:", error);
//         }   
//     }
//     useEffect(() => {
//         getsingleassignment()
//     },[assignmentId])


//     // Dummy data - in a real app, you would fetch this based on assignmentId
//     const dummyAssignments = [
//         {
//             _id: '1',
//             title: 'Math Homework',
//             description: 'Complete exercises 1-10 on page 45 about algebraic equations. Show all steps and justify your reasoning.',
//             subjectId: { name: 'Mathematics', code: 'MATH101' },
//             dueDate: '2023-12-15T23:59:00',
//             status: 'pending',
//             instructions: 'Submit as a single PDF file. Show all work for full credit. No late submissions accepted.',
//             points: 100,
//             attachments: [
//                 { name: 'worksheet.pdf', type: 'pdf', size: '2.4 MB' },
//                 { name: 'lecture_notes_week5.pdf', type: 'pdf', size: '3.1 MB' }
//             ],
//             createdAt: '2023-11-28T09:00:00'
//         },
//         {
//             _id: '2',
//             title: 'History Essay',
//             description: 'Write a 1000-word analytical essay on the political causes of World War II',
//             subjectId: { name: 'History', code: 'HIST202' },
//             dueDate: '2023-12-20T23:59:00',
//             status: 'submitted',
//             submissionDate: '2023-12-18T14:30:00',
//             instructions: 'Use at least 3 primary sources and 2 secondary sources. Follow Chicago citation style. Include a bibliography.',
//             points: 150,
//             attachments: [
//                 { name: 'essay_guidelines.pdf', type: 'pdf', size: '1.2 MB' },
//                 { name: 'primary_sources.zip', type: 'zip', size: '5.7 MB' }
//             ],
//             submission: {
//                 file: 'world_war_ii_essay.pdf',
//                 type: 'pdf',
//                 size: '4.2 MB',
//                 submittedAt: '2023-12-18T14:30:00',
//                 comments: 'Submitted on time'
//             },
//             grading: {
//                 score: 135,
//                 classAverage: 112,
//                 feedback: 'Excellent analysis of political factors but could use more primary source evidence. Your thesis was particularly strong.\n\nSuggestions for improvement:\n- Include more direct quotes from primary sources\n- Expand on the economic factors section\n- Check citation formatting on page 3',
//                 rubric: [
//                     { criterion: 'Thesis Statement', score: 25, maxScore: 25 },
//                     { criterion: 'Evidence', score: 38, maxScore: 45 },
//                     { criterion: 'Analysis', score: 45, maxScore: 45 },
//                     { criterion: 'Structure', score: 22, maxScore: 25 },
//                     { criterion: 'Citations', score: 5, maxScore: 10 }
//                 ]
//             },
//             createdAt: '2023-11-15T10:30:00'
//         },
//         {
//             _id: '3',
//             title: 'Science Lab Report',
//             description: 'Complete lab report on chemical reaction rates using the data collected in class',
//             subjectId: { name: 'Chemistry', code: 'CHEM105' },
//             dueDate: '2023-12-10T23:59:00',
//             status: 'late',
//             submissionDate: '2023-12-12T08:15:00',
//             instructions: 'Include all sections: Abstract, Introduction, Methods, Results, Discussion, Conclusion. Use APA format.',
//             points: 120,
//             attachments: [
//                 { name: 'lab_manual_ch4.pdf', type: 'pdf', size: '3.5 MB' },
//                 { name: 'data_template.xlsx', type: 'xlsx', size: '1.8 MB' }
//             ],
//             submission: {
//                 file: 'reaction_rates_lab.docx',
//                 type: 'docx',
//                 size: '2.1 MB',
//                 submittedAt: '2023-12-12T08:15:00',
//                 comments: 'Submitted 2 days late'
//             },
//             grading: {
//                 score: 98,
//                 classAverage: 105,
//                 feedback: 'Good analysis but missing error discussion. Late penalty applied (-10%).\n\nStrengths:\n- Clear methodology section\n- Well-presented data tables\n\nAreas for improvement:\n- Discussion of experimental errors needed\n- Conclusion could be more detailed',
//                 rubric: [
//                     { criterion: 'Completeness', score: 20, maxScore: 25 },
//                     { criterion: 'Accuracy', score: 30, maxScore: 30 },
//                     { criterion: 'Analysis', score: 35, maxScore: 40 },
//                     { criterion: 'Formatting', score: 13, maxScore: 15 }
//                 ]
//             },
//             createdAt: '2023-11-20T14:00:00'
//         },
//         {
//             _id: '4',
//             title: 'Geography Quiz',
//             description: 'European capitals and major geographical features identification',
//             subjectId: { name: 'Geography', code: 'GEOG110' },
//             dueDate: '2023-12-08T23:59:00',
//             status: 'canceled',
//             instructions: 'Online quiz available on the course portal. 30 minute time limit.',
//             points: 50,
//             attachments: [
//                 { name: 'study_guide_europe.pdf', type: 'pdf', size: '5.2 MB' },
//                 { name: 'practice_quiz.pdf', type: 'pdf', size: '1.3 MB' }
//             ],
//             createdAt: '2023-11-25T13:45:00',
//             cancellationReason: 'Quiz postponed due to technical issues with the testing platform'
//         },
//         {
//             _id: '5',
//             title: 'Programming Project',
//             description: 'Create a Python program that analyzes weather data from provided CSV files',
//             subjectId: { name: 'Computer Science', code: 'CS201' },
//             dueDate: '2023-12-22T23:59:00',
//             status: 'pending',
//             instructions: 'Submit both source code (.py file) and a 1-page documentation PDF. Work may be done in pairs.',
//             points: 200,
//             attachments: [
//                 { name: 'weather_data.zip', type: 'zip', size: '12.4 MB' },
//                 { name: 'project_rubric.pdf', type: 'pdf', size: '0.8 MB' },
//                 { name: 'sample_code.py', type: 'py', size: '45 KB' }
//             ],
//             createdAt: '2023-12-01T09:30:00'
//         },
//         {
//             _id: '6',
//             title: 'Literature Review',
//             description: 'Analyze the use of symbolism in three works from the Romantic period',
//             subjectId: { name: 'English Literature', code: 'ENG220' },
//             dueDate: '2023-12-05T23:59:00',
//             status: 'submitted',
//             submissionDate: '2023-12-05T21:45:00',
//             instructions: 'Compare and contrast the symbolic elements in at least three works. 1500-2000 words. MLA format required.',
//             points: 180,
//             attachments: [
//                 { name: 'romantic_period_reading_list.pdf', type: 'pdf', size: '2.1 MB' },
//                 { name: 'mla_guide.pdf', type: 'pdf', size: '0.9 MB' }
//             ],
//             submission: {
//                 file: 'symbolism_in_romantic_lit.pdf',
//                 type: 'pdf',
//                 size: '3.8 MB',
//                 submittedAt: '2023-12-05T21:45:00',
//                 comments: 'Submitted with 2 hours to spare'
//             },
//             grading: {
//                 score: 172,
//                 classAverage: 155,
//                 feedback: 'Outstanding comparative analysis with excellent textual evidence. Your thesis was original and well-supported.\n\nParticular strengths:\n- Insightful comparison of Blake and Wordsworth\n- Excellent use of secondary sources\n- Flawless MLA formatting',
//                 rubric: [
//                     { criterion: 'Thesis', score: 30, maxScore: 30 },
//                     { criterion: 'Analysis', score: 50, maxScore: 50 },
//                     { criterion: 'Evidence', score: 45, maxScore: 45 },
//                     { criterion: 'Structure', score: 25, maxScore: 25 },
//                     { criterion: 'Mechanics', score: 22, maxScore: 30 }
//                 ]
//             },
//             createdAt: '2023-11-10T11:15:00'
//         },
//         {
//             _id: '7',
//             title: 'Physics Problem Set',
//             description: 'Solve problems on quantum mechanics from chapters 4-6',
//             subjectId: { name: 'Physics', code: 'PHYS301' },
//             dueDate: '2023-12-18T23:59:00',
//             status: 'submitted',
//             submissionDate: '2023-12-19T10:30:00',
//             instructions: 'Show all work for full credit. Problems must be solved using methods covered in class.',
//             points: 90,
//             attachments: [
//                 { name: 'problem_set_7.pdf', type: 'pdf', size: '1.5 MB' },
//                 { name: 'equation_sheet.pdf', type: 'pdf', size: '0.5 MB' }
//             ],
//             submission: {
//                 file: 'quantum_problems_solutions.pdf',
//                 type: 'pdf',
//                 size: '2.9 MB',
//                 submittedAt: '2023-12-19T10:30:00',
//                 comments: 'Submitted 10.5 hours late due to illness'
//             },
//             grading: {
//                 score: 81,
//                 classAverage: 76,
//                 feedback: 'Good work overall but missed points on problem 4 (did not account for spin). Late penalty waived with doctor\'s note.\n\nProblem 3 solution was particularly elegant.',
//                 rubric: [
//                     { criterion: 'Problem 1', score: 15, maxScore: 15 },
//                     { criterion: 'Problem 2', score: 20, maxScore: 20 },
//                     { criterion: 'Problem 3', score: 25, maxScore: 25 },
//                     { criterion: 'Problem 4', score: 15, maxScore: 20 },
//                     { criterion: 'Problem 5', score: 6, maxScore: 10 }
//                 ]
//             },
//             createdAt: '2023-11-30T16:20:00'
//         }
//     ];
//     // const assignment = dummyAssignments.find(a => a._id === assignmentId) || dummyAssignments[0];

//     //when the id issue will be fixed in the database then will replace the above line with the below line 
//     //uptill using above dummy data only 
//     const assignment = assignmentnew.find(a => a._id === assignmentId) || assignmentnew[0];

//     const getStatusIcon = () => {
//         switch(assignment.status) {
//             case 'submitted': return <FiCheckCircle className="text-blue-500 mr-2" />;
//             case 'graded': return <FiAward className="text-green-500 mr-2" />;
//             case 'pending': return <FiClock className="text-yellow-500 mr-2" />;
//             case 'late': return <FiAlertCircle className="text-purple-500 mr-2" />;
//             default: return <FiClock className="text-gray-500 mr-2" />;
//         }
//     };

//     const chartData = assignment.status === 'submitted' && assignment.grading ? {
//         labels: ['Class Average', 'Your Score'],
//         datasets: [
//             {
//                 label: 'Scores',
//                 data: [assignment.grading.classAverage, assignment.grading.score],
//                 backgroundColor: [
//                     'rgba(99, 102, 241, 0.7)',
//                     'rgba(16, 185, 129, 0.7)'
//                 ],
//                 borderColor: [
//                     'rgba(99, 102, 241, 1)',
//                     'rgba(16, 185, 129, 1)'
//                 ],
//                 borderWidth: 2,
//                 borderRadius: 4
//             }
//         ]
//     } : null;

//     const chartOptions = {
//         responsive: true,
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 max: assignment?.points || 100,
//                 grid: {
//                     color: 'rgba(229, 231, 235, 0.8)'
//                 },
//                 ticks: {
//                     color: 'rgba(107, 114, 128, 1)'
//                 }
//             },
//             x: {
//                 grid: {
//                     display: false
//                 },
//                 ticks: {
//                     color: 'rgba(107, 114, 128, 1)'
//                 }
//             }
//         },
//         plugins: {
//             title: {
//                 display: true,
//                 text: 'Performance Comparison',
//                 color: 'rgba(17, 24, 39, 1)',
//                 font: {
//                     size: 16,
//                     weight: '600'
//                 },
//                 padding: {
//                     bottom: 20
//                 }
//             },
//             legend: {
//                 display: false
//             },
//             tooltip: {
//                 backgroundColor: 'rgba(17, 24, 39, 0.9)',
//                 titleColor: 'white',
//                 bodyColor: 'white',
//                 padding: 12,
//                 cornerRadius: 8
//             }
//         }
//     };

//     const calculateGradePercentage = () => {
//         if (!assignment.grading) return 0;
//         return Math.round((assignment.grading.score / assignment.points) * 100);
//     };

//     return (
//         <div className="min-h-screen bg-[#ECE7CA] py-8 px-4 sm:px-6 lg:px-8">
//             <Header />
//             <div className="max-w-5xl pt-24 mx-auto">
//                 <button 
//                     onClick={() => navigate(-1)}
//                     className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
//                 >
//                     <FiArrowLeft className="mr-2" />
//                     Back to Assignments
//                 </button>

//                 <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
//                     {/* Header Section */}
//                     <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-gray-200">
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                             <div>
//                                 <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
//                                 <div className="flex items-center mt-1">
//                                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                                         {assignment.subjectId.name} ({assignment.subjectId.code})
//                                     </span>
//                                     <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                                         assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
//                                         assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
//                                         assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                                         'bg-gray-100 text-gray-800'
//                                     }`}>
//                                         {getStatusIcon()}
//                                         {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
//                                     </span>
//                                 </div>
//                             </div>
//                             <div className="mt-3 sm:mt-0">
//                                 <div className="text-lg font-semibold text-gray-900">
//                                     {assignment.points} Points
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Main Content */}
//                     <div className="p-6">
//                         {/* Description and Due Date */}
//                         <div className="mb-8">
//                             <div className="flex items-start mb-4">
//                                 <FiFileText className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
//                                     <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
//                                 </div>
//                             </div>
                            
//                             <div className="flex items-start">
//                                 <FiCalendar className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-gray-900 mb-1">Due Date</h2>
//                                     <p className="text-gray-700">
//                                         {new Date(assignment.dueDate).toLocaleDateString('en-US', { 
//                                             weekday: 'long', 
//                                             year: 'numeric', 
//                                             month: 'long', 
//                                             day: 'numeric',
//                                             hour: '2-digit',
//                                             minute: '2-digit'
//                                         })}
//                                     </p>
//                                     {assignment.status === 'submitted' && (
//                                         <p className="text-gray-700 mt-1">
//                                             <span className="font-medium">Submitted:</span> {new Date(assignment.submissionDate).toLocaleString()}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Instructions */}
//                         <div className="mb-8 bg-blue-50 rounded-lg p-5">
//                             <div className="flex items-start">
//                                 <FiBook className="text-indigo-500 mt-1 mr-3 flex-shrink-0" />
//                                 <div>
//                                     <h2 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h2>
//                                     <div className="prose prose-blue max-w-none">
//                                         <p className="text-gray-700 whitespace-pre-line">{assignment.instructions}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Attachments */}
//                         {assignment.attachments && assignment.attachments.length > 0 && (
//                             <div className="mb-8">
//                                 <h2 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h2>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                     {assignment.attachments.map((file, index) => (
//                                         <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
//                                             <div className="bg-indigo-100 p-2 rounded-lg mr-3">
//                                                 <FiDownload className="text-indigo-600" />
//                                             </div>
//                                             <div className="flex-1 min-w-0">
//                                                 <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
//                                                 <p className="text-xs text-gray-500">{file.size} • {file.type.toUpperCase()}</p>
//                                             </div>
//                                             <a 
//                                                 href={`/files/${file.name}`} 
//                                                 download
//                                                 className="ml-3 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
//                                             >
//                                                 <FiDownload />
//                                             </a>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {/* Grading Section */}
//                         {assignment.status === 'submitted' && assignment.grading && (
//                             <div className="mt-10">
//                                 <div className="border-t border-gray-200 pt-8">
//                                     <h2 className="text-xl font-bold text-gray-900 mb-6">Grading Results</h2>
                                    
//                                     {/* Score Summary */}
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                                         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
//                                             <h3 className="text-sm font-medium text-gray-500 mb-1">Your Score</h3>
//                                             <div className="flex items-baseline">
//                                                 <span className="text-3xl font-bold text-gray-900">{assignment.grading.score}</span>
//                                                 <span className="ml-1 text-lg text-gray-500">/ {assignment.points}</span>
//                                             </div>
//                                         </div>
//                                         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
//                                             <h3 className="text-sm font-medium text-gray-500 mb-1">Percentage</h3>
//                                             <div className="text-3xl font-bold text-gray-900">
//                                                 {calculateGradePercentage()}%
//                                             </div>
//                                         </div>
//                                         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
//                                             <h3 className="text-sm font-medium text-gray-500 mb-1">Class Average</h3>
//                                             <div className="text-3xl font-bold text-gray-900">
//                                                 {assignment.grading.classAverage}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Performance Chart */}
//                                     <div className="mb-8">
//                                         <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
//                                         {chartData && (
//                                             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
//                                                 <div className="h-64">
//                                                     <Bar data={chartData} options={chartOptions} />
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Feedback */}
//                                     <div className="mb-8">
//                                         <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructor Feedback</h3>
//                                         <div className="bg-blue-50 rounded-lg p-5">
//                                             <p className="text-gray-700 whitespace-pre-line">{assignment.grading.feedback}</p>
//                                         </div>
//                                     </div>

//                                     {/* Rubric */}
//                                     {assignment.grading.rubric && assignment.grading.rubric.length > 0 && (
//                                         <div>
//                                             <h3 className="text-lg font-semibold text-gray-900 mb-3">Rubric Breakdown</h3>
//                                             <div className="overflow-hidden shadow-sm border border-gray-200 rounded-lg">
//                                                 <table className="min-w-full divide-y divide-gray-200">
//                                                     <thead className="bg-gray-50">
//                                                         <tr>
//                                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                 Criterion
//                                                             </th>
//                                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                 Score
//                                                             </th>
//                                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                 Max Score
//                                                             </th>
//                                                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                                                 Percentage
//                                                             </th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody className="bg-white divide-y divide-gray-200">
//                                                         {assignment.grading.rubric.map((item, index) => (
//                                                             <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                                     {item.criterion}
//                                                                 </td>
//                                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                                     {item.score}
//                                                                 </td>
//                                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                                     {item.maxScore}
//                                                                 </td>
//                                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                                     {Math.round((item.score / item.maxScore) * 100)}%
//                                                                 </td>
//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                 </table>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AssignmentDetail;



