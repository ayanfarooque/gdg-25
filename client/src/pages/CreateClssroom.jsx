import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  UserPlus,
  X,
  Check,
  User
} from 'lucide-react';
import AdminHeader from './Dashboardpages/AdminHeader';

const CreateClassroom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    gradeLevel: '',
    teacher: '',
    students: []
  });
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchStudentTerm, setSearchStudentTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch teachers and students - in real app these would be API calls
    const mockTeachers = [
      { id: 't1', name: 'John Smith', subject: 'Mathematics' },
      { id: 't2', name: 'Sarah Johnson', subject: 'Science' },
      { id: 't3', name: 'Michael Brown', subject: 'English' },
    ];

    const mockStudents = [
      { id: 's1', name: 'Alice Johnson', grade: '10' },
      { id: 's2', name: 'Bob Smith', grade: '10' },
      { id: 's3', name: 'Charlie Brown', grade: '11' },
      { id: 's4', name: 'Diana Prince', grade: '11' },
      { id: 's5', name: 'Ethan Hunt', grade: '12' },
    ];

    setAvailableTeachers(mockTeachers);
    setAvailableStudents(mockStudents);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = (student) => {
    if (!formData.students.some(s => s.id === student.id)) {
      setFormData(prev => ({
        ...prev,
        students: [...prev.students, student]
      }));
    }
  };

  const handleRemoveStudent = (studentId) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== studentId)
    }));
  };

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchStudentTerm.toLowerCase()) ||
    student.grade.includes(searchStudentTerm)
  ).filter(student => !formData.students.some(s => s.id === student.id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In real app, this would be an API call
      console.log('Creating classroom:', formData);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to classrooms list after creation
      navigate('/admin-classrooms');
    } catch (error) {
      console.error('Error creating classroom:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#ECE7CA] text-black min-h-screen">
        <AdminHeader />
      <div className="max-w-4xl pt-20 mx-auto p-6">
        <button
          onClick={() => navigate('/admin-classrooms')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Classrooms
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Create New Classroom</h2>
            <p className="text-gray-600">Fill in the details to create a new classroom</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Classroom Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Mathematics 101"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Mathematics"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Grade Level</label>
                <select
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select grade</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Assign Teacher</label>
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                >
                  <option value="">Select teacher</option>
                  {availableTeachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.subject})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add Students</h3>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={searchStudentTerm}
                    onChange={(e) => setSearchStudentTerm(e.target.value)}
                  />
                  <UserPlus className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>

              {formData.students.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Selected Students ({formData.students.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.students.map(student => (
                      <div 
                        key={student.id} 
                        className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full"
                      >
                        <User size={14} />
                        <span className="text-sm">{student.name}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveStudent(student.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {filteredStudents.length > 0 ? (
                  <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {filteredStudents.map(student => (
                      <li key={student.id} className="p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <User size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{student.name}</p>
                              <p className="text-sm text-gray-500">Grade {student.grade}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddStudent(student)}
                            className="text-green-600 hover:text-green-800 p-1.5 rounded-full hover:bg-green-50 transition-colors"
                          >
                            <Check size={18} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {searchStudentTerm ? 'No matching students found' : 'Search for students to add'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin-classrooms')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.subject || !formData.gradeLevel || !formData.teacher}
                className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Classroom'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClassroom;