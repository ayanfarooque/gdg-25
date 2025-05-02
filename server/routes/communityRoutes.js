const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/multer.js');

// Public routes (none in this case)

// Protected routes (require authentication)
// router.use(protect);

// Community CRUD routes
// router.route('/')
//   .get(communityController.getAllCommunities)
//   .post(authorize('admin'), communityController.createCommunity);

// router.route('/:id')
//   .get(communityController.getCommunity);

// // Community membership routes
// router.route('/:id/join')
//   .post(communityController.joinCommunityRequest);

// router.route('/:id/approve')
//   .patch(authorize('admin', 'teacher'), communityController.approveJoinRequest);

// // Post-related routes
// router.route('/:id/posts')
//   .get(communityController.getCommunityPosts)
//   .post(upload.single('media'), communityController.createPost);

;

// Public routes
router.get('/communities', communityController.getAllCommunities);
router.get('/trending-posts', communityController.getTrendingPosts);
router.get('/recommended-communities', communityController.getRecommendedCommunities);
// router.get('/communities/:id', communityController.getCommunityById);
// Protected routes
router.post('/communities', communityController.createCommunity);
router.post('/communities/:id/join',  communityController.joinCommunity);
// router.post('/communities/:id/leave', protect, communityController.leaveCommunity);
router.post('/communities/:id/posts',  communityController.createPost);
// router.delete('/communities/:id', protect, communityController.deleteCommunity);
module.exports = router;

module.exports = router;