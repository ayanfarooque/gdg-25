const mongoose = require('mongoose');
const { Schema } = mongoose;

const subjectGradeSchema = new Schema({
  // Subject identification
  subject: { 
    type: String, 
    required: [true, 'Subject name is required'],
    trim: true,
    maxlength: [50, 'Subject name cannot exceed 50 characters']
  },
  subjectCode: {
    type: String,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Subject code cannot exceed 10 characters']
  },

  // Grading information
  grade: { 
    type: String, 
    required: [true, 'Grade is required'],
    uppercase: true,
    enum: {
      values: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'I'],
      message: '{VALUE} is not a valid grade'
    }
  },
  score: { 
    type: Number, 
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative']
  },
  maxScore: { 
    type: Number, 
    required: [true, 'Maximum score is required'],
    min: [1, 'Maximum score must be at least 1'],
    validate: {
      validator: function(value) {
        return value >= this.score;
      },
      message: 'Maximum score must be greater than or equal to actual score'
    }
  },
  weightage: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },

  // Comparative metrics
  classAverage: {
    type: Number,
    min: 0,
    validate: {
      validator: function(value) {
        return value <= this.maxScore;
      },
      message: 'Class average cannot exceed maximum score'
    }
  },
  percentile: {
    type: Number,
    min: 0,
    max: 100
  },
  standardDeviation: Number,
  gradeDistribution: {
    A: Number,
    B: Number,
    C: Number,
    D: Number,
    F: Number
  },

  // Feedback
  teacherComments: {
    type: String,
    maxlength: [500, 'Comments cannot exceed 500 characters'],
    trim: true
  },
  rubrics: [{
    criteria: String,
    score: Number,
    maxScore: Number,
    comment: String
  }],
  learningOutcomes: [{
    outcome: String,
    achieved: Boolean,
    evidence: String
  }]
}, { _id: false }); // Prevent automatic ID generation for subdocuments

