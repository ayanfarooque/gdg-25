const GradeCard = require('../models/GradeCard.js')

// Save AI-generated grade card
exports.saveAIGeneratedGradeCard = async (req, res) => {
  try {
    const { gradeCard } = req.body;


//   const {gradeCard} = req.body;

//   if (!gradeCard) {
//     return res.status(400).json({
//       success: false,
//       message: 'No grade card data provided',
//     });
//   }

//   const gradeCardData = {
//     // Student information
//     student: gradeCard.student._id,  // assuming _id is passed in the body
//     studentName: gradeCard.student.name,
//     studentRollNumber: gradeCard.student.id.toString(),

//     // Classroom info (replace with real data if needed)
//     classroom: gradeCard.classroom || '65f2a1b2c3d4e5f6a7b8c9d0',
//     className: gradeCard.student.grade,
//     teacher: gradeCard.teacher || '65f1a2b3c4d5e6f7a8b9c0d1',
//     teacherName: gradeCard.teacherName || 'Example Teacher',
//     term: gradeCard.term || 'Semester 1',
//     academicYear: gradeCard.academicYear || '2023-2024',

//     // Academic performance
//     subjects: gradeCard.subjects.map(subject => ({
//       subject: subject.name,
//       subjectCode: subject.name.substring(0, 3).toUpperCase(),
//       marksObtained: subject.marks,
//       totalMarks: subject.total,
//       grade: subject.grade,
//     }))
//   };

//currently using dummy ids for teacher  student and classroom later will take teacher id from req.params and student and classroom id from the input fileds in frontend
    if (!gradeCard) {
      return res.status(400).json({
        success: false,
        message: 'No grade card data provided'
      });
    }

    // Map the AI-generated data to our GradeCard model structure
    const gradeCardData = {
      // Student information
      student: '65f3a4b5c6d7e8f9a0b1c2d3',
      studentName: gradeCard.student.name,
      studentRollNumber: gradeCard.student.id.toString(),
      
      // We'd typically get these from auth but using mock data for now
      classroom: '65f2a1b2c3d4e5f6a7b8c9d0', // Example ObjectId
      className: gradeCard.student.grade,
      teacher: '65f1a2b3c4d5e6f7a8b9c0d1', // Example ObjectId
      teacherName: 'Example Teacher',
      term: 'Semester 1',
      academicYear: '2023-2024',
      
      // Academic performance
      subjects: gradeCard.subjects.map(subject => ({
        subject: subject.name,
        subjectCode: subject.name.substring(0, 3).toUpperCase(),
        grade: subject.grade,
        score: parseFloat(subject.score),
        maxScore: 100,
        classAverage: Math.round(Math.random() * 10) + parseFloat(subject.score) - 10, // Mock data
      })),
      
      overallGrade: gradeCard.overall_grade,
      gpa: convertGradeToGPA(gradeCard.overall_grade),
      totalScore: gradeCard.subjects.reduce((sum, subject) => 
        sum + parseFloat(subject.score), 0) / gradeCard.subjects.length,
      maxTotalScore: 100,
      
      // Attendance data
      attendance: {
        present: parseInt(parseFloat(gradeCard.attendance) / 100 * 180), // Assuming 180 school days
        total: 180, // Example total school days
        percentage: parseFloat(gradeCard.attendance)
      },
      
      // AI analysis
      aiAnalysis: {
        strengths: gradeCard.strengths,
        areasForImprovement: gradeCard.areas_for_improvement,
        recommendation: gradeCard.teacher_comments,
        confidenceScore: 0.85, // Example value
        generatedAt: new Date()
      },
      
      // Metadata
      status: 'Draft',
      isFinal: false,
      version: 1
    };

    // Create new grade card in the database
    const newGradeCard = await GradeCard.create(gradeCardData);

    return res.status(201).json({
      success: true,
      message: 'Grade card saved successfully',
      data: {
        id: newGradeCard._id,
        status: newGradeCard.status
      }
    });
  } catch (error) {
    console.error('Error saving AI-generated grade card:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to save grade card'
    });
  }
};

// Helper function to convert letter grade to GPA
function convertGradeToGPA(grade) {
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };
  return gradePoints[grade] || 0;
}



