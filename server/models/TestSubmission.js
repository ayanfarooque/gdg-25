const mongoose = require('mongoose');
const validator = require('validator');

const answerSchema = new mongoose.Schema({
  questionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: [true, 'Question ID is required'],
    ref: 'Test.questions' 
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: function(value) {
        // Validate based on question type (would need question reference)
        if (Array.isArray(value)) {
          return value.every(item => typeof item === 'string');
        }
        return typeof value === 'string' || typeof value === 'boolean';
      },
      message: 'Invalid answer format'
    }
  },
  isCorrect: { 
    type: Boolean, 
    default: false 
  },
  pointsAwarded: { 
    type: Number, 
    default: 0,
    min: [0, 'Points awarded cannot be negative'],
    max: [function() {
      // Would need to reference the question's max points
      return 100; // Default max, should be replaced with actual question points
    }, 'Points awarded cannot exceed question maximum']
  },
  teacherFeedback: {
    type: String,
    trim: true,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  autoFeedback: {
    type: String,
    trim: true,
    maxlength: [1000, 'Auto feedback cannot exceed 1000 characters']
  },
  timeSpent: { // in seconds
    type: Number,
    min: [0, 'Time spent cannot be negative'],
    max: [3600, 'Time spent cannot exceed 1 hour per question']
  },
  confidenceLevel: {
    type: Number,
    min: [0, 'Confidence level must be between 0-100'],
    max: [100, 'Confidence level must be between 0-100']
  },
  _id: false // Prevent automatic ID generation for answers
});

const performanceAnalysisSchema = new mongoose.Schema({
  classAverage: {
    type: Number,
    min: [0, 'Class average cannot be negative'],
    max: [100, 'Class average cannot exceed 100']
  },
  percentile: {
    type: Number,
    min: [0, 'Percentile must be between 0-100'],
    max: [100, 'Percentile must be between 0-100']
  },
  timeSpent: { // in minutes
    type: Number,
    min: [0, 'Time spent cannot be negative'],
    max: [600, 'Time spent cannot exceed 10 hours']
  },
  questionWiseAnalysis: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test.questions'
    },
    correctPercentage: {
      type: Number,
      min: [0, 'Percentage must be between 0-100'],
      max: [100, 'Percentage must be between 0-100']
    },
    timeSpent: { // in seconds
      type: Number,
      min: [0, 'Time spent cannot be negative'],
      max: [3600, 'Time spent cannot exceed 1 hour']
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    commonMistakes: [String]
  }],
  strengths: [{
    topic: String,
    score: Number,
    questions: [mongoose.Schema.Types.ObjectId]
  }],
  weaknesses: [{
    topic: String,
    score: Number,
    questions: [mongoose.Schema.Types.ObjectId]
  }],
  comparison: {
    previousAttempts: [{
      attemptId: mongoose.Schema.Types.ObjectId,
      score: Number,
      improvement: Number
    }],
    topPerformers: [{
      studentId: mongoose.Schema.Types.ObjectId,
      score: Number
    }]
  },
  suggestionResources: [{
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Resource must be a valid URL'
    }
  }]
}, { _id: false });

