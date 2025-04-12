import React, { useState } from 'react';
import { Tabs, Card, Form, Input, Button, Switch, Select, Divider, notification, Upload } from 'antd';
import { 
  SettingOutlined, 
  UserOutlined, 
  LockOutlined, 
  NotificationOutlined, 
  MailOutlined,
  CloudUploadOutlined,
  SecurityScanOutlined
} from '@ant-design/icons';
import AdminHeader from './Dashboardpages/AdminHeader';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const AdminSettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [fileList, setFileList] = useState([]);

  const onFinish = (values) => {
    setLoading(true);
    console.log('Settings values:', values);
    setTimeout(() => {
      notification.success({
        message: 'Settings Updated',
        description: 'Your changes have been saved successfully.'
      });
      setLoading(false);
    }, 1500);
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <div className="min-h-screen bg-[#ECE7CA]">
      <AdminHeader />
      
      <div className="container pt-20 pl-32 mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          <SettingOutlined className="mr-2" />
          System Settings
        </h1>

        <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            tabPosition="left"
            className="settings-tabs"
          >
            {/* General Settings Tab */}
            <TabPane
              tab={
                <span>
                  <SettingOutlined />
                  General
                </span>
              }
              key="general"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  siteName: "EduAdmin",
                  timezone: "UTC",
                  maintenance: false
                }}
              >
                <div className="max-w-2xl">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h2>
                  <Form.Item
                    name="siteName"
                    label="Application Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Your school/organization name" />
                  </Form.Item>

                  <Form.Item
                    name="logo"
                    label="Application Logo"
                  >
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleUploadChange}
                      accept="image/*"
                      beforeUpload={() => false} // Prevent auto upload
                    >
                      {fileList.length < 1 && (
                        <div>
                          <CloudUploadOutlined className="text-2xl" />
                          <div className="mt-2">Upload Logo</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    name="timezone"
                    label="Default Timezone"
                  >
                    <Select>
                      <Option value="UTC">UTC</Option>
                      <Option value="EST">Eastern Time (EST)</Option>
                      <Option value="PST">Pacific Time (PST)</Option>
                      <Option value="CET">Central European Time (CET)</Option>
                    </Select>
                  </Form.Item>

                  <Divider />

                  <h2 className="text-lg font-semibold text-gray-700 mb-4">System Mode</h2>
                  <Form.Item
                    name="maintenance"
                    label="Maintenance Mode"
                    valuePropName="checked"
                  >
                    <Switch 
                      checkedChildren="ON" 
                      unCheckedChildren="OFF" 
                    />
                  </Form.Item>

                  <Form.Item
                    name="maintenanceMessage"
                    label="Maintenance Message"
                  >
                    <TextArea rows={3} placeholder="Message to show during maintenance" />
                  </Form.Item>
                </div>
              </Form>
            </TabPane>

            {/* User Management Tab */}
            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  Users
                </span>
              }
              key="users"
            >
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">User Registration</h2>
                <Form layout="vertical">
                  <Form.Item
                    label="Allow Public Registration"
                    name="publicRegistration"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    label="Default User Role"
                    name="defaultRole"
                  >
                    <Select>
                      <Option value="teacher">Teacher</Option>
                      <Option value="student">Student</Option>
                      <Option value="parent">Parent</Option>
                    </Select>
                  </Form.Item>

                  <Divider />

                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Password Policy</h2>
                  <Form.Item
                    label="Minimum Password Length"
                    name="minPasswordLength"
                  >
                    <Input type="number" min="6" defaultValue="8" />
                  </Form.Item>

                  <Form.Item
                    label="Require Special Characters"
                    name="requireSpecialChar"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Form>
              </div>
            </TabPane>

            {/* Notification Settings Tab */}
            <TabPane
              tab={
                <span>
                  <NotificationOutlined />
                  Notifications
                </span>
              }
              key="notifications"
            >
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Email Notifications</h2>
                <Form layout="vertical">
                  <Form.Item
                    label="System Email Address"
                    name="systemEmail"
                  >
                    <Input prefix={<MailOutlined />} placeholder="noreply@yourschool.edu" />
                  </Form.Item>

                  <Form.Item
                    label="Email Notifications Enabled"
                    name="emailNotifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Divider />

                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Notification Types</h2>
                  <Form.Item
                    label="New User Registration"
                    name="notifyNewUser"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    label="Assignment Submissions"
                    name="notifyAssignments"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    label="System Updates"
                    name="notifyUpdates"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Form>
              </div>
            </TabPane>

            {/* Security Settings Tab */}
            <TabPane
              tab={
                <span>
                  <SecurityScanOutlined />
                  Security
                </span>
              }
              key="security"
            >
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Login Security</h2>
                <Form layout="vertical">
                  <Form.Item
                    label="Enable Two-Factor Authentication"
                    name="twoFactorAuth"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    label="Failed Login Attempts Before Lockout"
                    name="loginAttempts"
                  >
                    <Input type="number" min="1" defaultValue="5" />
                  </Form.Item>

                  <Form.Item
                    label="Account Lockout Duration (minutes)"
                    name="lockoutDuration"
                  >
                    <Input type="number" min="1" defaultValue="30" />
                  </Form.Item>

                  <Divider />

                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Session Management</h2>
                  <Form.Item
                    label="Session Timeout (minutes)"
                    name="sessionTimeout"
                  >
                    <Input type="number" min="5" defaultValue="30" />
                  </Form.Item>
                </Form>
              </div>
            </TabPane>
          </Tabs>

          <div className="flex justify-end mt-6 border-t pt-4">
            <Button 
              type="default" 
              className="mr-4"
              onClick={() => form.resetFields()}
            >
              Reset Changes
            </Button>
            <Button 
              type="primary" 
              onClick={() => form.submit()}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Settings
            </Button>
          </div>
        </Card>
      </div>

      <style jsx global>{`
        .settings-tabs .ant-tabs-tab {
          padding: 12px 24px !important;
          margin: 0 0 8px 0 !important;
        }
        .settings-tabs .ant-tabs-tab-active {
          background-color: #f0f7ff;
          border-radius: 4px;
        }
        .settings-tabs .ant-tabs-ink-bar {
          display: none;
        }
        .settings-tabs .ant-tabs-nav-list {
          padding: 8px 0;
        }
      `}</style>
    </div>
  );
};

export default AdminSettingsPage;