const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
  // Admin fields
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  adminid: {
    type: String,
    required: true
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
  timestamps: true, // Add timestamps
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Create a standalone model instead of a discriminator
module.exports = mongoose.model('Admin', adminSchema);