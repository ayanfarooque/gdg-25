const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: [
      'classroom-request',
      'community-request',
      'friend-request',
      'assignment-graded',
      'assignment-due',
      'test-announcement',
      'community-post',
      'system-alert'
    ], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedEntity: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedEntityModel' },
  relatedEntityModel: {
    type: String,
    enum: ['Classroom', 'Community', 'Assignment', 'Test', 'Post', 'User']
  },
  isRead: { type: Boolean, default: false },
  actionRequired: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);