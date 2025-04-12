import React, { useState } from "react";
import axios from "axios";

const AssignmentBot = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
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

      alert("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Upload error:", error.response?.data?.message || error.message);
      alert("File upload failed.");
    }
  };

  return (
    <div className="bg-[#F5F5DD] text-black p-6 rounded-[50px] text-center border-2 border-gray-400">
      <h2 className="text-xl font-bold mb-4">AI ASSIGNMENT BOT</h2>

      <div
        className={`p-6 rounded-lg border-2 border-dashed ${
          dragging ? "border-blue-500 bg-blue-100" : "border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          id="fileInput"
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-[#29b6c6] text-white px-4 py-2 rounded inline-block hover:bg-[#238b9c]"
        >
          SELECT FILE
        </label>
        <p className="mt-2">Drag & drop your file here (PDF, JPG, JPEG, PNG)</p>

        {file && (
          <div className="mt-4">
            <p className="text-sm text-gray-700">Selected: {file.name}</p>
            {preview && file.type.startsWith("image/") && (
              <img src={preview} alt="Preview" className="mt-2 max-w-xs mx-auto rounded shadow-md" />
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Upload Assignment
      </button>
    </div>
  );
};

export default AssignmentBot;
