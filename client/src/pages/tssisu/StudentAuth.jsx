import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserGraduate, FaLock, FaArrowLeft, FaIdCard, FaUser, FaCheck, FaBook, FaCalculator, FaLaptopCode, FaAtom, FaBriefcase } from "react-icons/fa";
import { MdEmail, MdInterests, MdScience, MdBiotech } from "react-icons/md";
import { IoMdSchool } from "react-icons/io";
import { RiComputerFill, RiMedicineBottleFill } from "react-icons/ri";
import { GiMaterialsScience, GiMicroscope, GiBookshelf } from "react-icons/gi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentContext } from "../../context/StudentContext";

function StudentAuth() {
  const [activeTab, setActiveTab] = useState("login");
  const [registerStep, setRegisterStep] = useState(1); // 1: Form, 2: Preferences
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [formData, setFormData] = useState(null); // Store form data between steps
  
  const { setstoken } = useContext(StudentContext);
  const navigate = useNavigate();

  const interestCategories = [
    { id: 'math', name: 'Mathematics', icon: <FaCalculator className="text-3xl text-blue-600" /> },
    { id: 'computer_science', name: 'Computer Science', icon: <FaLaptopCode className="text-3xl text-gray-800" /> },
    { id: 'biology', name: 'Biology', icon: <MdBiotech className="text-3xl text-green-600" /> },
    { id: 'physics', name: 'Physics', icon: <GiMaterialsScience className="text-3xl text-blue-500" /> },
    { id: 'chemistry', name: 'Chemistry', icon: <GiMicroscope className="text-3xl text-purple-500" /> },
    { id: 'literature', name: 'Literature', icon: <FaBook className="text-3xl text-amber-600" /> },
    { id: 'engineering', name: 'Engineering', icon: <FaAtom className="text-3xl text-indigo-600" /> },
    { id: 'business', name: 'Business', icon: <FaBriefcase className="text-3xl text-teal-700" /> },
    { id: 'medicine', name: 'Medicine', icon: <RiMedicineBottleFill className="text-3xl text-red-500" /> },
    { id: 'history', name: 'History', icon: <GiBookshelf className="text-3xl text-amber-700" /> },
    { id: 'education', name: 'Education', icon: <IoMdSchool className="text-3xl text-green-600" /> },
    { id: 'technology', name: 'Technology', icon: <RiComputerFill className="text-3xl text-gray-700" /> },
  ];

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
        localStorage.setItem("sToken", response.data.token);
        setstoken(response.data.token);
        toast.success("Login successful! Redirecting...");
        
        setTimeout(() => {
          navigate("/Stu-Dash");
        }, 1000);
      } else {
        toast.error(response.data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
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

  const handleNextStep = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }

    // Validate all fields are filled
    if (!name || !email || !studentId || !password) {
      setError("All fields are required");
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Store form data and move to preferences step
    setFormData({
      name,
      email,
      studentId,
      password
    });
    
    setRegisterStep(2);
    setError("");
  };

  const handleBackToForm = () => {
    setRegisterStep(1);
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    
    if (selectedPreferences.length === 0) {
      toast.warning("Please select at least one interest");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/students/register", formData);

      if (response.data.success) {
        const studentId = response.data.student._id || response.data.student.id;
        
        try {
          await axios.post("http://localhost:5000/api/students/preferences", {
            studentId: studentId,
            preferences: selectedPreferences
          });
          
          toast.success("Account created successfully! You can now login.");
          
          setRegisterStep(1);
          setActiveTab("login");
          setSelectedPreferences([]);
          setFormData(null);
        } catch (prefError) {
          console.error("Error saving preferences:", prefError);
          toast.warning("Account created but failed to save preferences. You can update them later.");
          setActiveTab("login");
        }
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

  const togglePreference = (preferenceId) => {
    setSelectedPreferences(prev => {
      if (prev.includes(preferenceId)) {
        return prev.filter(id => id !== preferenceId);
      } else {
        if (prev.length >= 10) {
          toast.info("Maximum 10 interests can be selected.");
          return prev;
        }
        return [...prev, preferenceId];
      }
    });
  };

  const handleSkipPreferences = () => {
    toast.info("You can set your interests later in your profile.");
    setRegisterStep(1);
    setActiveTab("login");
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
          {activeTab === "login" ? (
            <>
              <div className="bg-[#49ABB0] p-6 text-center">
                <FaUserGraduate className="text-5xl text-white mx-auto mb-3" />
                <h1 className="text-3xl font-bold text-white">Student Portal</h1>
                <p className="text-white opacity-90 mt-1">
                  Access your learning resources
                </p>
              </div>

              <div className="flex border-b">
                <button
                  className="flex-1 py-4 font-medium text-[#49ABB0] border-b-2 border-[#49ABB0]"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
                <button
                  className="flex-1 py-4 font-medium text-gray-500"
                  onClick={() => {
                    setActiveTab("signup");
                    setRegisterStep(1);
                  }}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleLogin} className="p-8">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#49ABB0] hover:bg-[#3a8a8f] text-white py-3 px-4 rounded-lg font-medium transition duration-200 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Logging in..." : "Login to Student Portal"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="bg-[#49ABB0] p-6 text-center">
                <FaUserGraduate className="text-5xl text-white mx-auto mb-3" />
                <h1 className="text-3xl font-bold text-white">Student Portal</h1>
                <p className="text-white opacity-90 mt-1">
                  {registerStep === 1 ? "Join our learning community" : "Select your interests"}
                </p>
              </div>

              <div className="flex border-b">
                <button
                  className="flex-1 py-4 font-medium text-gray-500"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
                <button
                  className="flex-1 py-4 font-medium text-[#49ABB0] border-b-2 border-[#49ABB0]"
                  onClick={() => {}}
                >
                  Sign Up
                </button>
              </div>

              {registerStep === 1 ? (
                <form onSubmit={handleNextStep} className="p-8">
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
                    Next
                  </button>
                </form>
              ) : (
                <div className="p-6">
                  <div className="mb-2">
                    <button
                      onClick={handleBackToForm}
                      className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
                    >
                      <FaArrowLeft className="mr-2" /> Back to form
                    </button>

                    <h2 className="text-xl font-semibold text-center mb-4">Select your academic interests</h2>
                    <p className="text-gray-600 text-center mb-4">
                      Choose up to 10 subjects that interest you the most
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {interestCategories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => togglePreference(category.id)}
                        className={`
                          p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                          flex flex-col items-center justify-center text-center
                          ${selectedPreferences.includes(category.id) 
                            ? "border-[#49ABB0] bg-[#49ABB0] bg-opacity-10" 
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                        `}
                      >
                        <div className="mb-2 relative">
                          {category.icon}
                          {selectedPreferences.includes(category.id) && (
                            <div className="absolute -top-2 -right-2 bg-[#49ABB0] text-white rounded-full p-1 w-5 h-5 flex items-center justify-center">
                              <FaCheck className="text-xs" />
                            </div>
                          )}
                        </div>
                        <span className={`text-sm ${selectedPreferences.includes(category.id) ? "font-medium" : ""}`}>
                          {category.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleSignup}
                    disabled={isLoading || selectedPreferences.length === 0}
                    className={`w-full bg-[#49ABB0] hover:bg-[#3a8a8f] text-white py-3 px-4 rounded-lg font-medium transition duration-200 ${
                      (isLoading || selectedPreferences.length === 0) ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Creating Account..." : "Create Student Account"}
                  </button>
                  
                  <p className="mt-4 text-xs text-center text-gray-500">
                    These preferences help us personalize your learning experience
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default StudentAuth;