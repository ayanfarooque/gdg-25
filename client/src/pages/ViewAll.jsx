import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Dashboardpages/Header';

const ViewAll = () => {
    const navigate = useNavigate();
    
    // Enhanced dummy data with grading information
    const dummyAssignments = [
        {
            _id: '1',
            title: 'Math Homework',
            description: 'Complete exercises 1-10 on page 45 about algebraic equations. Show all steps and justify your reasoning.',
            subjectId: { name: 'Mathematics', code: 'MATH101' },
            dueDate: '2023-12-15T23:59:00',
            status: 'pending',
            instructions: 'Submit as a single PDF file. Show all work for full credit. No late submissions accepted.',
            points: 100,
            attachments: [
                { name: 'worksheet.pdf', type: 'pdf', size: '2.4 MB' },
                { name: 'lecture_notes_week5.pdf', type: 'pdf', size: '3.1 MB' }
            ],
            createdAt: '2023-11-28T09:00:00'
        },
        {
            _id: '2',
            title: 'History Essay',
            description: 'Write a 1000-word analytical essay on the political causes of World War II',
            subjectId: { name: 'History', code: 'HIST202' },
            dueDate: '2023-12-20T23:59:00',
            status: 'submitted',
            submissionDate: '2023-12-18T14:30:00',
            instructions: 'Use at least 3 primary sources and 2 secondary sources. Follow Chicago citation style. Include a bibliography.',
            points: 150,
            attachments: [
                { name: 'essay_guidelines.pdf', type: 'pdf', size: '1.2 MB' },
                { name: 'primary_sources.zip', type: 'zip', size: '5.7 MB' }
            ],
            submission: {
                file: 'world_war_ii_essay.pdf',
                type: 'pdf',
                size: '4.2 MB',
                submittedAt: '2023-12-18T14:30:00',
                comments: 'Submitted on time'
            },
            grading: {
                score: 135,
                classAverage: 112,
                feedback: 'Excellent analysis of political factors but could use more primary source evidence. Your thesis was particularly strong.',
                rubric: [
                    { criterion: 'Thesis Statement', score: 25, maxScore: 25 },
                    { criterion: 'Evidence', score: 38, maxScore: 45 },
                    { criterion: 'Analysis', score: 45, maxScore: 45 },
                    { criterion: 'Structure', score: 22, maxScore: 25 },
                    { criterion: 'Citations', score: 5, maxScore: 10 }
                ]
            },
            createdAt: '2023-11-15T10:30:00'
        },
        {
            _id: '3',
            title: 'Science Lab Report',
            description: 'Complete lab report on chemical reaction rates using the data collected in class',
            subjectId: { name: 'Chemistry', code: 'CHEM105' },
            dueDate: '2023-12-10T23:59:00',
            status: 'late',
            submissionDate: '2023-12-12T08:15:00',
            instructions: 'Include all sections: Abstract, Introduction, Methods, Results, Discussion, Conclusion. Use APA format.',
            points: 120,
            attachments: [
                { name: 'lab_manual_ch4.pdf', type: 'pdf', size: '3.5 MB' },
                { name: 'data_template.xlsx', type: 'xlsx', size: '1.8 MB' }
            ],
            submission: {
                file: 'reaction_rates_lab.docx',
                type: 'docx',
                size: '2.1 MB',
                submittedAt: '2023-12-12T08:15:00',
                comments: 'Submitted 2 days late'
            },
            grading: {
                score: 98,
                classAverage: 105,
                feedback: 'Good analysis but missing error discussion. Late penalty applied (-10%).',
                rubric: [
                    { criterion: 'Completeness', score: 20, maxScore: 25 },
                    { criterion: 'Accuracy', score: 30, maxScore: 30 },
                    { criterion: 'Analysis', score: 35, maxScore: 40 },
                    { criterion: 'Formatting', score: 13, maxScore: 15 }
                ]
            },
            createdAt: '2023-11-20T14:00:00'
        },
        {
            _id: '4',
            title: 'Geography Quiz',
            description: 'European capitals and major geographical features identification',
            subjectId: { name: 'Geography', code: 'GEOG110' },
            dueDate: '2023-12-08T23:59:00',
            status: 'canceled',
            instructions: 'Online quiz available on the course portal. 30 minute time limit.',
            points: 50,
            attachments: [
                { name: 'study_guide_europe.pdf', type: 'pdf', size: '5.2 MB' },
                { name: 'practice_quiz.pdf', type: 'pdf', size: '1.3 MB' }
            ],
            createdAt: '2023-11-25T13:45:00',
            cancellationReason: 'Quiz postponed due to technical issues with the testing platform'
        },
        {
            _id: '5',
            title: 'Programming Project',
            description: 'Create a Python program that analyzes weather data from provided CSV files',
            subjectId: { name: 'Computer Science', code: 'CS201' },
            dueDate: '2023-12-22T23:59:00',
            status: 'pending',
            instructions: 'Submit both source code (.py file) and a 1-page documentation PDF. Work may be done in pairs.',
            points: 200,
            attachments: [
                { name: 'weather_data.zip', type: 'zip', size: '12.4 MB' },
                { name: 'project_rubric.pdf', type: 'pdf', size: '0.8 MB' },
                { name: 'sample_code.py', type: 'py', size: '45 KB' }
            ],
            createdAt: '2023-12-01T09:30:00'
        },
        {
            _id: '6',
            title: 'Literature Review',
            description: 'Analyze the use of symbolism in three works from the Romantic period',
            subjectId: { name: 'English Literature', code: 'ENG220' },
            dueDate: '2023-12-05T23:59:00',
            status: 'submitted',
            submissionDate: '2023-12-05T21:45:00',
            instructions: 'Compare and contrast the symbolic elements in at least three works. 1500-2000 words. MLA format required.',
            points: 180,
            attachments: [
                { name: 'romantic_period_reading_list.pdf', type: 'pdf', size: '2.1 MB' },
                { name: 'mla_guide.pdf', type: 'pdf', size: '0.9 MB' }
            ],
            submission: {
                file: 'symbolism_in_romantic_lit.pdf',
                type: 'pdf',
                size: '3.8 MB',
                submittedAt: '2023-12-05T21:45:00',
                comments: 'Submitted with 2 hours to spare'
            },
            grading: {
                score: 172,
                classAverage: 155,
                feedback: 'Outstanding comparative analysis with excellent textual evidence. Your thesis was original and well-supported.',
                rubric: [
                    { criterion: 'Thesis', score: 30, maxScore: 30 },
                    { criterion: 'Analysis', score: 50, maxScore: 50 },
                    { criterion: 'Evidence', score: 45, maxScore: 45 },
                    { criterion: 'Structure', score: 25, maxScore: 25 },
                    { criterion: 'Mechanics', score: 22, maxScore: 30 }
                ]
            },
            createdAt: '2023-11-10T11:15:00'
        }
    ];
    const [assignments, setAssignments] = useState(dummyAssignments);
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [cancelId, setCancelId] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmitAssignment = (assignmentId) => {
        if (!selectedFile) {
            alert('Please select a file to submit');
            return;
        }

        setSubmitting(true);
        
        setTimeout(() => {
            setAssignments(assignments.map(assignment => 
                assignment._id === assignmentId 
                    ? { 
                        ...assignment, 
                        status: 'submitted', 
                        submissionDate: new Date().toISOString(),
                        grading: {
                            score: null, // Not graded yet
                            classAverage: null,
                            feedback: '',
                            rubric: []
                        }
                    } 
                    : assignment
            ));
            
            setSelectedFile(null);
            setSubmitting(false);
            alert('Assignment submitted successfully!');
        }, 1000);
    };

    const handleCancelAssignment = (assignmentId) => {
        setCancelId(assignmentId);
        
        setTimeout(() => {
            setAssignments(assignments.map(assignment => 
                assignment._id === assignmentId 
                    ? { ...assignment, status: 'canceled' } 
                    : assignment
            ));
            setCancelId(null);
        }, 1000);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            submitted: 'bg-blue-100 text-blue-800',
            canceled: 'bg-red-100 text-red-800',
            late: 'bg-purple-100 text-purple-800',
            graded: 'bg-green-100 text-green-800'
        };

        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    const handleViewAssignment = (assignmentId) => {
        navigate(`/assignments/${assignmentId}`);
    };

    return (
        <div className="min-h-screen bg-[#ECE7CA] py-8 px-4 sm:px-6 lg:px-8">
            <Header />
            <div className="max-w-7xl pt-28 mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        View all your assignments and their current status
                    </p>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Due Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {assignments.map((assignment) => (
                                <tr key={assignment._id}>
                                    <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => handleViewAssignment(assignment._id)}>
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {assignment.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {assignment.description.substring(0, 50)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{assignment.subjectId?.name || 'N/A'}</div>
                                        <div className="text-xs text-gray-500">{assignment.subjectId?.code || ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {new Date(assignment.dueDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(assignment.dueDate).toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(assignment.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewAssignment(assignment._id)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                View
                                            </button>
                                            {assignment.status === 'pending' && (
                                                <>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            id={`file-upload-${assignment._id}`}
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                        <label
                                                            htmlFor={`file-upload-${assignment._id}`}
                                                            className="cursor-pointer inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            Select File
                                                        </label>
                                                    </div>
                                                    <button
                                                        onClick={() => handleSubmitAssignment(assignment._id)}
                                                        disabled={!selectedFile || submitting}
                                                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${(!selectedFile || submitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {submitting ? 'Submitting...' : 'Submit'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {assignments.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No assignments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewAll;