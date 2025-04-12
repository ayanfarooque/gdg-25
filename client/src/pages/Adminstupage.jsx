import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  BookOpen,
  BarChart2,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AdminHeader from './Dashboardpages/AdminHeader';

const Adminstupage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with API calls in real application
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockStudents = [
          { id: 1, name: 'Alice Johnson', grade: '10', email: 'alice@school.edu', performance: 95, assignmentsCompleted: 12, status: 'active' },
          { id: 2, name: 'Bob Smith', grade: '11', email: 'bob@school.edu', performance: 88, assignmentsCompleted: 10, status: 'active' },
          { id: 3, name: 'Charlie Brown', grade: '10', email: 'charlie@school.edu', performance: 92, assignmentsCompleted: 11, status: 'active' },
          { id: 4, name: 'Diana Prince', grade: '12', email: 'diana@school.edu', performance: 78, assignmentsCompleted: 8, status: 'active' },
          { id: 5, name: 'Ethan Hunt', grade: '11', email: 'ethan@school.edu', performance: 85, assignmentsCompleted: 9, status: 'active' },
          { id: 6, name: 'Fiona Green', grade: '10', email: 'fiona@school.edu', performance: 90, assignmentsCompleted: 12, status: 'inactive' },
          { id: 7, name: 'George Wilson', grade: '12', email: 'george@school.edu', performance: 82, assignmentsCompleted: 7, status: 'active' },
          { id: 8, name: 'Hannah Baker', grade: '11', email: 'hannah@school.edu', performance: 94, assignmentsCompleted: 12, status: 'active' },
        ];
        
        setStudents(mockStudents);
        setFilteredStudents(mockStudents);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter and search students
  useEffect(() => {
    let result = students;
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(student => student.status === activeFilter);
    }
    
    // Apply search
    if (searchTerm) {
      result = result.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStudents(result);
  }, [searchTerm, activeFilter, students]);

  // Sorting functionality
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...filteredStudents];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredStudents, sortConfig]);

  // Chart data
  const enrollmentData = [
    { name: 'Jan', students: 15 },
    { name: 'Feb', students: 22 },
    { name: 'Mar', students: 18 },
    { name: 'Apr', students: 25 },
    { name: 'May', students: 30 },
    { name: 'Jun', students: 28 },
  ];

  const assignmentData = [
    { name: 'Jan', assignments: 120 },
    { name: 'Feb', assignments: 210 },
    { name: 'Mar', assignments: 180 },
    { name: 'Apr', assignments: 250 },
    { name: 'May', assignments: 300 },
    { name: 'Jun', assignments: 280 },
  ];

  const performanceDistribution = [
    { name: '90-100%', value: students.filter(s => s.performance >= 90).length },
    { name: '80-89%', value: students.filter(s => s.performance >= 80 && s.performance < 90).length },
    { name: '70-79%', value: students.filter(s => s.performance >= 70 && s.performance < 80).length },
    { name: 'Below 70%', value: students.filter(s => s.performance < 70).length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Top performers (top 3 by performance)
  const topPerformers = [...students]
    .sort((a, b) => b.performance - a.performance)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#ECE7CA] min-h-screen">
      <AdminHeader />
      <div className="max-w-7xl pt-20 mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Management</h1>
        <p className="text-black mb-6">View and manage all students in the application</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Total Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{students.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Active Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Avg. Performance</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {students.length > 0 
                    ? (students.reduce((sum, student) => sum + student.performance, 0) / students.length).toFixed(1) + '%'
                    : '0%'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BarChart2 className="text-purple-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Avg. Assignments</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {students.length > 0 
                    ? (students.reduce((sum, student) => sum + student.assignmentsCompleted, 0) / students.length).toFixed(1)
                    : '0'}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <BookOpen className="text-yellow-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Enrollment Trend Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Enrollment Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Assignments Submitted Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignments Submitted</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assignmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="assignments" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Distribution Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((student, index) => (
              <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{student.name}</h4>
                    <p className="text-sm text-black">Grade {student.grade}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-black">Performance</p>
                    <p className="font-semibold text-gray-800">{student.performance}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-black">Assignments</p>
                    <p className="font-semibold text-gray-800">{student.assignmentsCompleted}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800">All Students ({filteredStudents.length})</h3>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-black" size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="pl-10 pr-4 text-black py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="border text-black border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                    <Filter size={16} className="text-gray-600" />
                    <span className="hidden text-black md:inline">Filter</span>
                  </button>
                  <button className="flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
                    <Download size={16} className="text-gray-600" />
                    <span className="hidden text-black md:inline">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Email
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('grade')}
                  >
                    <div className="flex items-center gap-1">
                      Grade
                      {sortConfig.key === 'grade' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('performance')}
                  >
                    <div className="flex items-center gap-1">
                      Performance
                      {sortConfig.key === 'performance' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('assignmentsCompleted')}
                  >
                    <div className="flex items-center gap-1">
                      Assignments
                      {sortConfig.key === 'assignmentsCompleted' && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStudents.length > 0 ? (
                  sortedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                            {student.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        Grade {student.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                student.performance >= 90 ? 'bg-green-500' :
                                student.performance >= 80 ? 'bg-blue-500' :
                                student.performance >= 70 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${student.performance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {student.performance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {student.assignmentsCompleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-black">
                      No students found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminstupage;