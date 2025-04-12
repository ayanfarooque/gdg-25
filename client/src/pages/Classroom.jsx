import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Users, 
  BookOpen, 
  BarChart2,
  Edit,
  Trash2
} from 'lucide-react';
import AdminHeader from './Dashboardpages/AdminHeader';

const classroom = () => {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchClassrooms = async () => {
      try {
        // In real app, replace with actual API call
        const mockClassrooms = [
          { id: '1', name: 'Mathematics 101', teacher: 'John Smith', students: 25, subject: 'Mathematics', gradeLevel: '10' },
          { id: '2', name: 'Science 201', teacher: 'Sarah Johnson', students: 30, subject: 'Science', gradeLevel: '11' },
          { id: '3', name: 'English 301', teacher: 'Michael Brown', students: 22, subject: 'English', gradeLevel: '12' },
        ];
        setClassrooms(mockClassrooms);
      } catch (error) {
        console.error("Failed to fetch classrooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    // In real app, add confirmation dialog and API call
    setClassrooms(classrooms.filter(c => c.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#ECE7CA] text-black min-h-screen">
      <AdminHeader />
      <div className="max-w-7xl pt-20 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Classroom Management</h1>
            <p className="text-gray-600">Manage all classrooms and their performance</p>
          </div>
          <button
            onClick={() => navigate('/admin-classrooms/create')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            <PlusCircle size={20} />
            Create New Classroom
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by name, teacher or subject..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredClassrooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No classrooms found</p>
              <button 
                onClick={() => navigate('/admin-classrooms/create')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Create your first classroom
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClassrooms.map((classroom) => (
                <div 
                  key={classroom.id} 
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/admin-classrooms/${classroom.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {classroom.name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {classroom.subject} • Grade {classroom.gradeLevel}
                      </p>
                      <p className="text-gray-500 flex items-center gap-1">
                        <Users size={16} className="text-blue-500" />
                        <span>{classroom.teacher}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-md transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          //navigate(`/admin-classrooms/${classroom.id}/edit`);
                        }}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-md transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(classroom.id);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-500">
                      <BookOpen size={16} className="text-green-500" />
                      <span>{classroom.students} students</span>
                    </div>
                    <button 
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin-classrooms/${classroom.id}/performance`);
                      }}
                    >
                      <BarChart2 size={16} />
                      Performance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default classroom;