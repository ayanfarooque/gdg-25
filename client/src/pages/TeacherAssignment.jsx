import React, { useState, useEffect } from 'react';
import FacHeader from './Dashboardpages/facheader';
// Import the JSON data
import submissionData from '../data/submissions.json';

const TeacherAssignment = () => {
  // State for assignments and selected assignment
  const [assignments, setAssignments] = useState(submissionData.assignments);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Set the first assignment as selected on component load
  useEffect(() => {
    if (assignments.length > 0 && !selectedAssignment) {
      setSelectedAssignment(assignments[0]);
      filterSubmissionsByAssignment(assignments[0]._id);
    }
  }, [assignments]);

  // Filter submissions by selected assignment
  const filterSubmissionsByAssignment = (assignmentId) => {
    const filteredSubmissions = submissionData.submissions.filter(
      submission => submission.assignment === assignmentId
    );
    setSubmissions(filteredSubmissions);
  };

  // Handle assignment selection change
  const handleAssignmentChange = (e) => {
    const assignmentId = e.target.value;
    const selected = assignments.find(a => a._id === assignmentId);
    setSelectedAssignment(selected);
    filterSubmissionsByAssignment(assignmentId);
  };

  // Filter and sort submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         submission.student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || submission.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.student.name.localeCompare(b.student.name)
        : b.student.name.localeCompare(a.student.name);
    } else if (sortBy === 'date') {
      if (!a.submittedAt && !b.submittedAt) return 0;
      if (!a.submittedAt) return 1;
      if (!b.submittedAt) return -1;
      return sortDirection === 'asc' 
        ? new Date(a.submittedAt) - new Date(b.submittedAt)
        : new Date(b.submittedAt) - new Date(a.submittedAt);
    } else if (sortBy === 'score') {
      if (!a.grading?.score && !b.grading?.score) return 0;
      if (!a.grading?.score) return 1;
      if (!b.grading?.score) return -1;
      return sortDirection === 'asc' 
        ? a.grading.score - b.grading.score
        : b.grading.score - a.grading.score;
    }
    return 0;
  });

  // Function to handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to view file
  const viewFile = (file) => {
    alert(`Opening file: ${file.name}`);
    // In real implementation, this would open the file in a modal or new window
  };

  // Function to extend deadline
  const extendDeadline = () => {
    if (!selectedAssignment) return;
    
    const newDate = prompt('Enter new deadline (YYYY-MM-DD):', 
      new Date(selectedAssignment.dueDate).toISOString().split('T')[0]);
    
    if (newDate) {
      const updatedAssignment = {
        ...selectedAssignment,
        dueDate: new Date(`${newDate}T23:59:59.000Z`).toISOString()
      };
      
      setSelectedAssignment(updatedAssignment);
      
      const updatedAssignments = assignments.map(assignment => 
        assignment._id === updatedAssignment._id ? updatedAssignment : assignment
      );
      
      setAssignments(updatedAssignments);
      alert(`Deadline extended to ${new Date(`${newDate}T23:59:59.000Z`).toLocaleDateString()}`);
    }
  };

  // Calculate days remaining until deadline
  const calculateDaysRemaining = () => {
    if (!selectedAssignment) return 0;
    
    const today = new Date();
    const dueDate = new Date(selectedAssignment.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = calculateDaysRemaining();

  // Calculate submission statistics
  const calculateSubmissionStats = () => {
    if (!submissions.length) return { total: 0, submitted: 0, graded: 0, late: 0 };
    
    return {
      total: submissions.length,
      submitted: submissions.filter(s => ['submitted', 'late', 'graded', 'returned'].includes(s.status)).length,
      graded: submissions.filter(s => ['graded', 'returned'].includes(s.status)).length,
      late: submissions.filter(s => s.status === 'late').length
    };
  };
  
  const submissionStats = calculateSubmissionStats();
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'graded':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18V2a2 2 0 012-2h8a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
            <path d="M10 6H6v2h4V6z" />
            <path d="M14 6h-2v2h2V6z" />
            <path d="M14 10H6v2h8v-2z" />
          </svg>
        );
      case 'docx':
      case 'doc':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18V2a2 2 0 012-2h8a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
            <path d="M10 6H6v2h4V6z" />
            <path d="M10 10H6v2h4v-2z" />
            <path d="M10 14H6v2h4v-2z" />
          </svg>
        );
      case 'xlsx':
      case 'xls':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18V2a2 2 0 012-2h8a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
            <path d="M15 7H5V5h10v2z" />
            <path d="M15 11H5V9h10v2z" />
            <path d="M15 15H5v-2h10v2z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm12 12H4V7h12v10z" clipRule="evenodd" />
            <path d="M10 15c.64 0 1.27-.08 1.87-.23l-2.26-2.23-.62.6-3 3h4.01z" />
            <path d="M16 5h-3.58l-2-2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-7 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#ECE7CA] text-black overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <FacHeader />

        <div className="flex-1 overflow-auto p-4">
          {/* Main Content Grid */}
          <div className="grid pt-20 pl-32 grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Assignment Details */}
            <div className="lg:col-span-2">
              {/* Assignment Selection Dropdown */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold text-[#21294F] mb-4">E-LEARNING Faculty Portal</h1>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1 mr-4">
                    <label htmlFor="assignmentSelect" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Assignment
                    </label>
                    <select
                      id="assignmentSelect"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                      value={selectedAssignment?._id || ''}
                      onChange={handleAssignmentChange}
                    >
                      {assignments.map((assignment) => (
                        <option key={assignment._id} value={assignment._id}>
                          {assignment.code} - {assignment.title} ({assignment.subject})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    {selectedAssignment && (
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedAssignment.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedAssignment.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                        <p className="mt-1 text-sm text-gray-500">
                          Due: {formatDate(selectedAssignment.dueDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedAssignment && (
                  <div>
                    {/* Assignment Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-semibold">{selectedAssignment.code}</h2>
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-medium text-sm">
                            {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
                          </span>
                        </div>
                        <p className="text-lg font-medium">{selectedAssignment.subject}</p>
                        <p className="text-gray-600">{selectedAssignment.title}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">Total Marks: {selectedAssignment.totalMarks}</p>
                        <p className="text-sm text-gray-600">
                          Submissions: {submissionStats.submitted}/{submissionStats.total}
                        </p>
                      </div>
                    </div>
                    
                    {/* Description & Attachments */}
                    <div className="mb-4">
                      <p className="text-gray-700 mb-4">{selectedAssignment.description}</p>
                      
                      {selectedAssignment.attachments.length > 0 && (
                        <div>
                          <p className="font-medium mb-2">Attachments:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedAssignment.attachments.map((attachment, idx) => (
                              <a 
                                key={idx} 
                                href={attachment.url} 
                                className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>{attachment.name}</span>
                                <span className="ml-2 text-xs text-gray-500">{attachment.size}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Search and Filters */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-2">
                    <select
                      className="px-2 py-1 border rounded-lg text-sm"
                      onChange={(e) => setFilterStatus(e.target.value)}
                      value={filterStatus}
                    >
                      <option value="all">All Status</option>
                      <option value="submitted">Submitted</option>
                      <option value="late">Late</option>
                      <option value="graded">Graded</option>
                      <option value="returned">Returned</option>
                    </select>
                    
                    <select
                      className="px-2 py-1 border rounded-lg text-sm"
                      onChange={(e) => setSortBy(e.target.value)}
                      value={sortBy}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="date">Sort by Date</option>
                      <option value="score">Sort by Score</option>
                    </select>
                    
                    <button
                      className="px-2 py-1 border rounded-lg text-sm flex items-center"
                      onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {sortDirection === 'asc' 
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        }
                      </svg>
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-xs"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                      className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    ></svg>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    
                  </div>
                </div>
              </div>

              {/* Submissions Table Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700" onClick={() => handleSort('date')}>
                          <div className="flex items-center cursor-pointer">
                            <span>Date Submitted</span>
                            {sortBy === 'date' && (
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {sortDirection === 'asc' 
                                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                }
                              </svg>
                            )}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700" onClick={() => handleSort('name')}>
                          <div className="flex items-center cursor-pointer">
                            <span>Student</span>
                            {sortBy === 'name' && (
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {sortDirection === 'asc' 
                                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                }
                              </svg>
                            )}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700" onClick={() => handleSort('score')}>
                          <div className="flex items-center cursor-pointer">
                            <span>Score</span>
                            {sortBy === 'score' && (
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {sortDirection === 'asc' 
                                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                }
                              </svg>
                            )}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Files</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Comments</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.length > 0 ? (
                        filteredSubmissions.map((submission, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">
                              {formatDate(submission.submittedAt)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <img 
                                  src={submission.student.avatar} 
                                  alt={submission.student.name}
                                  className="w-8 h-8 rounded-full mr-3"
                                />
                                <div>
                                  <p className="font-medium">{submission.student.name}</p>
                                  <p className="text-xs text-gray-500">{submission.student.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusBadgeClass(submission.status)}`}>
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {submission.grading ? (
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-bold">{submission.grading.score}</span>
                                    <span className="text-gray-500 text-xs ml-1">/ {selectedAssignment?.totalMarks}</span>
                                  </div>
                                  {submission.grading.classAverage && (
                                    <p className="text-xs text-gray-500">
                                      Class avg: {submission.grading.classAverage}
                                    </p>
                                  )}
                                </div>
                              ) : "-"}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col space-y-1">
                                {submission.files.map((file, idx) => (
                                  <button 
                                    key={idx}
                                    onClick={() => viewFile(file)}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                                  >
                                    <span className="mr-1 text-gray-500">
                                      {getFileIcon(file.type)}
                                    </span>
                                    <span className="truncate max-w-[120px]">{file.name}</span>
                                  </button>
                                ))}
                                
                                {submission.resubmissions && submission.resubmissions.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">Resubmissions:</p>
                                    {submission.resubmissions.map((resubmission, reIdx) => (
                                      <div key={reIdx}>
                                        <p className="text-xs text-gray-500">{formatDate(resubmission.submittedAt)}</p>
                                        {resubmission.files.map((file, fileIdx) => (
                                          <button 
                                            key={fileIdx}
                                            onClick={() => viewFile(file)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center mt-1"
                                          >
                                            <span className="mr-1 text-gray-500">
                                              {getFileIcon(file.type)}
                                            </span>
                                            <span className="truncate max-w-[120px]">{file.name}</span>
                                          </button>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <div className="text-sm text-gray-700 line-clamp-2 hover:line-clamp-none">
                                {submission.comments || "-"}
                              </div>
                              {submission.grading?.feedback && (
                                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                                  <span className="font-semibold">Feedback:</span> {submission.grading.feedback}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-1">
                                {(submission.status === 'submitted' || submission.status === 'late') ? (
                                  <button className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50" title="Grade submission">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                ) : (
                                  <button className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50" title="Edit grading">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </button>
                                )}
                                <button className="p-1 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-50" title="Send feedback">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="py-8 text-center text-gray-500">
                            No submissions found for this assignment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Assignment Actions */}
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                  <div className="text-sm">
                    <p className="font-medium">Submissions Summary:</p>
                    <div className="grid grid-cols-4 gap-4 mt-1">
                      <div>
                        <p>Total: {submissionStats.total}</p>
                      </div>
                      <div>
                        <p>Submitted: {submissionStats.submitted}</p>
                      </div>
                      <div>
                        <p>Graded: {submissionStats.graded}</p>
                      </div>
                      <div>
                        <p>Late: {submissionStats.late}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Send Reminder
                    </button>
                    <button 
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                      onClick={extendDeadline}
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Extend Deadline
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Close Assignment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Assignment Details and Analytics */}
            <div className="space-y-6">
              {/* Assignment Details */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#21294F] to-[#49ABB0] p-4">
                  <h2 className="text-xl font-bold text-white">ASSIGNMENT DETAILS</h2>
                </div>
                {selectedAssignment && (
                  <div className="p-4">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Code</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedAssignment.code}</dd>
                      </div>
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Subject</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedAssignment.subject}</dd>
                      </div>
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Date Created</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(selectedAssignment.date)}</dd>
                      </div>
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(selectedAssignment.dueDate)}</dd>
                      </div>
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Total Marks</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedAssignment.totalMarks}</dd>
                      </div>
                      <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 sm:mt-0 sm:col-span-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedAssignment.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedAssignment.status.charAt(0).toUpperCase() + selectedAssignment.status.slice(1)}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>

              {/* Submission Analytics */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"></div>
                <div className="bg-gradient-to-r from-[#49ABB0] to-[#21294F] p-4">
                  <h2 className="text-xl font-bold text-white">SUBMISSION ANALYTICS</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Submission Rate */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Submission Rate</p>
                        <p className="text-sm font-medium">
                          {submissionStats.submitted}/{submissionStats.total}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-[#49ABB0] h-2.5 rounded-full" 
                          style={{ width: `${submissionStats.total > 0 ? (submissionStats.submitted / submissionStats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Graded Rate */}
                    <div></div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Graded Rate</p>
                        <p className="text-sm font-medium">
                          {submissionStats.graded}/{submissionStats.submitted}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-[#E195AB] h-2.5 rounded-full" 
                          style={{ 
                            width: `${submissionStats.submitted > 0 ? (submissionStats.graded / submissionStats.submitted) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Late Submissions */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium">Late Submissions</p>
                        <p className="text-sm font-medium">
                          {submissionStats.late}/{submissionStats.submitted}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-yellow-500 h-2.5 rounded-full" 
                          style={{ 
                            width: `${submissionStats.submitted > 0 ? (submissionStats.late / submissionStats.submitted) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Average Score */}
                    {submissions.filter(s => s.grading?.score).length > 0 && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Average Score</p>
                          <p className="text-sm font-medium">
                            {Math.round(submissions
                              .filter(s => s.grading?.score)
                              .reduce((total, s) => total + s.grading.score, 0) / 
                              submissions.filter(s => s.grading?.score).length
                            )}
                            /{selectedAssignment?.totalMarks}
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ 
                              width: `${selectedAssignment && 
                                Math.round((submissions
                                  .filter(s => s.grading?.score)
                                  .reduce((total, s) => total + s.grading.score, 0) / 
                                  submissions.filter(s => s.grading?.score).length) / 
                                  selectedAssignment.totalMarks * 100)
                                }%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="w-full mt-6 bg-[#21294F] text-white py-2 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Detailed Analytics
                  </button>
                </div>
              </div>

              {/* Grading Rubric */}
              {submissions.filter(s => s.grading?.rubric).length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ml-32 mt-5">
                  <div className="bg-gradient-to-r from-[#E195AB] to-[#49ABB0] p-4">
                    <h2 className="text-xl font-bold text-white">GRADING RUBRIC</h2>
                  </div>
                  <div className="p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criterion</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-sm">
                        {(() => {
                          // Calculate average scores for each criterion
                          const rubrics = submissions
                            .filter(s => s.grading?.rubric)
                            .map(s => s.grading.rubric);
                          
                          if (rubrics.length === 0) return null;
                          
                          // Get all unique criterion names
                          const allCriteria = new Set();
                          rubrics.forEach(rubric => {
                            rubric.forEach(item => {
                              allCriteria.add(item.criterion);
                            });
                          });
                          
                          // Calculate averages
                          return Array.from(allCriteria).map(criterion => {
                            let totalScore = 0;
                            let count = 0;
                            let maxScore = 0;
                            
                            rubrics.forEach(rubric => {
                              const item = rubric.find(i => i.criterion === criterion);
                              if (item) {
                                totalScore += item.score;
                                count++;
                                maxScore = item.maxScore; // Assuming max is the same for all
                              }
                            });
                            
                            const avgScore = count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;
                            
                            return (
                              <tr key={criterion}>
                                <td className="px-3 py-2">{criterion}</td>
                                <td className="px-3 py-2 text-right">{avgScore}</td>
                                <td className="px-3 py-2 text-right">{maxScore}</td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  );
};

export default TeacherAssignment;