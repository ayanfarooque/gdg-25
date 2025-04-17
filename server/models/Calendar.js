const mongoose = require('mongoose');
const { Schema } = mongoose;

const calendarEventSchema = new Schema({
  // Basic event information
  title: { 
    type: String, 
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Event title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Date and time details
  date: { 
    type: Date, 
    required: [true, 'Event date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value >= this.date;
      },
      message: 'End date must be after start date'
    }
  },
  allDay: {
    type: Boolean,
    default: false
  },
  
  // Event creator and ownership
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Event creator is required'],
    immutable: true
  },
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Audience targeting
  targetAudience: { 
    type: String, 
    enum: {
      values: ['all', 'students', 'teachers', 'specific-grade', 'specific-class'],
      message: 'Invalid target audience type'
    }, 
    required: [true, 'Target audience is required']
  },
  grade: { 
    type: String, 
    enum: {
      values: ['9', '10', '11', '12', 'college', 'all'],
      message: 'Invalid grade level'
    },
    required: function() {
      return this.targetAudience === 'specific-grade';
    }
  },
  classroom: { 
    type: Schema.Types.ObjectId, 
    ref: 'Classroom',
    required: function() {
      return this.targetAudience === 'specific-class';
    }
  },
  
  // Recurrence settings
  isRecurring: { 
    type: Boolean, 
    default: false 
  },
  recurrencePattern: { 
    type: String, 
    enum: {
      values: ['daily', 'weekly', 'monthly', 'yearly'],
      message: 'Invalid recurrence pattern'
    },
    required: function() {
      return this.isRecurring === true;
    }
  },
  recurrenceEndDate: {
    type: Date,
    required: function() {
      return this.isRecurring === true;
    },
    validate: {
      validator: function(value) {
        return value >= this.date;
      },
      message: 'Recurrence end date must be after event start date'
    }
  },
  
  // Event metadata
  status: {
    type: String,
    enum: ['active', 'cancelled', 'postponed'],
    default: 'active'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  attachments: [{
    name: String,
    url: String,
    size: Number,
    mimeType: String
  }],
  
  // System fields
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value < this.date;
      },
      message: 'Reminder must be set before event date'
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if event is upcoming
calendarEventSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date();
});

// Indexes for better query performance
calendarEventSchema.index({ date: 1 });
calendarEventSchema.index({ createdBy: 1 });
calendarEventSchema.index({ targetAudience: 1 });
calendarEventSchema.index({ classroom: 1 });
calendarEventSchema.index({ isRecurring: 1 });

// Pre-save hook to set lastModifiedBy
calendarEventSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.lastModifiedBy = this.createdBy; // In a real app, you'd set the current user
  }
  next();
});

// Query helper for upcoming events
calendarEventSchema.query.upcoming = function() {
  return this.where('date').gte(new Date());
};

// Query helper for events by audience
calendarEventSchema.query.byAudience = function(audience) {
  return this.where('targetAudience', audience);
};

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);