import React, { useState } from "react";
import axios from "axios";
import { FiUpload, FiFile, FiX, FiCheck, FiLoader, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AssignmentBot = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', 'error'

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setUploadStatus(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setUploadStatus(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const validateFile = (file) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only PDF, JPG, and PNG are allowed.");
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentid", "123"); // Replace with actual student ID
    formData.append("subjectid", "456"); // Replace with actual subject ID
    formData.append("teacherid", "789"); // Replace with actual teacher ID
    formData.append("assignmentId", "abc"); // Replace with actual assignment ID
    formData.append("classroomId", "101"); // Replace with actual classroom ID
    formData.append("chatId", "202"); // Replace with actual chat ID

    try {
      const response = await axios.post("http://localhost:5000/api/assignments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadStatus('success');
      console.log(response.data);
    } catch (error) {
      console.error("Upload error:", error.response?.data?.message || error.message);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const resetFile = () => {
    setFile(null);
    setPreview(null);
    setUploadStatus(null);
    if (preview) URL.revokeObjectURL(preview);
  };

  const getFileIcon = () => {
    if (!file) return null;
    
    if (file.type === "application/pdf") {
      return <FiFile className="text-red-500" size={24} />;
    } else if (file.type.startsWith("image/")) {
      return <FiFile className="text-blue-500" size={24} />;
    }
    
    return <FiFile className="text-gray-500" size={24} />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-[#3A7CA5] rounded-full p-3 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">AI Assignment Assistant</h2>
      </div>

      <AnimatePresence>
        {uploadStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center"
          >
            <FiCheck className="text-green-500 mr-3" size={20} />
            <div className="flex-1">
              <h3 className="font-medium text-green-700">Upload Successful!</h3>
              <p className="text-green-600 text-sm">Your assignment has been uploaded and is being processed.</p>
            </div>
            <button onClick={() => setUploadStatus(null)} className="text-green-700 p-1 hover:bg-green-100 rounded-full">
              <FiX size={18} />
            </button>
          </motion.div>
        )}

        {uploadStatus === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center"
          >
            <FiAlertCircle className="text-red-500 mr-3" size={20} />
            <div className="flex-1">
              <h3 className="font-medium text-red-700">Upload Failed</h3>
              <p className="text-red-600 text-sm">There was a problem uploading your file. Please try again.</p>
            </div>
            <button onClick={() => setUploadStatus(null)} className="text-red-700 p-1 hover:bg-red-100 rounded-full">
              <FiX size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`border-2 border-dashed rounded-xl p-8 relative flex flex-col items-center justify-center transition-colors ${
          dragging ? "border-[#3A7CA5] bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {!file ? (
          <>
            <div className="mb-4 p-4 bg-[#ECE7CA] rounded-full">
              <FiUpload className="h-8 w-8 text-[#3A7CA5]" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Upload Assignment</h3>
            <p className="text-gray-500 text-center mb-4">Drag & drop your file here or click to browse</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">PDF</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">JPG</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">PNG</span>
            </div>
            
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="mt-2 cursor-pointer bg-[#3A7CA5] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#2F6690] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3A7CA5] focus:ring-offset-2 inline-flex items-center"
            >
              <FiUpload className="mr-2" size={16} />
              Choose File
            </label>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getFileIcon()}
                <div className="ml-3">
                  <h3 className="font-medium text-gray-800">{file.name}</h3>
                  <p className="text-gray-500 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={resetFile}
                className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Remove file"
              >
                <FiX className="text-gray-600" size={18} />
              </button>
            </div>
            
            {preview && file.type.startsWith("image/") && (
              <div className="mt-4 mb-6 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-lg shadow-sm max-h-64 object-contain border border-gray-200"
                />
              </div>
            )}
            
            {file.type === "application/pdf" && (
              <div className="mt-4 mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <FiFile className="text-red-500 mr-2" size={20} />
                <span className="text-gray-600">PDF Preview Not Available</span>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <div className="mt-6 flex justify-center">
        <motion.button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-6 py-2.5 rounded-lg font-medium shadow-sm flex items-center justify-center w-full max-w-xs ${
            !file
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          } transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          whileTap={{ scale: 0.98 }}
        >
          {uploading ? (
            <>
              <FiLoader className="animate-spin mr-2" size={18} />
              Uploading...
            </>
          ) : (
            <>
              <FiUpload className="mr-2" size={18} />
              Upload Assignment
            </>
          )}
        </motion.button>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
      </div>
    </div>
  );
};

export default AssignmentBot;
