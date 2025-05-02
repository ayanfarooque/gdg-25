const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  categories: [{
    type: String
  }],
  coverImage: {
    url: String,
    publicId: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['member', 'moderator', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  memberCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  academicLevel: String
}, {
  timestamps: true
});




// const mongoose = require('mongoose');
// const validator = require('validator');

// const communitySchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: [true, 'Community name is required'],
//     unique: true,
//     trim: true,
//     minlength: [3, 'Community name must be at least 3 characters long'],
//     maxlength: [50, 'Community name cannot exceed 50 characters'],
//     match: [/^[a-zA-Z0-9\-_\s]+$/, 'Community name can only contain letters, numbers, spaces, hyphens and underscores']
//   },
//   slug: {
//     type: String,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^[a-z0-9\-_]+$/, 'Slug can only contain lowercase letters, numbers, hyphens and underscores']
//   },
//   description: { 
//     type: String, 
//     required: [true, 'Description is required'],
//     trim: true,
//     minlength: [10, 'Description must be at least 10 characters long'],
//     maxlength: [500, 'Description cannot exceed 500 characters']
//   },
//   shortDescription: {
//     type: String,
//     trim: true,
//     maxlength: [150, 'Short description cannot exceed 150 characters']
//   },
//   grade: { 
//     type: String, 
//     enum: {
//       values: ['9', '10', '11', '12', 'college', 'all'],
//       message: 'Invalid grade level'
//     }, 
//     required: [true, 'Grade level is required']
//   },
//   subject: {
//     type: String,
//     trim: true,
//     maxlength: [50, 'Subject cannot exceed 50 characters']
//   },
//   categories: [{
//     type: String,
//     trim: true,
//     lowercase: true,
//     maxlength: [30, 'Category cannot exceed 30 characters']
//   }],
//   createdBy: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Admin', 
//     required: [true, 'Creator reference is required']
//   },
//   moderators: [{
//     user: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: 'User' 
//     },
//     assignedAt: {
//       type: Date,
//       default: Date.now
//     },
//     assignedBy: {
//         //admin will and can only assign community to members who send the join request of particular community
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Admin'
//     },
//     permissions: [{
//       type: String,
//       enum: ['manage-posts', 'manage-members', 'manage-rules', 'manage-settings']
//     }]
//   }],
//   members: [{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User' 
//   }],
//   pendingMembers: [{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User' 
//   }],
//   bannedMembers: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     bannedAt: {
//       type: Date,
//       default: Date.now
//     },
//     bannedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     reason: {
//       type: String,
//       maxlength: [200, 'Reason cannot exceed 200 characters']
//     },
//     expiresAt: Date
//   }],
//   membershipType: {
//     type: String,
//     enum: ['open', 'approval-required', 'invite-only'],
//     default: 'open'
//   },
//   posts: [{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Post' 
//   }],
//   featuredPosts: [{
//     post: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Post'
//     },
//     featuredAt: {
//       type: Date,
//       default: Date.now
//     },
//     featuredBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     expiresAt: Date
//   }],
//   rules: [{
//     //admin can create community rules
//     text: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: [200, 'Rule cannot exceed 200 characters']
//     },
//     addedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Admin'
//     },
//     addedAt: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   avatar: {
//     type: String,
//     validate: {
//       validator: validator.isURL,
//       message: 'Avatar must be a valid URL',
//       protocols: ['http', 'https'],
//       require_protocol: true
//     }
//   },
//   banner: {
//     type: String,
//     validate: {
//       validator: validator.isURL,
//       message: 'Banner must be a valid URL',
//       protocols: ['http', 'https'],
//       require_protocol: true
//     }
//   },
//   socialLinks: {
//     website: {
//       type: String,
//       validate: {
//         validator: validator.isURL,
//         message: 'Website must be a valid URL'
//       }
//     },
//     discord: String,
//     facebook: String,
//     twitter: String
//   },
//   stats: {
//     memberCount: {
//       type: Number,
//       default: 0,
//       min: [0, 'Member count cannot be negative']
//     },
//     postCount: {
//       type: Number,
//       default: 0,
//       min: [0, 'Post count cannot be negative']
//     },
//     dailyActiveUsers: {
//       type: Number,
//       default: 0,
//       min: [0, 'DAU cannot be negative']
//     },
//     weeklyActiveUsers: {
//       type: Number,
//       default: 0,
//       min: [0, 'WAU cannot be negative']
//     }
//   },
//   privacySettings: {
//     showMembers: {
//       type: Boolean,
//       default: true
//     },
//     showModerators: {
//       type: Boolean,
//       default: true
//     },
//     searchable: {
//       type: Boolean,
//       default: true
//     },
//     postApprovalRequired: {
//       type: Boolean,
//       default: false
//     }
//   },
//   notificationSettings: {
//     newMember: {
//       type: String,
//       enum: ['all', 'mods-only', 'none'],
//       default: 'mods-only'
//     },
//     newPost: {
//       type: String,
//       enum: ['all', 'mods-only', 'none'],
//       default: 'all'
//     },
//     reportedContent: {
//       type: String,
//       enum: ['all-mods', 'assigned-mods', 'none'],
//       default: 'all-mods'
//     }
//   },
//   isActive: { 
//     type: Boolean, 
//     default: true 
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   verificationRequest: {
//     requestedAt: Date,
//     reviewedAt: Date,
//     reviewedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Admin'
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected']
//     },
//     comment: String
//   },
//   metadata: {
//     lastActivity: Date,
//     trendingScore: Number,
//     popularityRank: Number
//   },
//   archivedAt: Date,
//   archivedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Admin'
//   },
//   deletionSettings: {
//     autoDeleteInactive: {
//       type: Boolean,
//       default: false
//     },
//     inactiveDaysThreshold: {
//       type: Number,
//       default: 365,
//       min: [30, 'Threshold must be at least 30 days']
//     }
//   }
// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Virtual for member count
// communitySchema.virtual('memberCount').get(function() {
//   return this.members.length;
// });

// // Virtual for moderator count
// communitySchema.virtual('moderatorCount').get(function() {
//   return this.moderators.length;
// });

// // Virtual for post count
// communitySchema.virtual('postCount').get(function() {
//   return this.posts.length;
// });

// // Indexes for better query performance
// communitySchema.index({ name: 'text', description: 'text', shortDescription: 'text' });
// communitySchema.index({ grade: 1, subject: 1 });
// communitySchema.index({ 'stats.memberCount': -1 });
// communitySchema.index({ 'stats.postCount': -1 });
// communitySchema.index({ 'metadata.lastActivity': -1 });
// communitySchema.index({ 'metadata.trendingScore': -1 });
// communitySchema.index({ isActive: 1, isVerified: 1 });

// // Pre-save hook to generate slug
// communitySchema.pre('save', function(next) {
//   if (!this.slug && this.name) {
//     this.slug = this.name.toLowerCase()
//       .replace(/\s+/g, '-')
//       .replace(/[^\w\-]+/g, '')
//       .replace(/\-\-+/g, '-')
//       .replace(/^-+/, '')
//       .replace(/-+$/, '');
//   }
  
//   // Update stats
//   if (this.isModified('members')) {
//     this.stats.memberCount = this.members.length;
//   }
//   if (this.isModified('posts')) {
//     this.stats.postCount = this.posts.length;
//   }
  
//   next();
// });

// // Static method to find trending communities
// communitySchema.statics.findTrending = function(limit = 10) {
//   return this.find({ isActive: true })
//     .sort({ 'metadata.trendingScore': -1, 'stats.dailyActiveUsers': -1 })
//     .limit(limit);
// };

// // Static method to search communities
// communitySchema.statics.search = function(query, filters = {}) {
//   return this.find({
//     $text: { $search: query },
//     ...filters,
//     isActive: true
//   }).sort({ score: { $meta: 'textScore' } });
// };

// // Instance method to add member
// //i am creating below in community api controller in detail
// communitySchema.methods.addMember = function(userId, isModerator = false) {
//   if (this.members.includes(userId)) {
//     throw new Error('User is already a member');
//   }
  
//   this.members.push(userId);
//   this.stats.memberCount += 1;
  
//   if (isModerator) {
//     this.moderators.push({
//       user: userId,
//       permissions: ['manage-posts', 'manage-members']
//     });
//   }
  
//   return this.save();
// };

// // Instance method to remove member
// communitySchema.methods.removeMember = function(userId) {
//   const memberIndex = this.members.indexOf(userId);
//   if (memberIndex === -1) {
//     throw new Error('User is not a member');
//   }
  
//   this.members.splice(memberIndex, 1);
//   this.stats.memberCount -= 1;
  
//   // Remove from moderators if present
//   this.moderators = this.moderators.filter(mod => mod.user.toString() !== userId.toString());
  
//   return this.save();
// };

// // Instance method to ban member
// communitySchema.methods.banMember = function(userId, moderatorId, reason, durationDays) {
//   this.removeMember(userId);
  
//   const banEntry = {
//     user: userId,
//     bannedBy: moderatorId,
//     reason
//   };
  
//   if (durationDays) {
//     banEntry.expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
//   }
  
//   this.bannedMembers.push(banEntry);
//   return this.save();
// };

// // Instance method to check if user is banned
// communitySchema.methods.isUserBanned = function(userId) {
//   const ban = this.bannedMembers.find(b => b.user.toString() === userId.toString());
//   if (!ban) return false;
  
//   if (ban.expiresAt && ban.expiresAt < new Date()) {
//     return false; // Ban has expired
//   }
  
//   return true;
// };

module.exports = mongoose.model('Community', communitySchema);