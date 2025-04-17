const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  // Message content
  content: { 
    type: String, 
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
    minlength: [1, 'Message cannot be empty']
  },

  // Sender information
  sender: { 
    type: String, 
    enum: {
      values: ['user', 'bot', 'system'],
      message: '{VALUE} is not a valid sender type'
    }, 
    required: [true, 'Sender type is required']
  },
  senderId: {
    type: Schema.Types.ObjectId,
    refPath: 'senderModel',
    required: function() {
      return this.sender === 'user';
    }
  },
  senderModel: {
    type: String,
    enum: ['User', 'Bot'],
    required: function() {
      return this.sender === 'user' || this.sender === 'bot';
    }
  },

  // Message metadata
  timestamp: { 
    type: Date, 
    default: Date.now,
    immutable: true
  },
  read: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'link', 'system'],
    default: 'text'
  },
  attachments: [{
    url: String,
    name: String,
    size: Number,
    mimeType: String,
    thumbnail: String
  }],

  // For bot messages
  intent: String,
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  entities: [{
    entity: String,
    value: String,
    confidence: Number
  }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const conversationSchema = new Schema({
  // User reference
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User reference is required'],
    index: true
  },

  // Conversation context
  context: {
    role: { 
      type: String, 
      enum: {
        values: ['student', 'teacher', 'admin', 'parent'],
        message: '{VALUE} is not a valid role'
      }, 
      required: [true, 'User role is required']
    },
    grade: {
      type: String,
      enum: ['9', '10', '11', '12', 'college', 'other'],
      validate: {
        validator: function(value) {
          return this.role === 'student' ? value !== undefined : true;
        },
        message: 'Grade is required for students'
      }
    },
    subjects: {
      type: [String],
      validate: {
        validator: function(subjects) {
          return subjects.length <= 10;
        },
        message: 'Cannot have more than 10 subjects'
      }
    },
    classroom: { 
      type: Schema.Types.ObjectId, 
      ref: 'Classroom',
      validate: {
        validator: async function(value) {
          if (!value) return true;
          const classroom = await mongoose.model('Classroom').findById(value);
          return classroom !== null;
        },
        message: 'Classroom does not exist'
      }
    },
    schoolYear: String,
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de'] // etc.
    }
  },

  // Conversation content
  messages: {
    type: [messageSchema],
    validate: {
      validator: function(messages) {
        return messages.length <= 1000;
      },
      message: 'Conversation cannot exceed 1000 messages'
    }
  },

  // Conversation metadata
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    default: function() {
      return `Conversation with ${this.context.role}`;
    }
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'resolved', 'pending'],
    default: 'active'
  },
  lastActive: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],

  // For analytics
  sentimentScore: {
    type: Number,
    min: -1,
    max: 1
  },
  messageCount: {
    user: { type: Number, default: 0 },
    bot: { type: Number, default: 0 }
  },
  averageResponseTime: Number // in seconds
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for unread count
conversationSchema.virtual('unreadCount').get(function() {
  return this.messages.filter(m => !m.read && m.sender !== 'user').length;
});

// Virtual for last message
conversationSchema.virtual('lastMessage').get(function() {
  return this.messages.length > 0 
    ? this.messages[this.messages.length - 1] 
    : null;
});

// Indexes
conversationSchema.index({ 'messages.timestamp': -1 });
conversationSchema.index({ status: 1 });
conversationSchema.index({ 'context.role': 1 });
conversationSchema.index({ 'context.grade': 1 });
conversationSchema.index({ 'context.classroom': 1 });

// Pre-save hooks
conversationSchema.pre('save', function(next) {
  // Update message counts
  if (this.isModified('messages')) {
    this.messageCount.user = this.messages.filter(m => m.sender === 'user').length;
    this.messageCount.bot = this.messages.filter(m => m.sender === 'bot').length;
  }

  // Update last active if messages changed
  if (this.isModified('messages') && this.messages.length > 0) {
    this.lastActive = this.messages[this.messages.length - 1].timestamp;
  }

  next();
});

// Query helpers
conversationSchema.query.active = function() {
  return this.where('status', 'active');
};

conversationSchema.query.byUser = function(userId) {
  return this.where('user', userId);
};

conversationSchema.query.byRole = function(role) {
  return this.where('context.role', role);
};

conversationSchema.query.withUnreadMessages = function() {
  return this.where('messages.read', false)
            .where('messages.sender').ne('user');
};

// Static methods
conversationSchema.statics.archiveOldConversations = async function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.updateMany(
    { 
      lastActive: { $lt: cutoffDate },
      status: 'active'
    },
    { 
      status: 'archived' 
    }
  );
};

module.exports = mongoose.model('Conversation', conversationSchema);