import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaLock, FaArrowLeft, FaIdCard, FaUser, FaUserTie } from "react-icons/fa";
import { MdEmail, MdSchool } from "react-icons/md";

function TeacherAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    facultyId: "",
    department: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Teacher login:", loginData);
    navigate("/teacher/dashboard");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    console.log("Teacher signup:", signupData);
    navigate("/teacher/dashboard");
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-[#E195AB] to-[#21294F] flex items-center justify-center p-4">
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
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
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
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
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
                className="w-full bg-[#E195AB] hover:bg-[#c97f96] text-white py-3 px-4 rounded-lg font-medium transition duration-200"
                onClick={() => (navigate('/teacher-home'))}
              >
                Login to Faculty Portal
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
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
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
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
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
                    value={signupData.facultyId}
                    onChange={(e) => setSignupData({...signupData, facultyId: e.target.value})}
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
                    value={signupData.department}
                    onChange={(e) => setSignupData({...signupData, department: e.target.value})}
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
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
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
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E195AB] hover:bg-[#c97f96] text-white py-3 px-4 rounded-lg font-medium transition duration-200"
              >
                Request Faculty Access
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