import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserGraduate, FaLock, FaArrowLeft, FaIdCard, FaUser, FaChalkboardTeacher } from "react-icons/fa";
import { MdEmail, MdDateRange } from "react-icons/md";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentContextProvider, { StudentContext } from "../../context/StudentContext";
function StudentAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  // const [signupData, setSignupData] = useState({
  //   fullName: "",
  //   email: "",
  //   studentId: "",
  //   password: "",
  //   confirmPassword: ""
  // });
  const [email,setemail] = useState("");
  const [password,setpassword] = useState("")
  const [error, setError] = useState("");
  const [name,setname] = useState("")
  const [studentId,setstudentId] = ("")
  const { setstoken, backendUrl } = useContext(StudentContext)
  const navigate = useNavigate();
  // const handleLoginSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Student login:", loginData);
  //   navigate("/student/dashboard");
  // };

  // const handleSignupSubmit = (e) => {
  //   e.preventDefault();
  //   if (signupData.password !== signupData.confirmPassword) {
  //     setError("Passwords don't match");
  //     return;
  //   }
  //   console.log("Student signup:", signupData);
  //   navigate("/student-home");
  // };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Submitting to:", `http://localhost:5000/api/Students/login`);
    console.log("Email:", email, "Password:", password);
     try {
            const response = await axios.post(`http://localhost:5000/api/students/login`, { email, password });
    
            console.log("Full API Response:", response); // Log full response
            console.log("Response Data:", response.data); // Log response data only
    
            if (response.data.token) { // Ensure token exists
                localStorage.setItem("sToken", response.data.token);
                setstoken(response.data.token);
                toast.success("Login successful!");
                navigate("/Stu-Dash");
            } else {
                toast.error(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Error logging in:", error.response?.data || error.message);
            toast.error("An error occurred during login. Please try again.");
        }
  }
  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-[#49ABB0] to-[#21294F] flex items-center justify-center p-4">
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
            <form onSubmit={onSubmitHandler} className="p-8">
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
                    value={email.email}
                    onChange={(e) => setemail(e.target.value)}
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
                    value={password.password}
                    onChange={(e) => setpassword(e.target.value)}
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
                className="w-full bg-[#49ABB0] hover:bg-[#3a8a8f] text-white py-3 px-4 rounded-lg font-medium transition duration-200"
                //onClick={() => (navigate('/student-home'))}
                
              >
                Login to Student Portal
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
            <form onSubmit={onSubmitHandler} className="p-8">
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
                    value={name.fullName}
                    onChange={(e) => setname(e.target.value)}
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
                    value={email.email}
                    onChange={(e) => setemail(e.target.value)}
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
                    value={studentId.studentId}
                    onChange={(e) => setstudentId(e.target.value)}
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
                    value={password.password}
                    onChange={(e) => setpassword(e.target.value)}
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
                    value={password.confirmPassword}
                    onChange={(e) => setpassword(e.target.value)}
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#49ABB0] hover:bg-[#3a8a8f] text-white py-3 px-4 rounded-lg font-medium transition duration-200"
              >
                Create Student Account
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