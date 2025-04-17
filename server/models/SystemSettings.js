const mongoose = require('mongoose');
const { Schema } = mongoose;

const systemSettingsSchema = new Schema({
  // Application branding
  appName: { 
    type: String, 
    default: 'EduPlatform',
    trim: true,
    maxlength: [50, 'App name cannot exceed 50 characters']
  },
  logoUrl: { 
    type: String, 
    default: '/assets/images/default-logo.png',
    validate: {
      validator: function(url) {
        return /\.(png|jpg|jpeg|svg)$/i.test(url);
      },
      message: 'Logo must be a valid image URL (PNG, JPG, JPEG, SVG)'
    }
  },
  faviconUrl: {
    type: String,
    default: '/assets/images/default-favicon.ico'
  },
  themeSettings: {
    primaryColor: {
      type: String,
      default: '#3498db',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex code']
    },
    secondaryColor: {
      type: String,
      default: '#2ecc71',
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex code']
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },

  // System status
  maintenanceMode: { 
    type: Boolean, 
    default: false 
  },
  maintenanceMessage: {
    type: String,
    maxlength: [500, 'Maintenance message cannot exceed 500 characters'],
    trim: true
  },
  maintenanceSchedule: {
    start: Date,
    end: Date,
    message: String
  },
  systemStatus: {
    type: String,
    enum: ['operational', 'degraded', 'partial_outage', 'major_outage'],
    default: 'operational'
  },

  // Registration settings
  registrationSettings: {
    allowStudent: { 
      type: Boolean, 
      default: true 
    },
    allowTeacher: { 
      type: Boolean, 
      default: true 
    },
    allowAdmin: { 
      type: Boolean, 
      default: false 
    },
    verificationRequired: {
      type: Boolean,
      default: true
    },
    verificationMethods: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      manual: { type: Boolean, default: false }
    },
    defaultRole: {
      type: String,
      enum: ['student', 'teacher'],
      default: 'student'
    },
    approvalRequired: {
      type: Boolean,
      default: false
    }
  },

  // Authentication settings
  passwordPolicy: {
    minLength: { 
      type: Number, 
      default: 8,
      min: [6, 'Minimum password length must be at least 6'],
      max: [32, 'Maximum password length cannot exceed 32']
    },
    requireUppercase: { 
      type: Boolean, 
      default: true 
    },
    requireLowercase: { 
      type: Boolean, 
      default: true 
    },
    requireNumbers: { 
      type: Boolean, 
      default: true 
    },
    requireSpecialChars: { 
      type: Boolean, 
      default: true 
    },
    expirationDays: {
      type: Number,
      min: [0, 'Expiration days cannot be negative'],
      default: 90
    },
    historyCount: {
      type: Number,
      min: [0, 'History count cannot be negative'],
      default: 3
    },
    maxAttempts: {
      type: Number,
      min: [1, 'Maximum attempts must be at least 1'],
      default: 5
    },
    lockoutDuration: {
      type: Number, // in minutes
      min: [1, 'Lockout duration must be at least 1 minute'],
      default: 30
    }
  },

  // Session management
  sessionSettings: {
    timeout: {
      type: Number, // in minutes
      default: 30,
      min: [1, 'Session timeout must be at least 1 minute']
    },
    concurrentSessions: {
      type: Number,
      default: 3,
      min: [1, 'Must allow at least 1 concurrent session']
    },
    rememberMeDuration: {
      type: Number, // in days
      default: 7,
      min: [1, 'Remember me duration must be at least 1 day']
    }
  },

  // AI integration settings
  aiSettings: {
    assignmentEvaluation: { 
      type: Boolean, 
      default: true 
    },
    contentModeration: { 
      type: Boolean, 
      default: true 
    },
    testGeneration: { 
      type: Boolean, 
      default: true 
    },
    gradeCardGeneration: { 
      type: Boolean, 
      default: true 
    },
    chatSupport: {
      type: Boolean,
      default: true
    },
    minimumConfidenceThreshold: {
      type: Number,
      default: 0.7,
      min: [0.1, 'Minimum confidence threshold must be at least 0.1'],
      max: [1, 'Maximum confidence threshold cannot exceed 1']
    },
    provider: {
      type: String,
      enum: ['openai', 'anthropic', 'gemini', 'custom'],
      default: 'openai'
    },
    apiKeyLastRotated: Date,
    usageLimits: {
      daily: Number,
      monthly: Number
    }
  },

  // Notification settings
  notificationSettings: {
    email: {
      enabled: { type: Boolean, default: true },
      provider: String,
      fromAddress: String
    },
    sms: {
      enabled: { type: Boolean, default: false },
      provider: String,
      fromNumber: String
    },
    push: {
      enabled: { type: Boolean, default: true }
    },
    defaultPreferences: {
      assignments: { type: Boolean, default: true },
      grades: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    }
  },

  // Academic settings
  academicSettings: {
    gradingScale: {
      'A+': { min: 95, max: 100 },
      'A': { min: 90, max: 94 },
      'A-': { min: 85, max: 89 },
      // ... other grade ranges
    },
    attendanceThreshold: {
      warning: { type: Number, default: 80 }, // percentage
      critical: { type: Number, default: 70 } // percentage
    },
    termDurations: [{
      term: String,
      startDate: Date,
      endDate: Date
    }]
  },

  // Analytics and privacy
  analyticsSettings: {
    enabled: { type: Boolean, default: true },
    retentionPeriod: { // in days
      type: Number,
      default: 365
    },
    anonymizeData: { type: Boolean, default: false }
  },
  privacySettings: {
    gdprCompliance: { type: Boolean, default: false },
    dataExportEnabled: { type: Boolean, default: true },
    dataRetentionPolicy: {
      userData: { type: Number, default: 365 }, // in days
      activityLogs: { type: Number, default: 90 } // in days
    }
  },

  // System metadata
  updatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'Admin',
    required: [true, 'Updated by reference is required']
  },
  version: {
    type: String,
    default: '1.0.0',
    match: [/^\d+\.\d+\.\d+$/, 'Version must be in semantic version format']
  },
  changelog: [{
    version: String,
    changes: [String],
    updatedAt: Date,
    updatedBy: Schema.Types.ObjectId
  }],
  backupSettings: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    lastBackup: Date,
    retentionCount: {
      type: Number,
      default: 7
    }
  }
}, { 
  timestamps: true,
  minimize: false // Ensure empty objects are stored
});

