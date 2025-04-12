import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
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
    <nav  className={`shadow-md p-4 flex justify-between items-center relative ${
      icon.type === FaUserCircle ? "bg-teal-700" : "bg-[#E195AB]"
    }`}>
      <h1 className="text-white text-xl font-bold">E-LEARNING</h1>
      <div className="relative" ref={dropdownRef}>
        <div
          className="text-teal-600 text-3xl cursor-pointer"
          onClick={() => setShow((prev) => !prev)}
        >
          {icon}
        </div>
        {show && (
          <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-lg py-2">
            <div
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setIcon(<FaUserCircle />);
                navigate('/')
                setShow(false);
              }}
            >
              <FaUserCircle className="mr-2" /> Student
            </div>
            <div
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setIcon(<FaChalkboardTeacher />);
                navigate('/teacher-home')
                setShow(false);
              }}
            >
              <FaChalkboardTeacher className="mr-2" /> Teacher
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
