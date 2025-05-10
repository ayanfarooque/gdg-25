import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserGraduate, FaLock, FaArrowLeft, FaIdCard, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentContext } from "../../context/StudentContext";

function StudentAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { setstoken } = useContext(StudentContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/students/login", { 
        email, 
        password 
      });

      if (response.data.token) {
        // Success - save token and redirect
        localStorage.setItem("sToken", response.data.token);
        setstoken(response.data.token);
        toast.success("Login successful! Redirecting...");
        
        // Short delay for toast to be visible
        setTimeout(() => {
          navigate("/Stu-Dash");
        }, 1000);
      } else {
        // No token in response
        toast.error(response.data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Show appropriate error messages based on response
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Invalid email or password");
        } else if (error.response.status === 404) {
          toast.error("Student account not found");
        } else {
          toast.error(error.response.data.message || "Login failed. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
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
      const response = await axios.post("http://localhost:5000/api/students/register", {
        name,
        email,
        studentId,
        password
      });

      if (response.data.success) {
        toast.success("Account created successfully! Please login.");
        setActiveTab("login");
      } else {
        toast.error(response.data.message || "Registration failed");
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
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-[#49ABB0] to-[#21294F] flex items-center justify-center p-4">
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
          <div className="bg-[#49ABB0] p-6 text-center">
            <FaUserGraduate className="text-5xl text-white mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-white">Student Portal</h1>
            <p className="text-white opacity-90 mt-1">
              {activeTab === "login" ? "Access your learning resources" : "Join our learning community"}
            </p>
          </div>

          <div className="flex border-b">
            <button
              className={`flex-1 py-4 font-medium ${activeTab === "login" ? "text-[#49ABB0] border-b-2 border-[#49ABB0]" : "text-gray-500"}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 font-medium ${activeTab === "signup" ? "text-[#49ABB0] border-b-2 border-[#49ABB0]" : "text-gray-500"}`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label className="block text-gray-700 mb-2">Student Email</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABB0] focus:border-transparent"
                    placeholder="student@university.edu"
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
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABB0] focus:border-transparent"
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
                    className="w-4 h-4 text-[#49ABB0] rounded focus:ring-[#49ABB0]"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-[#49ABB0] hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#49ABB0] hover:bg-[#3a8a8f] text-white py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Logging in..." : "Login to Student Portal"}
              </button>

              <p className="mt-6 text-center text-gray-600">
                New student?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="text-[#49ABB0] font-medium hover:underline"
                >
                  Create account
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABB0] focus:border-transparent"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Student Email</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABB0] focus:border-transparent"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Student ID</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABB0] focus:border-transparent"
                    placeholder="20230001"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
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
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABB0] focus:border-transparent"
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
                    className="w-full text-black pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#49ABB0] focus:border-transparent"
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
                className={`w-full bg-[#49ABB0] hover:bg-[#3a8a8f] text-white py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating Account..." : "Create Student Account"}
              </button>

              <p className="mt-6 text-center text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-[#49ABB0] font-medium hover:underline"
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

export default StudentAuth;