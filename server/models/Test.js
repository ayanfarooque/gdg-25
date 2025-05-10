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
      values: ['multipleChoice', 'shortAnswer', 'essay', 'finalanswer', 'true-false', 'matching', 'fill-in-the-blank'],
      message: 'Invalid question type'
    }, 
    required: [true, 'Question type is required']
  },
  options: {
    type: [questionOptionSchema],
    validate: {
      validator: function(options) {
        // Validate that multiple-choice questions have between 2-10 options
        if (this.questionType === 'multipleChoice') {
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
        // Required for shortAnswer and finalanswer questions
        if (this.questionType === 'shortAnswer' || this.questionType === 'finalanswer') {
          return value && value.trim().length > 0;
        }
        return true;
      },
      message: 'Correct answer is required for short answer questions'
    },
    trim: true,
    maxlength: [2000, 'Correct answer cannot exceed 2000 characters']
  },
  // New field for AI-generated questions
  originalQuestion: {
    type: String,
    trim: true
  },
  points: { 
    type: Number, 
    required: [true, 'Points are required'],
    min: [0, 'Points cannot be negative'],
    max: [100, 'Points cannot exceed 100'],
    default: 5
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
  media: {
    type: String,
    validate: {
      validator: function(value) {
        return !value || validator.isURL(value, {
          protocols: ['http', 'https'],
          require_protocol: true
        });
      },
      message: 'Media must be a valid URL'
    }
  }
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
  // Make classroom and teacher optional for AI generated tests
  classroom: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Classroom'
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher'
  },
  duration: { 
    type: Number, 
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
    max: [600, 'Duration cannot exceed 600 minutes (10 hours)'],
    default: 30
  },
  scheduledDate: { 
    type: Date,
    default: function() {
      return new Date(Date.now() + 7*24*60*60*1000); // Default 1 week from now
    },
    validate: {
      validator: function(value) {
        // Only validate if a date is provided and test is not AI-generated draft
        return !value || this.status === 'draft' || value > Date.now();
      },
      message: 'Scheduled date must be in the future'
    }
  },
  deadline: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || !this.scheduledDate || value > this.scheduledDate;
      },
      message: 'Deadline must be after the scheduled date'
    }
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function(questions) {
        // Only enforce question requirement for non-draft tests
        return this.status === 'draft' || questions.length > 0;
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
  // Store the original AI response for reference
  aiGeneratedContent: {
    type: String,
    trim: true
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
  answerKey: {
    type: String,
    trim: true
  },
  estimatedTime: {
    type: String,
    trim: true
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
    gradeLevel: Number,
    curriculum: String,
    standards: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
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

// Function to map AI-generated test to MongoDB schema
testSchema.statics.fromAIGeneratedTest = function(aiTestData, teacherID = null) {
  try {
    // Parse test data if it's a string
    const testData = typeof aiTestData === 'string' ? JSON.parse(aiTestData) : aiTestData;

    // Map AI-generated questions to schema format
    const mappedQuestions = testData.questions.map(q => {
      const question = {
        questionText: q.question,
        questionType: q.type,
        difficulty: q.difficulty || 'medium',
        points: 5, // Default points per question
        originalQuestion: q.question
      };

      // Handle options for multiple choice questions
      if (q.type === 'multipleChoice' && q.options) {
        question.options = q.options.map((optText, i) => {
          // If the answer is a number index or string option, mark as correct
          const isCorrect = (
            typeof q.answer === 'number' && i === q.answer ||
            typeof q.answer === 'string' && optText === q.answer
          );
          return { text: optText, isCorrect };
        });
      } else if (q.type === 'shortAnswer' || q.type === 'finalanswer') {
        question.correctAnswer = q.answer;
      }

      return question;
    });

    // Create new test object
    return {
      title: testData.title,
      description: testData.instructions || "",
      teacher: teacherID,
      duration: parseInt(testData.estimatedTime) || 30,
      questions: mappedQuestions,
      instructions: testData.instructions || "",
      answerKey: testData.answer_key || "",
      aiGenerated: true,
      aiGeneratedContent: JSON.stringify(testData),
      metadata: {
        subject: testData.subject || "",
        gradeLevel: testData.grade_level || 9
      }
    };
  } catch (error) {
    throw new Error(`Error mapping AI test: ${error.message}`);
  }
};

// Pre-save hook to update timestamps
testSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Ensure passing score doesn't exceed total points
  if (this.passingScore && this.passingScore > this.totalPoints) {
    this.passingScore = this.totalPoints;
  }
  
  next();
});




// Add the static method to the schema
testSchema.statics.fromAIGeneratedTest = function(aiTestData, teacherId = null) {
  try {
    // Parse test data if it's a string
    let testData = aiTestData;
    if (typeof aiTestData === 'string') {
      testData = JSON.parse(aiTestData);
    }

    // Map AI-generated questions to schema format
    const mappedQuestions = testData.questions.map(q => {
      const question = {
        questionText: q.question,
        questionType: q.type === 'multiple_choice' ? 'multipleChoice' : 
                     q.type === 'short_answer' ? 'shortAnswer' : q.type,
        difficulty: q.difficulty || 'medium',
        points: 5, // Default points per question
      };

      // Handle options for multiple choice questions
      if (q.type === 'multiple_choice' || q.type === 'multipleChoice') {
        question.options = q.options.map((optText, i) => {
          // If the answer is a number index or string option, mark as correct
          const isCorrect = (
            typeof q.answer === 'number' && i === q.answer ||
            typeof q.answer === 'string' && optText === q.answer
          );
          return { text: optText, isCorrect };
        });
      } else if (q.type === 'short_answer' || q.type === 'shortAnswer' || q.type === 'finalanswer') {
        question.correctAnswer = q.answer;
      }

      return question;
    });

    // Create new test object
    return {
      title: testData.title || "AI Generated Test",
      description: testData.instructions || "",
      teacher: teacherId,
      duration: parseInt(testData.estimated_time) || 30,
      questions: mappedQuestions,
      instructions: testData.instructions || "",
      answerKey: testData.answer_key || "",
      aiGenerated: true,
      aiGeneratedContent: JSON.stringify(testData),
      metadata: {
        subject: testData.subject || "",
        gradeLevel: testData.grade_level || 9
      }
    };
  } catch (error) {
    throw new Error(`Error mapping AI test: ${error.message}`);
  }
};

module.exports = mongoose.model('Test', testSchema);