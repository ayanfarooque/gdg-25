import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaLock, FaArrowLeft, FaIdCard, FaUser, FaUserTie } from "react-icons/fa";
import { MdEmail, MdSchool } from "react-icons/md";
import { TeacherContext } from "../../context/TeacherContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function TeacherAuth() {
  // State for active tab
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Signup form state
  const [name, setName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [department, setDepartment] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Navigation and context
  const navigate = useNavigate();
  const { setttoken } = useContext(TeacherContext);
  
  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // First try the correct endpoint
      let response;
      try {
        response = await axios.post("http://localhost:5000/api/teachers/login", { 
          email, 
          password 
        });
      } catch (err) {
        // If the first endpoint fails, try the alternative endpoint
        if (err.response && err.response.status === 404) {
          response = await axios.post("http://localhost:5000/api/teacher/login", { 
            email, 
            password 
          });
        } else {
          throw err;
        }
      }

      if (response.data.token) {
        // Save token and redirect
        localStorage.setItem("tToken", response.data.token);
        setttoken(response.data.token);
        
        toast.success("Login successful! Redirecting...");
        
        // Short delay for the toast to be visible
        setTimeout(() => {
          navigate("/teacher-home");
        }, 1000);
      } else {
        toast.error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      
      // Show appropriate error messages based on response
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Invalid email or password");
          setError("Invalid email or password");
        } else if (error.response.status === 404) {
          toast.error("Teacher account not found");
          setError("Teacher account not found");
        } else {
          toast.error(error.response?.data?.message || "Login failed");
          setError(error.response?.data?.message || "Login failed");
        }
      } else {
        toast.error("Network error. Please check your connection.");
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/teachers/register", {
        name,
        email,
        facultyId,
        department,
        password
      });

      if (response.data.success) {
        toast.success("Access request submitted successfully! An admin will review your request.");
        setActiveTab("login");
      } else {
        toast.error(response.data.message || "Registration failed");
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message || "Invalid registration data");
        } else if (error.response.status === 409) {
          toast.error("Email already in use");
        } else {
          toast.error("Registration failed. Please try again.");
        }
        setError(error.response?.data?.message || "Registration failed");
      } else {
        toast.error("Network error. Please check your connection.");
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-[#E195AB] to-[#21294F] flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-white mb-6 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to selection
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-[#E195AB] p-6 text-center">
            <FaChalkboardTeacher className="text-5xl text-white mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-white">Faculty Portal</h1>
            <p className="text-white opacity-90 mt-1">
              {activeTab === "login" ? "Manage your courses and students" : "Join our faculty network"}
            </p>
          </div>

          <div className="flex border-b">
            <button
              className={`flex-1 py-4 font-medium ${activeTab === "login" ? "text-[#E195AB] border-b-2 border-[#E195AB]" : "text-gray-500"}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 font-medium ${activeTab === "signup" ? "text-[#E195AB] border-b-2 border-[#E195AB]" : "text-gray-500"}`}
              onClick={() => setActiveTab("signup")}
            >
              Request Access
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Institutional Email</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className="w-full text-black pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E195AB] focus:border-transparent"
                    placeholder="faculty@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E195AB] focus:border-transparent"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-[#E195AB] rounded focus:ring-[#E195AB]"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-[#E195AB] hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#E195AB] hover:bg-[#c97f96] text-white py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Logging in..." : "Login to Faculty Portal"}
              </button>

              <p className="mt-6 text-center text-gray-600">
                New faculty member?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="text-[#E195AB] font-medium hover:underline"
                >
                  Request access
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E195AB] focus:border-transparent"
                    placeholder="Dr. Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Institutional Email</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E195AB] focus:border-transparent"
                    placeholder="faculty@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Faculty ID</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E195AB] focus:border-transparent"
                    placeholder="FAC2023001"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Department</label>
                <div className="relative">
                  <MdSchool className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E195AB] focus:border-transparent"
                    placeholder="Computer Science"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E195AB] focus:border-transparent"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E195AB] focus:border-transparent"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#E195AB] hover:bg-[#c97f96] text-white py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Submitting..." : "Request Faculty Access"}
              </button>

              <p className="mt-6 text-center text-gray-600">
                Already have access?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-[#E195AB] font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default TeacherAuth;