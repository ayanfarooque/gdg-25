import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter as Router } from "react-router-dom";
import { RoleProvider } from './context/RoleContext.jsx'
import StudentContextProvider from './context/StudentContext.jsx';
import TeacherContextProvider from './context/TeacherContext.jsx';
createRoot(document.getElementById('root')).render(
  <Router>
  <RoleProvider>
    <StudentContextProvider>
      <TeacherContextProvider>
         <App />
      </TeacherContextProvider>
    </StudentContextProvider>
  </RoleProvider>
  </Router>
  
)
