const mongoose = require('mongoose');
const validator = require('validator');

const questionOptionSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [1, 'Option text must be at least 1 character long'],
    maxlength: [500, 'Option text cannot exceed 500 characters']
  },
  isCorrect: { 
    type: Boolean, 
    default: false 
  },
  explanation: {
    type: String,
    trim: true,
    maxlength: [1000, 'Explanation cannot exceed 1000 characters']
  },
  _id: false // Prevent automatic ID generation for options
});

const questionSchema = new mongoose.Schema({
  questionText: { 
    type: String, 
    required: [true, 'Question text is required'],
    trim: true,
    minlength: [5, 'Question text must be at least 5 characters long'],
    maxlength: [2000, 'Question text cannot exceed 2000 characters']
  },
  questionType: { 
    type: String, 
    enum: {
      values: ['multiple-choice', 'true-false', 'short-answer', 'essay', 'matching', 'fill-in-the-blank'],
      message: 'Invalid question type'
    }, 
    required: [true, 'Question type is required']
  },
  options: {
    type: [questionOptionSchema],
    validate: {
      validator: function(options) {
        // Validate that multiple-choice questions have between 2-10 options
        if (this.questionType === 'multiple-choice') {
          return options.length >= 2 && options.length <= 10;
        }
        // Validate that true-false questions have exactly 2 options
        if (this.questionType === 'true-false') {
          return options.length === 2;
        }
        return true;
      },
      message: 'Invalid number of options for this question type'
    }
  },
  correctAnswer: {
    type: String,
    validate: {
      validator: function(value) {
        // Only required for short-answer questions
        if (this.questionType === 'short-answer') {
          return value && value.trim().length > 0;
        }
        return true;
      },
      message: 'Correct answer is required for short-answer questions'
    },
    trim: true,
    maxlength: [2000, 'Correct answer cannot exceed 2000 characters']
  },
  points: { 
    type: Number, 
    required: [true, 'Points are required'],
    min: [0, 'Points cannot be negative'],
    max: [100, 'Points cannot exceed 100']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  hints: [{
    type: String,
    trim: true,
    maxlength: [500, 'Hint cannot exceed 500 characters']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  media: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Media must be a valid URL',
      protocols: ['http', 'https'],
      require_protocol: true
    }
  }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const testSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Test title is required'],
    trim: true,
    minlength: [5, 'Test title must be at least 5 characters long'],
    maxlength: [200, 'Test title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  classroom: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Classroom', 
    required: [true, 'Classroom reference is required'] 
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher', 
    required: [true, 'Teacher reference is required'] 
  },
  duration: { 
    type: Number, 
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
    max: [600, 'Duration cannot exceed 600 minutes (10 hours)']
  },
  scheduledDate: { 
    type: Date, 
    required: [true, 'Scheduled date is required'],
    validate: {
      validator: function(value) {
        return value > Date.now();
      },
      message: 'Scheduled date must be in the future'
    }
  },
  deadline: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > this.scheduledDate;
      },
      message: 'Deadline must be after the scheduled date'
    }
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function(questions) {
        return questions.length > 0;
      },
      message: 'Test must have at least one question'
    }
  },
  submissions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'TestSubmission' 
  }],
  status: { 
    type: String, 
    enum: {
      values: ['draft', 'scheduled', 'in-progress', 'completed', 'archived'],
      message: 'Invalid test status'
    }, 
    default: 'draft' 
  },
  aiGenerated: { 
    type: Boolean, 
    default: false 
  },
  passingScore: {
    type: Number,
    min: [0, 'Passing score cannot be negative'],
    max: [function() {
      return this.questions.reduce((sum, q) => sum + q.points, 0);
    }, 'Passing score cannot exceed total points']
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: [5000, 'Instructions cannot exceed 5000 characters']
  },
  isShuffleQuestions: {
    type: Boolean,
    default: false
  },
  isShuffleOptions: {
    type: Boolean,
    default: false
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  maxAttempts: {
    type: Number,
    min: 1,
    max: 10,
    default: 1
  },
  visibility: {
    type: String,
    enum: ['private', 'class', 'public'],
    default: 'class'
  },
  metadata: {
    topics: [String],
    subject: String,
    curriculum: String,
    standards: [String]
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total points
testSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((sum, question) => sum + question.points, 0);
});

// Virtual for estimated completion time
testSchema.virtual('estimatedCompletionTime').get(function() {
  const baseTime = this.duration;
  const questionTime = this.questions.length * 0.5; // 30 seconds per question average
  return baseTime + Math.min(questionTime, baseTime * 0.5); // Cap additional time at 50% of base
});

// Indexes for better query performance
testSchema.index({ classroom: 1, status: 1 });
testSchema.index({ teacher: 1, scheduledDate: -1 });
testSchema.index({ scheduledDate: 1 });
testSchema.index({ status: 1 });

// Pre-save hook to validate test
testSchema.pre('save', function(next) {
  // Ensure passing score doesn't exceed total points
  if (this.passingScore && this.passingScore > this.totalPoints) {
    throw new Error('Passing score cannot exceed total points');
  }
  
  // Auto-update status based on dates
  if (this.isModified('scheduledDate') ){
    const now = new Date();
    if (this.scheduledDate <= now) {
      this.status = 'in-progress';
    }
  }
  
  next();
});

// Static method to find tests by status
testSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

// Instance method to check if test is active
testSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'in-progress' || 
         (this.scheduledDate <= now && this.deadline >= now);
};

module.exports = mongoose.model('Test', testSchema);