const gradeCardSchema = new Schema({
  // Student information
  student: { 
    type: Schema.Types.ObjectId, 
    ref: 'Student', 
    required: [true, 'Student reference is required'],
    index: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentRollNumber: {
    type: String,
    required: true,
    trim: true
  },

  // Academic context
  classroom: { 
    type: Schema.Types.ObjectId, 
    ref: 'Classroom', 
    required: [true, 'Classroom reference is required'],
    index: true
  },
  className: {
    type: String,
    required: true,
    trim: true
  },
  teacher: { 
    type: Schema.Types.ObjectId, 
    ref: 'Teacher', 
    required: [true, 'Teacher reference is required'],
    index: true
  },
  teacherName: {
    type: String,
    required: true,
    trim: true
  },
  term: { 
    type: String, 
    required: [true, 'Term is required'],
    enum: {
      values: ['1', '2', '3', 'Final', 'Midterm', 'Quarterly', 'Semester 1', 'Semester 2'],
      message: '{VALUE} is not a valid term'
    }
  },
  academicYear: { 
    type: String, 
    required: [true, 'Academic year is required'],
    match: [/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY']
  },

  // Academic performance
  subjects: {
    type: [subjectGradeSchema],
    validate: {
      validator: function(subjects) {
        return subjects.length > 0;
      },
      message: 'At least one subject is required'
    }
  },
  overallGrade: { 
    type: String, 
    required: [true, 'Overall grade is required'],
    uppercase: true,
    enum: {
      values: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'I'],
      message: '{VALUE} is not a valid overall grade'
    }
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4.0,
    set: function(value) {
      return parseFloat(value.toFixed(2));
    }
  },
  totalScore: { 
    type: Number, 
    required: [true, 'Total score is required'],
    min: 0
  },
  maxTotalScore: { 
    type: Number, 
    required: [true, 'Maximum total score is required'],
    min: 1,
    validate: {
      validator: function(value) {
        return value >= this.totalScore;
      },
      message: 'Maximum total score must be greater than or equal to actual total score'
    }
  },
  classRank: {
    type: Number,
    min: 1
  },
  schoolRank: {
    type: Number,
    min: 1
  },

  // Attendance data
  attendance: {
    present: { 
      type: Number, 
      required: [true, 'Present days count is required'],
      min: 0
    },
    total: { 
      type: Number, 
      required: [true, 'Total days count is required'],
      min: 1,
      validate: {
        validator: function(value) {
          return value >= this.attendance.present;
        },
        message: 'Total days must be greater than or equal to present days'
      }
    },
    percentage: { 
      type: Number, 
      required: [true, 'Attendance percentage is required'],
      min: 0,
      max: 100,
      set: function(value) {
        return parseFloat(value.toFixed(2));
      }
    },
    detailedAttendance: [{
      month: String,
      present: Number,
      total: Number,
      percentage: Number
    }]
  },

  // Behavioral metrics
  behavior: {
    conduct: {
      type: String,
      enum: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement']
    },
    participation: {
      type: String,
      enum: ['High', 'Medium', 'Low']
    },
    comments: String
  },

  // AI analysis
  aiAnalysis: {
    strengths: {
      type: [String],
      validate: {
        validator: function(strengths) {
          return strengths.length <= 5;
        },
        message: 'Cannot have more than 5 strengths listed'
      }
    },
    areasForImprovement: {
      type: [String],
      validate: {
        validator: function(areas) {
          return areas.length <= 5;
        },
        message: 'Cannot have more than 5 improvement areas listed'
      }
    },
    learningStyle: {
      type: String,
      enum: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing', 'Mixed']
    },
    recommendation: {
      type: String,
      maxlength: [500, 'Recommendation cannot exceed 500 characters']
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1
    },
    generatedAt: Date
  },

  // Metadata
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft'
  },
  publishedAt: Date,
  publishedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isFinal: {
    type: Boolean,
    default: false
  },
  generatedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastUpdatedAt: Date,
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 1
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for percentage score
gradeCardSchema.virtual('percentageScore').get(function() {
  return (this.totalScore / this.maxTotalScore * 100).toFixed(2);
});

// Virtual for grade point equivalent
gradeCardSchema.virtual('gradePoint').get(function() {
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };
  return gradePoints[this.overallGrade] || 0;
});

// Indexes for performance
gradeCardSchema.index({ student: 1, academicYear: 1 });
gradeCardSchema.index({ classroom: 1, term: 1 });
gradeCardSchema.index({ overallGrade: 1 });
gradeCardSchema.index({ gpa: -1 });
gradeCardSchema.index({ classRank: 1 });
gradeCardSchema.index({ 'subjects.subject': 1 });

// Pre-save hooks
gradeCardSchema.pre('save', function(next) {
  // Set last updated fields
  if (this.isModified()) {
    this.lastUpdatedAt = new Date();
    // In real app, set lastUpdatedBy to current user
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'Published') {
    this.publishedAt = new Date();
    // In real app, set publishedBy to current user
  }

  next();
});

// Query helpers
gradeCardSchema.query.byStudent = function(studentId) {
  return this.where('student', studentId);
};

gradeCardSchema.query.byClassroom = function(classroomId) {
  return this.where('classroom', classroomId);
};

gradeCardSchema.query.byAcademicYear = function(year) {
  return this.where('academicYear', year);
};

gradeCardSchema.query.published = function() {
  return this.where('status', 'Published');
};

gradeCardSchema.statics.archiveOldGradeCards = async function(years = 3) {
  const cutoffYear = new Date().getFullYear() - years;
  const cutoffAcademicYear = `${cutoffYear-1}-${cutoffYear}`;
  
  return this.updateMany(
    { 
      academicYear: { $lt: cutoffAcademicYear },
      status: { $ne: 'Archived' }
    },
    { 
      status: 'Archived' 
    }
  );
};

module.exports = mongoose.model('GradeCard', gradeCardSchema);