import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Users,
  BookOpen,
  BarChart2,
  Edit,
  User,
  PlusCircle,
  Trash2
} from 'lucide-react';
import AdminHeader from './Dashboardpages/AdminHeader';

const ClassroomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call to fetch classroom details
    const fetchClassroom = async () => {
      try {
        // Mock data - replace with actual API call
        const mockClassroom = {
          id: '1',
          name: 'Mathematics 101',
          teacher: { id: 't1', name: 'John Smith' },
          subject: 'Mathematics',
          gradeLevel: '10',
          students: [
            { id: 's1', name: 'Alice Johnson', grade: '10' },
            { id: 's2', name: 'Bob Smith', grade: '10' },
            { id: 's3', name: 'Charlie Brown', grade: '10' },
          ],
          performance: {
            averageScore: 85,
            assignmentsCompleted: 12,
            topStudents: ['Alice Johnson', 'Bob Smith']
          }
        };
        
        setClassroom(mockClassroom);
        
        // Fetch available students (not already in class)
        const mockStudents = [
          { id: 's4', name: 'Diana Prince', grade: '10' },
          { id: 's5', name: 'Ethan Hunt', grade: '10' },
        ];
        setAvailableStudents(mockStudents);
      } catch (error) {
        console.error("Failed to fetch classroom:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassroom();
  }, [id]);

  const handleAddStudents = (student) => {
    // In real app, this would be an API call
    setClassroom(prev => ({
      ...prev,
      students: [...prev.students, student]
    }));
    setAvailableStudents(prev => prev.filter(s => s.id !== student.id));
  };

  const handleRemoveStudent = (studentId) => {
    // In real app, this would be an API call
    const studentToRemove = classroom.students.find(s => s.id === studentId);
    setClassroom(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== studentId)
    }));
    setAvailableStudents(prev => [...prev, studentToRemove]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!classroom) {
    return <div className="text-center py-12">Classroom not found</div>;
  }

  return (
    <div className="bg-[#ECE7CA] text-black min-h-screen">
        <AdminHeader />
      <div className="max-w-6xl pt-20 mx-auto p-6">
        <button
          onClick={() => navigate('/admin-classrooms')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Classrooms
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{classroom.name}</h2>
                <p className="text-gray-600">
                  {classroom.subject} • Grade {classroom.gradeLevel} • Taught by {classroom.teacher.name}
                </p>
              </div>
              <button
                onClick={() => navigate(`/admin-classrooms/${id}/edit`)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={18} />
                Edit Classroom
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users size={16} />
                Students
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'performance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart2 size={16} />
                Performance
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'students' ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Students ({classroom.students.length})
                  </h3>
                  <button
                    onClick={() => setShowAddStudents(!showAddStudents)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <PlusCircle size={16} />
                    {showAddStudents ? 'Cancel' : 'Add Students'}
                  </button>
                </div>

                {showAddStudents && (
                  <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Students</h4>
                    <div className="relative mb-4">
                      <input
                        type="text"
                        placeholder="Search available students..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <User size={16} className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    {availableStudents.length > 0 ? (
                      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                        {availableStudents
                          .filter(student => 
                            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.grade.includes(searchTerm)
                          )
                          .map(student => (
                            <li key={student.id} className="p-3 hover:bg-gray-100 transition-colors">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="bg-blue-100 p-1.5 rounded-full">
                                    <User size={14} className="text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">{student.name}</p>
                                    <p className="text-sm text-gray-500">Grade {student.grade}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleAddStudents(student)}
                                  className="text-green-600 hover:text-green-800 px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                                >
                                  Add
                                </button>
                              </div>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No available students to add</p>
                    )}
                  </div>
                )}

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {classroom.students.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {classroom.students.map(student => (
                        <li key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
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
                              onClick={() => handleRemoveStudent(student.id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No students in this classroom yet</p>
                      <button
                        onClick={() => setShowAddStudents(true)}
                        className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Add students
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Classroom Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <p className="text-sm font-medium text-blue-800 mb-1">Average Score</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {classroom.performance.averageScore}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                    <p className="text-sm font-medium text-green-800 mb-1">Assignments Completed</p>
                    <p className="text-3xl font-bold text-green-600">
                      {classroom.performance.assignmentsCompleted}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                    <p className="text-sm font-medium text-purple-800 mb-1">Top Students</p>
                    <ul className="mt-2 space-y-1">
                      {classroom.performance.topStudents.map((student, index) => (
                        <li key={index} className="text-purple-600 font-medium">
                          {student}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Performance Over Time</h4>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    [Performance chart would be displayed here]
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetail;