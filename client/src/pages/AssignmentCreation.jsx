import React, { useState } from 'react';
import axios from 'axios';

const AssignmentCreation = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subjectId: '',
        teacherId: 'teacher123', // Default or get from auth context
        classroomId: '',
        dueDate: '',
        attachments: []
    });

    const [fileNames, setFileNames] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFileNames(files.map(file => file.name));
        setFormData(prev => ({
            ...prev,
            attachments: files
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);
        
        try {
            const formDataToSend = new FormData();
            
            // Append all text fields
            Object.keys(formData).forEach(key => {
                if (key !== 'attachments') {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
            // Append each file
            formData.attachments.forEach(file => {
                formDataToSend.append('attachments', file);
            });

            const response = await axios.post('http://localhost:5000/assign', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // If using auth
                }
            });

            setSuccess(true);
            // Reset form
            setFormData({
                title: '',
                description: '',
                subjectId: '',
                teacherId: 'teacher123',
                classroomId: '',
                dueDate: '',
                attachments: []
            });
            setFileNames([]);
        } catch (err) {
            setError(err.response?.data?.message || 
                   err.message || 
                   'Failed to create assignment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-300">
            <div className="flex justify-center pt-20 items-start pb-12 px-4">
                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-700 mb-6">Create New Assignment</h1>
                        
                        {success && (
                            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                                Assignment created successfully!
                            </div>
                        )}
                        
                        {error && (
                            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-gray-700 text-lg font-medium">
                                    Assignment Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-gray-700 text-lg font-medium">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="subjectId" className="block text-gray-700 text-lg font-medium">
                                        Subject Code
                                    </label>
                                    <input
                                        type="text"
                                        id="subjectId"
                                        name="subjectId"
                                        value={formData.subjectId}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="classroomId" className="block text-gray-700 text-lg font-medium">
                                        Classroom ID
                                    </label>
                                    <input
                                        type="text"
                                        id="classroomId"
                                        name="classroomId"
                                        value={formData.classroomId}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="dueDate" className="block text-gray-700 text-lg font-medium">
                                        Due Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="dueDate"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="attachments" className="block text-gray-700 text-lg font-medium">
                                        Attachments
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex flex-col items-center px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                            <span className="text-gray-700">
                                                {fileNames.length > 0 ? 'Add more files' : 'Choose Files'}
                                            </span>
                                            <input
                                                type="file"
                                                id="attachments"
                                                name="attachments"
                                                onChange={handleFileChange}
                                                multiple
                                                className="hidden"
                                            />
                                        </label>
                                        {fileNames.length > 0 && (
                                            <div className="space-y-1 mt-2">
                                                {fileNames.map((name, index) => (
                                                    <div key={index} className="text-sm text-blue-600 break-all">
                                                        {name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md ${
                                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Assignment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentCreation;