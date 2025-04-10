import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import TeacherContextProvider from './context/TeacherContext.jsx'
import StudentContextProvider from './context/StudentContext.jsx'
import { ToastContainer } from 'react-toastify'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ToastContainer />
  <TeacherContextProvider>
    <StudentContextProvider>
    <App />
    </StudentContextProvider>
  </TeacherContextProvider>
  </BrowserRouter>
  
)
