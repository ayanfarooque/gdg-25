const mongoose = require('mongoose');
const { Schema } = mongoose;

const newsSchema = new Schema({
  // Basic news information
  title: { 
    type: String, 
    required: [true, 'News title is required'],
    trim: true,
    maxlength: [120, 'News title cannot exceed 120 characters'],
    minlength: [10, 'News title must be at least 10 characters']
  },
  content: { 
    type: String, 
    required: [true, 'News content is required'],
    minlength: [50, 'News content must be at least 50 characters']
  },
  excerpt: {
    type: String,
    maxlength: [200, 'Excerpt cannot exceed 200 characters'],
    trim: true
  },

  // Author information
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Author is required'],
    immutable: true
  },
  lastEditedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  // Audience targeting
  targetAudience: { 
    type: String, 
    enum: {
      values: ['all', 'students', 'teachers', 'specific-grade', 'specific-class'],
      message: '{VALUE} is not a valid target audience'
    }, 
    required: [true, 'Target audience is required']
  },
  grade: { 
    type: String, 
    enum: {
      values: ['9', '10', '11', '12', 'college', 'all'],
      message: '{VALUE} is not a valid grade level'
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
    },
    validate: {
      validator: async function(value) {
        if (this.targetAudience === 'specific-class') {
          const classroom = await mongoose.model('Classroom').findById(value);
          return classroom !== null;
        }
        return true;
      },
      message: 'Classroom does not exist'
    }
  },

  // Content categorization
  tags: {
    type: [String],
    validate: {
      validator: function(tags) {
        return tags.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    },
    set: function(tags) {
      return tags.map(tag => tag.toLowerCase().trim());
    }
  },
  category: {
    type: String,
    enum: ['announcement', 'event', 'achievement', 'general', 'academic'],
    default: 'general'
  },

  // Media attachments
  imageUrl: {
    type: String,
    validate: {
      validator: function(url) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(url);
      },
      message: 'Invalid image URL format'
    }
  },
  attachments: [{
    name: String,
    url: String,
    size: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Display settings
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    validate: {
      validator: function(value) {
        return !this.isPublished || value !== undefined;
      },
      message: 'Published date is required when news is published'
    }
  },
  expiryDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > this.publishedAt;
      },
      message: 'Expiry date must be after publish date'
    }
  },

  // Engagement metrics
  views: { 
    type: Number, 
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  commentsCount: {
    type: Number,
    default: 0,
    min: 0
  },

  // SEO and sharing
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if news is active
newsSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.isPublished && 
         (!this.publishedAt || this.publishedAt <= now) &&
         (!this.expiryDate || this.expiryDate >= now);
});

// Indexes for better query performance
newsSchema.index({ title: 'text', content: 'text', tags: 'text' });
newsSchema.index({ author: 1 });
newsSchema.index({ targetAudience: 1 });
newsSchema.index({ isFeatured: 1 });
newsSchema.index({ isPublished: 1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ views: -1 });

// Pre-save hooks
newsSchema.pre('save', function(next) {
  // Set publishedAt if being published
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Generate slug if not provided
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/-+/g, '-')      // Replace multiple - with single -
      .substring(0, 50);        // Limit length
  }
  
  // Set lastEditedBy
  if (this.isModified() && !this.isNew) {
    this.lastEditedBy = this.author; // In real app, set to current user
  }
  
  next();
});

// Query helper for published news
newsSchema.query.published = function() {
  const now = new Date();
  return this.where('isPublished', true)
    .where('publishedAt').lte(now)
    .where({ $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] });
};

// Query helper for featured news
newsSchema.query.featured = function() {
  return this.where('isFeatured', true);
};

// Query helper for news by audience
newsSchema.query.byAudience = function(audience) {
  return this.where('targetAudience', audience);
};

// Static method to increment views
newsSchema.statics.incrementViews = async function(id) {
  return this.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
};

module.exports = mongoose.model('News', newsSchema);