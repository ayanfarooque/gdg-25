const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController.js');
const { protect, authorize } = require('../middleware/auth.js');
const upload = require('../middleware/multer.js');

// Public routes (none in this case)

// Protected routes (require authentication)
router.use(protect);

// Community CRUD routes
router.route('/')
  .get(communityController.getAllCommunities)
  .post(authorize('admin'), communityController.createCommunity);

router.route('/:id')
  .get(communityController.getCommunity);

// Community membership routes
router.route('/:id/join')
  .post(communityController.joinCommunityRequest);

router.route('/:id/approve')
  .patch(authorize('admin', 'teacher'), communityController.approveJoinRequest);

// Post-related routes
router.route('/:id/posts')
  .get(communityController.getCommunityPosts)
  .post(upload.single('media'), communityController.createPost);

module.exports = router;