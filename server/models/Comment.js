const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  //parent commment is the comment that the current comment commenting to
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  community: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Community', 
      required: [true, 'Community reference is required'],
      index: true
    },
  aiModeration: {
    sentiment: String,
    toxicityScore: Number,
    isApproved: Boolean,
    flaggedReasons: [String]
  },
  status: { 
    type: String, 
    enum: ['active', 'flagged', 'removed'], 
    default: 'active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);