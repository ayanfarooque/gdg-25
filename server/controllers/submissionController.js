const Submission = require('../models/Submission.js');
const AssignAssignment = require('../models/AssignAssignment.js');
const Student = require('../models/Subject.js')
const Teacher = require('../models/Teacher.js')

const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

exports.submitAssignment = async (req,res) => {
    try {
        const {assignmentId,studentId,answer} =  req.body;
        const files = req.files;

        const assignment = await AssignAssignment.findById(assignmentId);
        if(!assignment){
            return res.status(404).json({message: "assignment not found"});
        }

        const student = await Student.findById(studentId);
        if(!student){
            return res.status(404).json({message: "Student not found"});
        }

        const existingSubmission = await SubmissionfindOne({
            assignement: "assignmentId",
            student: "studentId",
        })

    const uploadedFiles = [];
    for (const file of files) {
      const result = await uploadToCloudinary(file.path, "submissions");
      uploadedFiles.push({
        url: result.secure_url,
        name: file.originalname,
        type: file.mimetype.split("/")[1],
        size: file.size,
        key: result.public_id,
      });
    }

    if (existingSubmission) {
      // Update existing submission (resubmission)
      existingSubmission.files = [...existingSubmission.files, ...uploadedFiles];
      if (textAnswer) existingSubmission.textAnswer = textAnswer;
      existingSubmission.status = "resubmitted";
      existingSubmission.resubmissions.push({
        files: uploadedFiles,
        textAnswer,
        submittedAt: new Date(),
      });

      const updatedSubmission = await existingSubmission.save();
      return res.status(200).json(updatedSubmission);
    }else {
        // Create new submission
        const submission = new Submission({
          assignment: assignmentId,
          student: studentId,
          files: uploadedFiles,
          textAnswer,
        });
  
        const savedSubmission = await submission.save();
        res.status(201).json(savedSubmission);
      }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Evaluate a submission
//it will be done at flask route but just keeping basic instance here
//it should be placed in assignassignmet controller but for now keeping it here
exports.evaluateSubmission = async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { score, maxScore, feedback, gradedById, aiFeedback } = req.body;
  
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
  
      // Check if grader exists
      const grader = await Teacher.findById(gradedById);
      if (!grader) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      submission.evaluation = {
        score,
        maxScore: maxScore || 100, // Default to 100 if not provided
        feedback,
        gradedBy: gradedById,
        gradedAt: new Date(),
        aiFeedback: aiFeedback || null,
      };
      submission.status = "graded";
  
      const updatedSubmission = await submission.save();
      res.status(200).json(updatedSubmission);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


  // Delete a submission
exports.deleteSubmission = async (req, res) => {
    try {
      const { submissionId } = req.params;
  
      const submission = await Submission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
  
      // Delete files from Cloudinary
      for (const file of submission.files) {
        await deleteFromCloudinary(file.key);
      }
  
      await Submission.findByIdAndDelete(submissionId);
      res.status(200).json({ message: "Submission deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  exports.getLateSubmissions = async (req, res) => {
    try {
      const { courseId } = req.params;
      
      // First find assignments for the course
      const assignments = await AssignAssignment.find({ course: courseId });
      const assignmentIds = assignments.map(a => a._id);
      
      // Then find late submissions for these assignments
      const lateSubmissions = await Submission.find({
        assignment: { $in: assignmentIds },
        status: "late"
      })
      .populate("student", "name email")
      .populate("assignment", "title dueDate");
  
      res.status(200).json(lateSubmissions);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


  exports.getSubmissionsByStudent = async (req, res) => {
    try {
      const { studentId } = req.params;
      const submissions = await Submission.find({ student: studentId })
        .populate("assignment", "title dueDate")
        .populate("evaluation.gradedBy", "name");
  
      res.status(200).json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  

  exports.getSubmissionById = async (req, res) => {
    try {
      const { submissionId } = req.params;
      const submission = await Submission.findById(submissionId)
        .populate("student", "name email")
        .populate("assignment", "title dueDate")
        .populate("evaluation.gradedBy", "name");
  
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
  
      res.status(200).json(submission);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };




  exports.getSubmissionsByAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const submissions = await Submission.find({ assignment: assignmentId })
        .populate("student", "name email")
        .populate("assignment", "title dueDate")
        .populate("evaluation.gradedBy", "name");
  
      res.status(200).json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };