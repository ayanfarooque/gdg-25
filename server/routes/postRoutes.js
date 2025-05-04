const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController.js');
const { protect } = require('../middleware/authMiddleware');

router.post('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);

router.post('/createpost', postController.createstudentpost);

module.exports = router;