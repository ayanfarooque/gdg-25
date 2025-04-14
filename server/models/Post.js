const mongoose = require('mongoose');
const validator = require('validator');

const moderationSchema = new mongoose.Schema({
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'mixed'],
    default: 'neutral'
  },
  toxicityScore: {
    type: Number,
    min: [0, 'Toxicity score cannot be negative'],
    max: [1, 'Toxicity score cannot exceed 1'],
    set: v => parseFloat(v.toFixed(3))
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  flaggedReasons: [{
    type: String,
    enum: ['spam', 'harassment', 'hate-speech', 'misinformation', 'off-topic', 'plagiarism', 'inappropriate-content'],
    trim: true
  }],
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1
  },
  _id: false
});

const engagementMetricsSchema = new mongoose.Schema({
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  uniqueViewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  shareCount: {
    type: Number,
    default: 0,
    min: 0
  },
  bookmarkCount: {
    type: Number,
    default: 0,
    min: 0
  },
  clickThroughRate: {
    type: Number,
    min: 0,
    max: 1,
    set: v => parseFloat(v.toFixed(3))
  },
  _id: false
});

const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9\-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens']
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    trim: true,
    minlength: [10, 'Content must be at least 10 characters long'],
    maxlength: [10000, 'Content cannot exceed 10,000 characters']
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Author reference is required'],
    index: true
  },
  community: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Community', 
    required: [true, 'Community reference is required'],
    index: true
  },
  isQuestion: { 
    type: Boolean, 
    default: false 
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  categories: [{
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  }],
  upvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  downvotes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  votes: {
    upvoteCount: {
      type: Number,
      default: 0,
      min: 0
    },
    downvoteCount: {
      type: Number,
      default: 0,
      min: 0
    },
    netScore: {
      type: Number,
      default: 0
    }
  },
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
  commentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  media: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        message: 'Media must be a valid URL'
      }
    },
    type: {
      type: String,
      enum: ['image', 'video', 'document', 'audio', 'embed'],
      required: true
    },
    caption: {
      type: String,
      maxlength: [200, 'Caption cannot exceed 200 characters']
    },
    thumbnail: String,
    dimensions: {
      width: Number,
      height: Number
    },
    duration: Number,
    _id: false
  }],
  attachments: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        message: 'Attachment must be a valid URL'
      }
    },
    name: {
      type: String,
      required: true,
      maxlength: [200, 'Attachment name cannot exceed 200 characters']
    },
    size: Number,
    type: String,
    _id: false
  }],
  links: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        message: 'Link must be a valid URL'
      }
    },
    title: String,
    description: String,
    image: String,
    domain: String,
    _id: false
  }],
  aiModeration: moderationSchema,
  engagement: engagementMetricsSchema,
  status: { 
    type: String, 
    enum: ['draft', 'active', 'flagged', 'removed', 'archived', 'pending-review'], 
    default: 'active',
    index: true
  },
  visibility: {
    type: String,
    enum: ['public', 'community-only', 'restricted'],
    default: 'public'
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      maxlength: [200, 'Edit reason cannot exceed 200 characters']
    },
    _id: false
  }],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  scheduledAt: Date,
  pinnedAt: Date,
  pinnedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  featuredAt: Date,
  featuredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    wordCount: Number,
    readingTime: Number, // in minutes
    language: {
      type: String,
      default: 'en',
      match: [/^[a-z]{2,3}(-[A-Z]{2})?$/, 'Invalid language code']
    },
    seoKeywords: [String],
    canonicalUrl: {
      type: String,
      validate: {
        validator: validator.isURL,
        message: 'Canonical URL must be valid'
      }
    }
  },
  questionDetails: {
    isAnswered: {
      type: Boolean,
      default: false
    },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    },
    answerCount: {
      type: Number,
      default: 0
    }
  },
  flags: [{
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      required: true,
      enum: ['spam', 'inappropriate', 'off-topic', 'misinformation', 'duplicate', 'other']
    },
    comment: {
      type: String,
      maxlength: [200, 'Flag comment cannot exceed 200 characters']
    },
    flaggedAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    _id: false
  }],
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for vote count
postSchema.virtual('voteCount').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Virtual for popularity score
postSchema.virtual('popularityScore').get(function() {
  const ageInHours = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  const voteWeight = this.votes.netScore * 2;
  const commentWeight = this.commentCount * 1.5;
  const viewWeight = this.engagement?.viewCount || 0;
  
  // Score decays over time
  return (voteWeight + commentWeight + viewWeight) / Math.pow(ageInHours + 1, 1.5);
});

// Indexes for better query performance
postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ author: 1, status: 1 });
postSchema.index({ community: 1, status: 1 });
postSchema.index({ 'votes.netScore': -1 });
postSchema.index({ 'popularityScore': -1 });
postSchema.index({ lastActivityAt: -1 });
postSchema.index({ isQuestion: 1, 'questionDetails.isAnswered': 1 });
postSchema.index({ isFeatured: 1, featuredAt: -1 });
postSchema.index({ isPinned: 1, pinnedAt: -1 });

// Pre-save hooks
postSchema.pre('save', function(next) {
  // Generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // Update vote counts
  if (this.isModified('upvotes') || this.isModified('downvotes')) {
    this.votes.upvoteCount = this.upvotes.length;
    this.votes.downvoteCount = this.downvotes.length;
    this.votes.netScore = this.upvotes.length - this.downvotes.length;
  }

  // Update comment count
  if (this.isModified('comments')) {
    this.commentCount = this.comments.length;
  }

  // Update word count and reading time
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.metadata.wordCount = wordCount;
    this.metadata.readingTime = Math.ceil(wordCount / 200); // 200 wpm average
  }

  // Update last activity
  if (this.isModified('comments') || this.isModified('upvotes') || this.isModified('downvotes')) {
    this.lastActivityAt = new Date();
  }

  next();
});

// Static methods
postSchema.statics.findPopular = function(communityId, limit = 10) {
  return this.find({ community: communityId, status: 'active' })
    .sort({ popularityScore: -1 })
    .limit(limit);
};

postSchema.statics.findUnansweredQuestions = function(communityId, limit = 10) {
  return this.find({ 
    community: communityId,
    isQuestion: true,
    'questionDetails.isAnswered': false,
    status: 'active'
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

postSchema.statics.search = function(query, filters = {}) {
  return this.find({
    $text: { $search: query },
    ...filters,
    status: 'active'
  })
  .sort({ score: { $meta: 'textScore' } });
};

// Instance methods
postSchema.methods.addMedia = function(mediaItem) {
  this.media.push(mediaItem);
  return this.save();
};

postSchema.methods.toggleUpvote = function(userId) {
  const upvoteIndex = this.upvotes.indexOf(userId);
  const downvoteIndex = this.downvotes.indexOf(userId);

  if (upvoteIndex === -1) {
    this.upvotes.push(userId);
    if (downvoteIndex !== -1) {
      this.downvotes.splice(downvoteIndex, 1);
    }
  } else {
    this.upvotes.splice(upvoteIndex, 1);
  }

  return this.save();
};

postSchema.methods.markAsAnswered = function(answerId) {
  if (!this.isQuestion) {
    throw new Error('Only question posts can be marked as answered');
  }
  this.questionDetails.isAnswered = true;
  this.questionDetails.acceptedAnswer = answerId;
  return this.save();
};

module.exports = mongoose.model('Post', postSchema);