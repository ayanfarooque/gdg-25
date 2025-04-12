import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCog, FaLock, FaArrowLeft, FaIdCard, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function AdminAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    adminId: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Admin login:", loginData);
    navigate("/admin-dashboard");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    console.log("Admin signup:", signupData);
    navigate("/admin-dashboard");
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-300 mb-6 hover:text-white hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to selection
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700"
        >
          <div className="bg-black p-6 text-center">
            <FaUserCog className="text-5xl text-white mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-300 mt-1">
              {activeTab === "login" ? "Access the administration panel" : "Create new admin account"}
            </p>
          </div>

          <div className="flex border-b border-gray-700">
            <button
              className={`flex-1 py-4 font-medium ${activeTab === "login" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 font-medium ${activeTab === "signup" ? "text-white border-b-2 border-white" : "text-gray-400"}`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-md">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label className="block text-gray-300 mb-2">Admin Email</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
                    placeholder="admin@university.edu"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
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
                    className="w-4 h-4 text-black rounded focus:ring-white"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-gray-300 hover:text-white hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-900 text-white py-3 px-4 rounded-lg font-medium transition duration-200 border border-gray-700"
                onClick={() => (navigate('/admin-dashboard'))}
              >
                Login to Admin Portal
              </button>

              <p className="mt-6 text-center text-gray-400">
                New admin?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="text-white font-medium hover:underline"
                >
                  Request access
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-900 text-red-100 rounded-md">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
                    placeholder="Admin Name"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Admin Email</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
                    placeholder="admin@university.edu"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Admin ID</label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
                    placeholder="ADM-001"
                    value={signupData.adminId}
                    onChange={(e) => setSignupData({...signupData, adminId: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white"
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
                className="w-full bg-black hover:bg-gray-900 text-white py-3 px-4 rounded-lg font-medium transition duration-200 border border-gray-700"
              >
                Request Admin Access
              </button>

              <p className="mt-6 text-center text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-white font-medium hover:underline"
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

export default AdminAuth;