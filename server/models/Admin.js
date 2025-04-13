const { Schema } = require('mongoose');
const User = require('./userSchema');

const adminSchema = new Schema({
  // Extended contact information
  contactInfo: {
    officeNumber: { 
      type: String,
      validate: {
        validator: function(v) {
          return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },
  },

  // Enhanced permissions system
  permissions: {
    userManagement: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: true },
      update: { type: Boolean, default: true },
      delete: { type: Boolean, default: false },
      permissions: { type: Boolean, default: false }
    },
    contentManagement: {
      create: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      publish: { type: Boolean, default: true },
      archive: { type: Boolean, default: true }
    },
    systemSettings: {
      general: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      backups: { type: Boolean, default: false },
      api: { type: Boolean, default: false }
    },
    reports: {
      view: { type: Boolean, default: true },
      generate: { type: Boolean, default: true },
      export: { type: Boolean, default: true }
    },
    auditLogs: {
      view: { type: Boolean, default: true }
    },
    // Custom permissions can be added dynamically
    customPermissions: Schema.Types.Mixed
  },

  // Security settings
  security: {
    lastPasswordChange: { type: Date, default: Date.now },
    twoFactorEnabled: { type: Boolean, default: true },
    loginAlerts: { type: Boolean, default: true },
    failedLoginAttempts: { type: Number, default: 0 },
    lastFailedLogin: Date,
    ipWhitelist: [String],
    deviceManagement: [{
      deviceId: String,
      deviceType: String,
      lastAccess: Date,
      trusted: Boolean
    }]
  },

  // Comprehensive activity logging
  activityLog: [{
    action: { 
      type: String,
      required: true 
    },
    entityType: String,
    entityId: Schema.Types.ObjectId,
    changes: Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success'
    },
    timestamp: { 
      type: Date, 
      default: Date.now,
      index: true
    }
  }],

  // Administrative metadata
  adminMetadata: {
    accessLevel: {
      type: String,
      enum: ['super', 'global', 'department', 'limited'],
      default: 'department'
    },
    assignedRoles: [{
      type: String,
      enum: ['superadmin', 'admin', 'moderator', 'support', 'auditor'],
      default: 'admin'
    }],
    lastAccessReview: Date,
    nextAccessReview: {
      type: Date,
      default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    }
  },

  // Notification preferences
  notifications: {
    email: {
      userActivity: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true },
      reports: { type: Boolean, default: false }
    },
    push: {
      critical: { type: Boolean, default: true },
      updates: { type: Boolean, default: false }
    },
    frequency: {
      type: String,
      enum: ['immediate', 'daily', 'weekly'],
      default: 'immediate'
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
adminSchema.index({ 'adminMetadata.accessLevel': 1 });
adminSchema.index({ 'permissions.userManagement': 1 });
adminSchema.index({ 'activityLog.timestamp': -1 });

// Virtual for full admin title
adminSchema.virtual('adminTitle').get(function() {
  return `${this.department} Administrator`;
});

// Pre-save hook for security
adminSchema.pre('save', function(next) {
  if (this.isModified('security.failedLoginAttempts') ){
    if (this.security.failedLoginAttempts >= 5) {
      this.security.loginLocked = true;
      this.security.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }
  }
  next();
});

// Static methods
adminSchema.statics.findByDepartment = function(department) {
  return this.find({ 'contactInfo.department': department });
};

// Instance methods
adminSchema.methods.hasPermission = function(permissionPath) {
  const paths = permissionPath.split('.');
  let current = this.permissions;
  
  for (const path of paths) {
    if (current[path] === undefined) return false;
    current = current[path];
    if (typeof current === 'boolean') return current;
  }
  
  return false;
};

adminSchema.methods.logActivity = function(action, metadata = {}) {
  this.activityLog.push({
    action,
    ...metadata,
    ipAddress: metadata.ipAddress || 'system',
    timestamp: new Date()
  });
  return this.save();
};

module.exports = User.discriminator('Admin', adminSchema);