// Indexes
systemSettingsSchema.index({ maintenanceMode: 1 });
systemSettingsSchema.index({ 'systemStatus': 1 });

// Pre-save hooks
systemSettingsSchema.pre('save', function(next) {
  // Validate maintenance schedule
  if (this.maintenanceSchedule && this.maintenanceSchedule.start && this.maintenanceSchedule.end) {
    if (this.maintenanceSchedule.start >= this.maintenanceSchedule.end) {
      throw new Error('Maintenance end time must be after start time');
    }
  }

  // Update version in changelog if specific fields change
  const importantFields = ['appName', 'logoUrl', 'themeSettings', 'passwordPolicy', 'aiSettings'];
  if (importantFields.some(field => this.isModified(field))) {
    if (!this.changelog) this.changelog = [];
    this.changelog.push({
      version: this.version,
      changes: this.modifiedPaths(),
      updatedAt: new Date(),
      updatedBy: this.updatedBy
    });
  }

  next();
});

// Static methods
systemSettingsSchema.statics.getCurrentSettings = async function() {
  return this.findOne().sort({ createdAt: -1 }).limit(1);
};

systemSettingsSchema.statics.isMaintenanceScheduled = async function() {
  const now = new Date();
  return this.exists({
    'maintenanceSchedule.start': { $lte: now },
    'maintenanceSchedule.end': { $gte: now }
  });
};

// Virtual for password policy description
systemSettingsSchema.virtual('passwordPolicyDescription').get(function() {
  const policy = this.passwordPolicy;
  let desc = `Minimum ${policy.minLength} characters`;
  
  if (policy.requireUppercase) desc += ', uppercase letters';
  if (policy.requireLowercase) desc += ', lowercase letters';
  if (policy.requireNumbers) desc += ', numbers';
  if (policy.requireSpecialChars) desc += ', special characters';
  
  if (policy.expirationDays > 0) {
    desc += `. Expires after ${policy.expirationDays} days`;
  }
  
  return desc;
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);