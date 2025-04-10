import React, { useState } from "react";
import axios from "axios";

const AssignmentBot = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [rubric, setRubric] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [plagiarismResult, setPlagiarismResult] = useState("");

  const validateFile = (file) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only PDF, JPG, and PNG are allowed.");
      return false;
    }
    return true;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentid", "12345");
    formData.append("subjectid", "67890");
    formData.append("teacherid", "54321");
    formData.append("assignmentId", "A1");
    formData.append("classroomId", "C1");
    formData.append("chatId", "CH123");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/assignments/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Upload error:", error.response?.data?.message || error.message);
      alert("File upload failed.");
    }
  };

  const handleEvaluate = async () => {
    if (!studentAnswer || !totalMarks) {
      alert("Student answer and total marks are required.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/assignments/evaluate", {
        student_answer: studentAnswer,
        model_answer: modelAnswer,
        rubric: rubric,
        total_marks: totalMarks,
      });
      setEvaluation(response.data.evaluation);
      handlePlagiarismCheck();
    } catch (error) {
      console.error("Evaluation error:", error.response?.data?.message || error.message);
      alert("Evaluation failed.");
    }
  };

  const handlePlagiarismCheck = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/assignments/plagiarism", {
        student_answer: studentAnswer,
        model_answer: modelAnswer,
      });
      setPlagiarismResult(response.data.plagiarism_check);
    } catch (error) {
      console.error("Plagiarism check error:", error.response?.data?.message || error.message);
      alert("Plagiarism check failed.");
    }
  };

  return (
    <div className="bg-gray-50 text-black p-6 rounded-lg text-center border-2 border-dashed border-gray-400">
      <h2 className="text-xl font-bold mb-4">AI ASSIGNMENT BOT</h2>

      <div
        className={`p-6 rounded-lg border-2 border-dashed ${dragging ? "border-blue-500 bg-blue-100" : "border-gray-400"}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
      >
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="fileInput" onChange={handleFileChange} />
        <label htmlFor="fileInput" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Select File
        </label>
        {fileName && <p className="mt-2 text-sm text-gray-700">Selected File: {fileName}</p>}
      </div>

      <button onClick={handleUpload} className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600">
        Upload File
      </button>

      <textarea
        className="w-full p-2 mt-4 border rounded"
        placeholder="Enter Student's Answer"
        value={studentAnswer}
        onChange={(e) => setStudentAnswer(e.target.value)}
      />
      <textarea
        className="w-full p-2 mt-2 border rounded"
        placeholder="Enter Model Answer (Optional)"
        value={modelAnswer}
        onChange={(e) => setModelAnswer(e.target.value)}
      />
      <textarea
        className="w-full p-2 mt-2 border rounded"
        placeholder="Enter Rubric (Optional)"
        value={rubric}
        onChange={(e) => setRubric(e.target.value)}
      />
      <input
        type="number"
        className="w-full p-2 mt-2 border rounded"
        placeholder="Enter Total Marks"
        value={totalMarks}
        onChange={(e) => setTotalMarks(e.target.value)}
      />

      <button onClick={handleEvaluate} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">
        Evaluate Assignment
      </button>

      {evaluation && <p className="mt-4 p-4 border rounded">Evaluation: {evaluation}</p>}
      {plagiarismResult && <p className="mt-2 p-4 border rounded">Plagiarism Result: {plagiarismResult}</p>}
    </div>
  );
};

export default AssignmentBot;