const testSubmissionSchema = new mongoose.Schema({
  test: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Test', 
    required: [true, 'Test reference is required'],
    index: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: [true, 'Student reference is required'],
    index: true 
  },
  attemptNumber: {
    type: Number,
    min: [1, 'Attempt number must be at least 1'],
    default: 1
  },
  startedAt: { 
    type: Date, 
    required: [true, 'Start time is required'],
    default: Date.now,
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Start time cannot be in the future'
    }
  },
  submittedAt: {
    type: Date,
    validate: {
      validator: function(value) {
        if (this.status !== 'in-progress') {
          return value >= this.startedAt;
        }
        return true;
      },
      message: 'Submission time must be after start time'
    }
  },
  completedAt: Date,
  answers: {
    type: [answerSchema],
    validate: {
      validator: function(answers) {
        // Validate that all required questions are answered when submitted
        if (this.status !== 'in-progress') {
          // Would need test reference to validate all questions are answered
          return answers.length > 0;
        }
        return true;
      },
      message: 'All required questions must be answered before submission'
    }
  },
  score: { 
    type: Number, 
    default: 0,
    min: [0, 'Score cannot be negative'],
    max: [function() {
      return this.maxScore;
    }, 'Score cannot exceed maximum score']
  },
  maxScore: { 
    type: Number, 
    required: [true, 'Maximum score is required'],
    min: [1, 'Maximum score must be at least 1']
  },
  percentage: {
    type: Number,
    min: [0, 'Percentage must be between 0-100'],
    max: [100, 'Percentage cannot exceed 100'],
    set: function(v) { return parseFloat(v.toFixed(2)); }
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F']
  },
  status: { 
    type: String, 
    enum: {
      values: ['in-progress', 'submitted', 'graded', 'reviewed', 'appealed'],
      message: 'Invalid submission status'
    }, 
    default: 'in-progress' 
  },
  ipAddress: {
    type: String,
    validate: {
      validator: validator.isIP,
      message: 'Invalid IP address'
    }
  },
  deviceInfo: {
    type: {
      platform: String,
      browser: String,
      isMobile: Boolean
    }
  },
  timeSpent: { // in minutes
    type: Number,
    min: [0, 'Time spent cannot be negative'],
    max: [600, 'Time spent cannot exceed 10 hours']
  },
  cheatingFlags: [{
    type: String,
    enum: ['tab-change', 'copy-paste', 'multiple-devices', 'unusual-time', 'pattern-detected']
  }],
  performanceAnalysis: performanceAnalysisSchema,
  teacherComments: {
    type: String,
    trim: true,
    maxlength: [2000, 'Comments cannot exceed 2000 characters']
  },
  studentFeedback: {
    type: String,
    trim: true,
    maxlength: [2000, 'Feedback cannot exceed 2000 characters']
  },
  isPassed: {
    type: Boolean,
    default: function() {
      return this.percentage >= (this.test?.passingScore || 70);
    }
  },
  metadata: {
    submissionMethod: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    version: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration (in minutes)
testSubmissionSchema.virtual('duration').get(function() {
  if (!this.submittedAt) return null;
  return (this.submittedAt - this.startedAt) / (1000 * 60);
});

// Indexes for better query performance
testSubmissionSchema.index({ test: 1, student: 1 });
testSubmissionSchema.index({ student: 1, status: 1 });
testSubmissionSchema.index({ 'performanceAnalysis.percentile': 1 });
testSubmissionSchema.index({ score: 1 });

// Pre-save hooks
testSubmissionSchema.pre('save', function(next) {
  // Calculate percentage if score changes
  if (this.isModified('score') && this.maxScore > 0) {
    this.percentage = (this.score / this.maxScore) * 100;
  }

  // Set completedAt when graded
  if (this.isModified('status') && this.status === 'graded' && !this.completedAt) {
    this.completedAt = new Date();
  }

  next();
});

// Static method to find submissions by status
testSubmissionSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Static method to get average score for a test
testSubmissionSchema.statics.getTestAverage = function(testId) {
  return this.aggregate([
    { $match: { test: testId, status: 'graded' } },
    { $group: { _id: null, average: { $avg: '$score' } } }
  ]);
};

// Instance method to check if submission is late
testSubmissionSchema.methods.isLate = function() {
  if (!this.test || !this.submittedAt) return false;
  // Would need to reference test deadline
  return false; // Implementation would need test reference
};

// Instance method to calculate time per question
testSubmissionSchema.methods.getTimePerQuestion = function() {
  if (!this.timeSpent || !this.answers.length) return null;
  return (this.timeSpent * 60) / this.answers.length; // in seconds
};

module.exports = mongoose.model('TestSubmission', testSubmissionSchema);