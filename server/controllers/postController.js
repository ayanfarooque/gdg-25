const Post = require('../models/Post.js');
const asyncHandler = require('express-async-handler');

exports.createstudentpost = asyncHandler(async (req, res) => {
    try {
        const { title, content, communityId, attachmentType, attachmentUrl } = req.body;

        // Validate required fields
        if (!title || !content || !communityId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create post object
        const postData = {
            title,
            content,
           
            community: communityId,
            attachments: []
        };

        // Add attachment if provided
        if (attachmentType && attachmentUrl) {
            postData.attachments.push({
                type: attachmentType,
                url: attachmentUrl,
                name: title
            });
        }

        // Create the post
        const post = await Post.create(postData);

        // Populate author and return
        const populatedPost = await Post.findById(post._id)
            .populate('author', 'name avatar')
            .populate('community', 'name');

        res.status(201).json({
            success: true,
            data: populatedPost
        });

    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating post',
            error: error.message
        });
    }
});

exports.getAllPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name avatar')
            .populate('community', 'name')
            .sort('-createdAt');

        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching posts',
            error: error.message
        });
    }
});

exports.getPostById = asyncHandler(async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name avatar')
            .populate('community', 'name')
            .populate({
                path: 'comments.author',
                select: 'name avatar'
            });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching post',
            error: error.message
        });
    }
});