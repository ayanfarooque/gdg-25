const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: { 
        type: String, 
        default: 'default-avatar.png'
     },
     role: {
        type: String,
        enum : ['student', 'teacher', 'admin'],
        require: true,
     },
     isActive: {
        type: Boolean,
        default: true,
     },
     lastLogin: {
        type: Date,
     },
     createdAt: {
        type: Date,
        default: Date.now
     },
})

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  
  // Password comparison method
  userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  module.exports = mongoose.model('User', userSchema);