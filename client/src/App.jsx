import React, { useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import StudentPage from './pages/StudentPage';
import TestPage from './pages/TestPage';
import Sidebar from './components/Dashboardcomponents/Sidebar';
import AssignmentPage from './pages/AssignmentPage';
import ResourcePage from './pages/ResourcePage';
import NewsDetail from './components/NewsResourcesComponent/NewsDetail';
import TeacherAssignment from './pages/TeacherAssignment';
import StatusPage from './pages/StatusPage';
import TeachersCommunityPage from './pages/TeachersCommunityPage';
import LoginSelection from './pages/LoginSelection';
import TeacherHomePage from './pages/TeacherHomePage';
import OverviewPage from './pages/Dashboardpages/OverviewPage';
import Chatbot from './pages/Chatbot';
import TeachersOverview from './pages/TeacherPages/TeachersOverview';
import Profile from './pages/Profile';
import FacResource from '../src/pages/FacResource';
import StudentCommunity from './pages/StudentCommunity';
import StudentAuth from './pages/tssisu/StudentAuth';
import TeacherAuth from './pages/tssisu/TeacherAuth';
import FacChatbot from './pages/FacChatbot';
import AssignmentCreation from './pages/AssignmentCreation';
import ViewAll from './pages/ViewAll';
import AssignmentDetail from './pages/AssignmentDetail';
import TestPerformance from './pages/TestPerformance';
import DetailedReview from './pages/DetailedReview';
import StudentClassroom from './pages/StudentClassroom';
import TeacherClassroom from './pages/TeacherClassroom';
import AITestCreator from './pages/AITestCreator';
import AIGradeCardGenerator from './pages/AIGradeCardGenerator';
import AdminAuth from './pages/tssisu/AdminAuth';
import AdminDashBoard from './pages/AdminDashBoard';
import Classroom from './pages/Classroom';
import Adminstupage from './pages/Adminstupage';
import Admintechpage from './pages/Admintechpage';
import ClassroomDetail from './pages/ClassroomDetail';
import CreateClassroom from './pages/CreateClssroom';
import AddTeacherPage from './pages/AddTeacherPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ClassroomPage from './pages/ClassroomPage'
import StudentCreatePostPage from './pages/StudentCreatePostPage';
import TeacherCreatePostPage from './pages/TeacherCreatePostPage';

const App = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
   // navigate(selectedRole === 'teacher' ? '/authteacher' : '/authstudent');
   if(selectedRole === 'teacher'){
    navigate('/authteacher')
   }else if(selectedRole === 'student'){
    navigate('/authstudent')
   }else{
    navigate('authadmin')
   }
  };

  return (
    <div className="flex h-screen w-full bg-[#ECE7CA] text-gray-100">
      {/* Hide Sidebar on the Login page ("/") */}
      {location.pathname !== '/' && location.pathname !== '/authstudent' && location.pathname !== '/authteacher' && location.pathname !== '/authadmin' &&  <Sidebar role={role} />}

      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<LoginSelection onSelect={handleRoleSelection} />} />
          <Route path="/Stu-Dash" element={<OverviewPage />} />
          <Route path="/student-home" element={<StudentPage />} />
          <Route path="/chat-page" element={<Chatbot />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/Assignment" element={<AssignmentPage />} />
          <Route path="/Resources" element={<ResourcePage />} />
          <Route path="/teacher-resource" element={<FacResource />} />
          <Route path="/news/:newsId" element={<NewsDetail />} />
          <Route path="/teacher-Assignment" element={<TeacherAssignment />} />
          <Route path="/status-page" element={<StatusPage />} />
          <Route path="/teachers-Community" element={<TeachersCommunityPage />} />
          <Route path="/Community" element={<StudentCommunity />} />
          <Route path="/teacher-home" element={<TeachersOverview />} />
          <Route path="/prev" element={<TeacherHomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/authstudent' element={<StudentAuth />} />
          <Route path='/authteacher' element={<TeacherAuth />} />
          <Route path='/facchat' element={<FacChatbot />} />
          <Route path='/createassignment' element={<AssignmentCreation />} />
          <Route path='/viewall' element={<ViewAll />} />
          <Route path="/assignments/:assignmentId" element={<AssignmentDetail />} />
          <Route path="/test-performance/:testCode" element={<TestPerformance />} />
          <Route path="/detailed-review" element={<DetailedReview />} />
          <Route path='/student-classroom' element={<StudentClassroom />} />
          <Route path='student-classroom/:id' element={<ClassroomPage/>} />
          <Route path='/teacher-classroom' element={<TeacherClassroom />} />
          <Route path='/create-test' element={<AITestCreator />} />
          <Route path='/generate-reportcard' element={<AIGradeCardGenerator />} />
          <Route path='/authadmin' element={<AdminAuth />} />
          <Route path='/admin-dashboard' element={<AdminDashBoard />} />
          <Route path='/admin-classrooms' element={<Classroom />} />
          <Route path='/admin-students' element={<Adminstupage />} />
          <Route path='/admin-teachers' element={<Admintechpage />} />
          <Route path="/admin-classrooms/create" element={<CreateClassroom />} />
          <Route path="/admin-classrooms/:id" element={<ClassroomDetail />} />
          <Route path='/add-teacher' element={<AddTeacherPage />} />
          <Route path='/admin-settings' element={<AdminSettingsPage />} />
          <Route path="/student-create-post" element={<StudentCreatePostPage/>} />
          <Route path="/teacher-create-post" element={<TeacherCreatePostPage/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
