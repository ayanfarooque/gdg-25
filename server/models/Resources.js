const mongoose = require('mongoose');
const validator = require('validator');

const fileSchema = new mongoose.Schema({
  url: { 
    type: String, 
    required: [true, 'File URL is required'],
    validate: {
      validator: validator.isURL,
      message: 'Invalid file URL',
      protocols: ['http', 'https'],
      require_protocol: true
    }
  },
  name: { 
    type: String, 
    required: [true, 'File name is required'],
    trim: true,
    maxlength: [255, 'File name cannot exceed 255 characters']
  },
  size: { 
    type: Number, 
    min: [0, 'File size cannot be negative'],
    max: [524288000, 'File size cannot exceed 500MB'] // 500MB limit
  },
  type: {
    type: String,
    required: [true, 'File type is required'],
    enum: {
        //planning to create seprete schema for values in future i will decide it when building its api's according to ease
      values: ['document', 'video', 'audio', 'image', 'archive', 'spreadsheet', 'presentation', 'pdf', 'code', 'other'],
      message: 'Invalid file type'
    }
  },
  mimeType: {
    type: String,
    match: [/^[a-z]+\/[a-z0-9\-+.]+$/i, 'Invalid MIME type format']
  },
  thumbnailUrl: {
    type: String,
    validate: {
      validator: validator.isURL,
      message: 'Invalid thumbnail URL'
    }
  },
  dimensions: {
    width: Number,
    height: Number
  },
  duration: Number, // for audio/video in seconds
  pages: Number, // for documents
  _id: false
});

const resourceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  classroom: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Classroom', 
    required: [true, 'Classroom reference is required'],
    index: true
  },
  uploadedBy: { 
    //here i am not giving reference of teacher specificly as i am panning to add notes section where students too can share resources
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Uploader reference is required'],
    index: true
  },
  file: {
    type: fileSchema,
    required: [true, 'File information is required']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  downloads: { 
    type: Number, 
    default: 0,
    min: [0, 'Download count cannot be negative']
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  accessLevel: {
    type: String,
    enum: ['public', 'class', 'restricted'],
    default: 'class'
  },
  license: {
    type: String,
    enum: ['all-rights-reserved', 'creative-commons', 'public-domain', 'custom'],
    default: 'all-rights-reserved'
  },
  metadata: {
    subject: String,
    topic: String,
    curriculum: String,
    standards: [String],
    language: {
      type: String,
      default: 'en',
      match: [/^[a-z]{2,3}(-[A-Z]{2})?$/, 'Invalid language code']
    },
    version: String,
    authors: [String]
  },
  relatedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  ratings: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: 500
    }
  }],
  averageRating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    set: function(v) { return parseFloat(v.toFixed(1)); }
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvalDate: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'flagged'],
    default: 'published'
  },
  downloadHistory: [{
    downloadedBy: mongoose.Schema.Types.ObjectId,
    downloadedAt: {
      type: Date,
      default: Date.now
    },
    deviceInfo: String,
    ipAddress: String
  }],
  viewHistory: [{
    viewedBy: mongoose.Schema.Types.ObjectId,
    viewedAt: {
      type: Date,
      default: Date.now
    },
    duration: Number // in seconds
  }],
  editHistory: [{
    editedBy: mongoose.Schema.Types.ObjectId,
    editedAt: {
      type: Date,
      default: Date.now
    },
    changes: [String]
  }],
  flags: [{
    flaggedBy: mongoose.Schema.Types.ObjectId,
    reason: String,
    comment: String,
    flaggedAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for resource type icon
resourceSchema.virtual('icon').get(function() {
  const icons = {
    document: 'file-text',
    video: 'film',
    audio: 'music',
    image: 'image',
    archive: 'file-archive',
    spreadsheet: 'file-excel',
    presentation: 'file-powerpoint',
    pdf: 'file-pdf',
    code: 'file-code',
    other: 'file'
  };
  return icons[this.file.type] || icons.other;
});

// Virtual for formatted file size
resourceSchema.virtual('formattedSize').get(function() {
  if (!this.file.size) return 'Unknown';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.file.size) / Math.log(1024));
  return parseFloat((this.file.size / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
});

// Indexes for better query performance
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ 'file.type': 1 });
resourceSchema.index({ classroom: 1, status: 1 });
resourceSchema.index({ 'metadata.subject': 1 });
resourceSchema.index({ averageRating: -1 });
resourceSchema.index({ downloads: -1 });

// Pre-save hook to calculate average rating
resourceSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  next();
});

// Static method to get popular resources
resourceSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'published' })
    .sort({ downloads: -1, averageRating: -1 })
    .limit(limit);
};

// Static method to search resources
resourceSchema.statics.search = function(query, classroomId) {
  return this.find({
    $text: { $search: query },
    classroom: classroomId,
    status: 'published'
  }).sort({ score: { $meta: 'textScore' } });
};

// Instance method to log download
resourceSchema.methods.logDownload = function(userId, deviceInfo, ipAddress) {
  this.downloads += 1;
  this.downloadHistory.push({
    downloadedBy: userId,
    deviceInfo,
    ipAddress
  });
  return this.save();
};

// Instance method to log view
resourceSchema.methods.logView = function(userId, duration) {
  this.views += 1;
  this.viewHistory.push({
    viewedBy: userId,
    duration
  });
  return this.save();
};

module.exports = mongoose.model('Resource', resourceSchema);