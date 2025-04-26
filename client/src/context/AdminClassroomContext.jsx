import axios from 'axios'

const API_URL = 'http://localhost:5000/api/admin/classrooms';

const getAllClassrooms = async (searchTerm = '', page = 1, limit = 10) => {
    const response = await axios.get(API_URL, {
      params: {
        search: searchTerm,
        page,
        limit
      }
    });
    return response.data;
  };
  
  // Get classroom details
  const getClassroomById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  };
  
  // Create classroom
  const createClassroom = async (classroomData) => {
    const response = await axios.post(API_URL, classroomData);
    return response.data;
  };
  
  // Update classroom
  const updateClassroom = async (id, classroomData) => {
    const response = await axios.put(`${API_URL}/${id}`, classroomData);
    return response.data;
  };
  
  // Delete classroom
  const deleteClassroom = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  };
  
  // Get available students
  const getAvailableStudents = async (id, searchTerm = '') => {
    const response = await axios.get(`${API_URL}/${id}/available-students`, {
      params: { search: searchTerm }
    });
    return response.data;
  };
  
  // Add student to classroom
  const addStudentToClassroom = async (id, studentId) => {
    const response = await axios.post(`${API_URL}/${id}/students`, { studentId });
    return response.data;
  };
  
  // Remove student from classroom
  const removeStudentFromClassroom = async (id, studentId) => {
    const response = await axios.delete(`${API_URL}/${id}/students/${studentId}`);
    return response.data;
  };
  
  // Get classroom performance
  const getClassroomPerformance = async (id) => {
    const response = await axios.get(`${API_URL}/${id}/performance`);
    return response.data;
  };
  
  const classroomService = {
    getAllClassrooms,
    getClassroomById,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    getAvailableStudents,
    addStudentToClassroom,
    removeStudentFromClassroom,
    getClassroomPerformance
  };
  
  export default classroomService;