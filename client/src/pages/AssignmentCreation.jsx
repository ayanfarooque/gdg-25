import React, { useState } from 'react';
import FacHeader from './Dashboardpages/facheader';

const AssignmentCreation = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subjectId: '',
        teacherId: '',
        classroomId: '',
        dueDate: '',
        attachments: []
    });

    const [fileNames, setFileNames] = useState([]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="min-h-screen bg-[#ECE7CA]">
            <FacHeader />
            
            <div className="flex justify-center pt-20 items-start  pb-12 px-4">
                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-[#6D6875] mb-6">Create New Assignment</h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-[#6D6875] text-lg font-medium">
                                    Assignment Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-[#FFFAFA] border border-[#B5838D] rounded-lg px-4 py-3 text-[#6D6875] focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-[#6D6875] text-lg font-medium">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-[#FFFAFA] border border-[#B5838D] rounded-lg px-4 py-3 text-[#6D6875] min-h-[150px] focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="subjectId" className="block text-[#6D6875] text-lg font-medium">
                                        Subject Code
                                    </label>
                                    <input
                                        type="text"
                                        id="subjectId"
                                        name="subjectId"
                                        value={formData.subjectId}
                                        onChange={handleChange}
                                        className="w-full bg-[#FFFAFA] border border-[#B5838D] rounded-lg px-4 py-3 text-[#6D6875] focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="classroomId" className="block text-[#6D6875] text-lg font-medium">
                                        Classroom ID
                                    </label>
                                    <input
                                        type="text"
                                        id="classroomId"
                                        name="classroomId"
                                        value={formData.classroomId}
                                        onChange={handleChange}
                                        className="w-full bg-[#FFFAFA] border border-[#B5838D] rounded-lg px-4 py-3 text-[#6D6875] focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="dueDate" className="block text-[#6D6875] text-lg font-medium">
                                        Due Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="dueDate"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        className="w-full bg-[#FFFAFA] border border-[#B5838D] rounded-lg px-4 py-3 text-[#6D6875] focus:outline-none focus:ring-2 focus:ring-[#B5838D]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="attachments" className="block text-[#6D6875] text-lg font-medium">
                                        Attachments
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex flex-col items-center px-4 py-3 bg-[#FFFAFA] border-2 border-dashed border-[#B5838D] rounded-lg cursor-pointer hover:bg-[#E8C4C4] transition-colors">
                                            <span className="text-[#6D6875]">Choose Files</span>
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
                                                    <div key={index} className="text-sm text-[#B5838D] break-all">
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
                                    className="px-8 py-3 bg-[#B5838D] text-white font-bold rounded-lg hover:bg-[#6D6875] transition-colors shadow-md"
                                >
                                    Create Assignment
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