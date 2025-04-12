import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, DatePicker, Card, message, Upload } from 'antd';
import { UserOutlined, MailOutlined, BookOutlined, UploadOutlined } from '@ant-design/icons';
import AdminHeader from './Dashboardpages/AdminHeader';

const { Option } = Select;
const { TextArea } = Input;

const AddTeacherPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Teacher data:', values);
      message.success('Teacher added successfully!');
      form.resetFields();
      navigate('/admin-teachers');
    } catch (error) {
      message.error('Failed to add teacher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <div className="min-h-screen bg-[#ECE7CA]">
      <AdminHeader />
      
      <div className="container pt-20 pl-32 mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Teacher</h1>
          <Button 
            type="default" 
            onClick={() => navigate('/admin/teachers')}
            className="border-gray-300"
          >
            Back to Teachers
          </Button>
        </div>

        <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
          <Form
            form={form}
            name="addTeacher"
            onFinish={onFinish}
            layout="vertical"
            className="max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please input first name!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="First Name" />
                  </Form.Item>

                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please input last name!' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Last Name" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please input email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    { required: true, message: 'Please input phone number!' },
                    { pattern: /^[0-9+\- ]+$/, message: 'Please enter a valid phone number!' }
                  ]}
                >
                  <Input placeholder="Phone Number" />
                </Form.Item>

                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                  rules={[{ required: true, message: 'Please select date of birth!' }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  name="profilePhoto"
                  label="Profile Photo"
                >
                  <Upload
                    listType="picture"
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onChange={handleUploadChange}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />}>Upload Photo</Button>
                  </Upload>
                </Form.Item>
              </div>

              {/* Professional Information */}
              <div className="col-span-2">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Professional Information</h2>
                
                <Form.Item
                  name="subjects"
                  label="Subjects"
                  rules={[{ required: true, message: 'Please select at least one subject!' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select subjects"
                    optionLabelProp="label"
                  >
                    <Option value="math" label="Math">
                      <div className="flex items-center">
                        <BookOutlined className="mr-2" /> Math
                      </div>
                    </Option>
                    <Option value="science" label="Science">
                      <div className="flex items-center">
                        <BookOutlined className="mr-2" /> Science
                      </div>
                    </Option>
                    <Option value="english" label="English">
                      <div className="flex items-center">
                        <BookOutlined className="mr-2" /> English
                      </div>
                    </Option>
                    <Option value="history" label="History">
                      <div className="flex items-center">
                        <BookOutlined className="mr-2" /> History
                      </div>
                    </Option>
                    <Option value="computer" label="Computer Science">
                      <div className="flex items-center">
                        <BookOutlined className="mr-2" /> Computer Science
                      </div>
                    </Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="qualification"
                  label="Highest Qualification"
                  rules={[{ required: true, message: 'Please input qualification!' }]}
                >
                  <Input placeholder="e.g., M.Sc, B.Ed, Ph.D" />
                </Form.Item>

                <Form.Item
                  name="experience"
                  label="Years of Experience"
                  rules={[{ required: true, message: 'Please input experience!' }]}
                >
                  <Input type="number" min="0" placeholder="Years" />
                </Form.Item>

                <Form.Item
                  name="joiningDate"
                  label="Joining Date"
                  rules={[{ required: true, message: 'Please select joining date!' }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  name="bio"
                  label="Bio/Introduction"
                >
                  <TextArea rows={4} placeholder="Brief introduction about the teacher..." />
                </Form.Item>
              </div>
            </div>

            <Form.Item className="mt-6">
              <div className="flex justify-end gap-4">
                <Button 
                  onClick={() => navigate('/admin/teachers')}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Teacher
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddTeacherPage;