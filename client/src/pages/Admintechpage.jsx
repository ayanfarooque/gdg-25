import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Table, Tag, Card, Statistic, Row, Col, Select, DatePicker, Button } from 'antd';
import { UserOutlined, StarOutlined, FileOutlined, PlusOutlined } from '@ant-design/icons';
import AdminHeader from './Dashboardpages/AdminHeader';

const { Option } = Select;
const { RangePicker } = DatePicker;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Admintechpage = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('monthly');
  const [dateRange, setDateRange] = useState([]);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    activeTeachers: 0,
    assignmentsCreated: 0,
    topPerformers: []
  });

  // Dummy data for teachers
  const dummyTeachers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      subjects: ['Math', 'Physics'],
      status: 'active',
      assignments: 42,
      rating: 4.8,
      joinedDate: '2022-01-15',
      isTopPerformer: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      subjects: ['English', 'Literature'],
      status: 'active',
      assignments: 38,
      rating: 4.7,
      joinedDate: '2022-03-10',
      isTopPerformer: true
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      subjects: ['History', 'Social Studies'],
      status: 'active',
      assignments: 29,
      rating: 4.5,
      joinedDate: '2022-02-22'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      subjects: ['Biology', 'Chemistry'],
      status: 'active',
      assignments: 35,
      rating: 4.6,
      joinedDate: '2022-04-05',
      isTopPerformer: true
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'robert.w@example.com',
      subjects: ['Computer Science'],
      status: 'inactive',
      assignments: 18,
      rating: 4.2,
      joinedDate: '2022-05-12'
    },
    {
      id: 6,
      name: 'Lisa Thompson',
      email: 'lisa.t@example.com',
      subjects: ['Art', 'Music'],
      status: 'active',
      assignments: 27,
      rating: 4.4,
      joinedDate: '2022-06-18'
    }
  ];

  // Dummy statistics
  const dummyStats = {
    totalTeachers: 6,
    activeTeachers: 5,
    assignmentsCreated: 189,
    topPerformers: dummyTeachers.filter(teacher => teacher.isTopPerformer)
  };

  // Dummy chart data
  const registrationData = [
    { name: 'Jan', count: 12 },
    { name: 'Feb', count: 19 },
    { name: 'Mar', count: 8 },
    { name: 'Apr', count: 15 },
    { name: 'May', count: 11 },
    { name: 'Jun', count: 9 },
  ];

  const assignmentData = [
    { name: 'Math', value: 35 },
    { name: 'Science', value: 28 },
    { name: 'History', value: 22 },
    { name: 'English', value: 15 },
  ];

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setTeachers(dummyTeachers);
      setStats(dummyStats);
      setLoading(false);
    }, 500);
  }, [timeRange, dateRange]);

  const handleAddTeacher = () => {
    navigate('/add-teacher');
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <span className="font-medium">{text}</span>
          {record.isTopPerformer && <StarOutlined className="ml-2 text-yellow-400" />}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: email => <span className="text-blue-600">{email}</span>
    },
    {
      title: 'Subjects',
      dataIndex: 'subjects',
      key: 'subjects',
      render: subjects => (
        <div className="flex flex-wrap gap-1">
          {subjects.map(subject => (
            <Tag color="blue" key={subject} className="m-0">
              {subject}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'active' ? 'green' : 'red'} className="font-medium">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Assignments',
      dataIndex: 'assignments',
      key: 'assignments',
      sorter: (a, b) => a.assignments - b.assignments,
      render: assignments => <span className="font-semibold">{assignments}</span>
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      render: rating => (
        <div className="flex items-center">
          <span className="font-semibold">{rating}</span>
          <span className="text-gray-500 ml-1">/5</span>
        </div>
      ),
    },
    {
      title: 'Joined Date',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
      render: date => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#ECE7CA]">
      <AdminHeader />
      
      <div className="container pt-20 pl-32 mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Teacher Management</h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddTeacher}
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            Add Teacher
          </Button>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
            <Statistic
              title={<span className="text-gray-600">Total Teachers</span>}
              value={stats.totalTeachers}
              prefix={<UserOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3f8600' }}
              className="p-2"
            />
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
            <Statistic
              title={<span className="text-gray-600">Active Teachers</span>}
              value={stats.activeTeachers}
              prefix={<UserOutlined className="text-green-500" />}
              valueStyle={{ color: '#3f8600' }}
              className="p-2"
            />
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
            <Statistic
              title={<span className="text-gray-600">Assignments Created</span>}
              value={stats.assignmentsCreated}
              prefix={<FileOutlined className="text-purple-500" />}
              valueStyle={{ color: '#3f8600' }}
              className="p-2"
            />
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
            <Statistic
              title={<span className="text-gray-600">Top Performers</span>}
              value={stats.topPerformers.length}
              prefix={<StarOutlined className="text-yellow-500" />}
              valueStyle={{ color: '#3f8600' }}
              className="p-2"
            />
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm hover:shadow-md transition-shadow mb-6 border-0">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <Select 
                defaultValue="monthly" 
                className="w-40"
                onChange={setTimeRange}
              >
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <RangePicker 
                onChange={(dates) => setDateRange(dates)} 
                className="w-64"
              />
            </div>
            <Button 
              type="default" 
              className="ml-auto"
              onClick={() => {
                setTimeRange('monthly');
                setDateRange([]);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card 
            title={<span className="font-semibold text-gray-700">Teacher Registrations</span>} 
            className="shadow-sm hover:shadow-md transition-shadow border-0"
            extra={<Tag color="blue" className="font-medium">Last 6 Months</Tag>}
          >
            <div className="w-full h-64">
              <BarChart
                width={500}
                height={300}
                data={registrationData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="count" 
                  fill="#8884d8" 
                  name="Registrations" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </div>
          </Card>
          <Card 
            title={<span className="font-semibold text-gray-700">Assignments by Subject</span>} 
            className="shadow-sm hover:shadow-md transition-shadow border-0"
            extra={<Tag color="purple" className="font-medium">Current Year</Tag>}
          >
            <div className="w-full h-64">
              <PieChart width={500} height={300}>
                <Pie
                  data={assignmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {assignmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </div>
          </Card>
        </div>

        {/* Top Performers Section */}
        <Card 
          title={<span className="font-semibold text-gray-700">Top Performing Teachers</span>} 
          className="shadow-sm hover:shadow-md transition-shadow mb-6 border-0"
          extra={<Tag color="gold" className="font-medium">Based on Ratings</Tag>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.topPerformers.map((teacher, index) => (
              <Card 
                key={teacher.id}
                hoverable
                className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:border-blue-300 hover:shadow-md"
                actions={[
                  <div className="flex justify-center items-center p-2">
                    <span className="font-semibold">{teacher.rating}</span>
                    <StarOutlined className="text-yellow-400 ml-1" />
                  </div>,
                  <div className="flex justify-center items-center p-2">
                    <span className="font-semibold">{teacher.assignments}</span>
                    <FileOutlined className="text-blue-400 ml-1" />
                  </div>
                ]}
              >
                <div className="flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <UserOutlined className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 m-0">{index + 1}. {teacher.name}</h3>
                      <p className="text-gray-500 text-sm m-0">{teacher.subjects.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Tag color={teacher.status === 'active' ? 'green' : 'red'} className="m-0">
                      {teacher.status.toUpperCase()}
                    </Tag>
                    <Tag color="blue" className="m-0">
                      Joined: {new Date(teacher.joinedDate).toLocaleDateString()}
                    </Tag>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* All Teachers Table */}
        <Card 
          title={<span className="font-semibold text-gray-700">All Teachers</span>} 
          className="shadow-sm hover:shadow-md transition-shadow border-0"
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddTeacher}
              className="bg-blue-600 hover:bg-blue-700 flex items-center"
              size="small"
            >
              Add Teacher
            </Button>
          }
        >
          <Table 
            columns={columns} 
            dataSource={teachers} 
            loading={loading}
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: false,
              className: 'px-4 py-2'
            }}
            scroll={{ x: true }}
            locale={{
              emptyText: loading ? 
                <span className="text-gray-500">Loading teachers...</span> : 
                <span className="text-gray-500">No teachers found</span>
            }}
            className="custom-table"
          />
        </Card>
      </div>

      <style jsx global>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          color: #64748b;
          font-weight: 600;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .custom-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: #f1f5f9 !important;
        }
        .custom-table .ant-pagination-item-active {
          border-color: #3b82f6;
        }
        .custom-table .ant-pagination-item-active a {
          color: #3b82f6;
        }
        .ant-card-head {
          border-bottom: 1px solid #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
};

export default Admintechpage;