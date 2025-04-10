import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ title, role }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [icon, setIcon] = useState(<FaUserCircle />);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
      <div className="relative" ref={dropdownRef}>
        <div
          className="text-teal-600 text-3xl cursor-pointer"
          onClick={() => setShow((prev) => !prev)}
        >
          {icon}
        </div>
        {show && (
          <div className="absolute right-0 mt-2 w-32 text-black bg-white shadow-md rounded-lg py-2">
            <div
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setIcon(<FaUserCircle />);
                role="";
                navigate("/Stu-Dash");
                setShow(false);
              }}
            >
              <FaUserCircle className="mr-2" /> Student
            </div>
            <div
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setIcon(<FaChalkboardTeacher />);
                role="teacher";
                navigate("/teacher-home");
                setShow(false);
              }}
            >
              <FaChalkboardTeacher className="mr-2" /> Teacher
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
