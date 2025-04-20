const Community = require('../models/Community.js');
const Post = require('../models/Post.js');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');
const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');


exports.getAllCommunities = catchAsync(async (req, res, next) => {
    const filter = {};

    let user;
    //here i am not directly using user schema i am first selecting role from user and then switching to student/teacher schema 
    if (req.user.role === 'student') {
        user = await Student.findById(req.user.id).select('grade');
        filter.grade = user.grade;
    } else if (req.user.role === 'teacher') {
        user = await Teacher.findById(req.user.id).select('gradesTaught subjects');
        filter.$or = [
            { grade: { $in: user.gradesTaught } },
            { subject: { $in: user.subjects.map(s => s.subjectName) } }
        ];
    }

    //no community for admin ofc

    const communities = await Community.find(filter)
        .populate({
            path: 'members',
            select: 'name email profilePicture', 
            model: req.user.role === 'student' ? 'Student' : 'Teacher'
        })
        .populate({
            path: 'moderators',
            select: 'name email profilePicture',
            model: 'Teacher' //will later change it to admin
        });

    res.status(200).json({
        status: 'success',
        results: communities.length,
        data: { 
            communities
        }
    });
});

exports.createCommunity = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new AppError('Only admins can create communities', 403)); 
    }

    const newCommunity = await Community.create({
        ...req.body,
        createdBy: req.user.id,
        moderators: [req.user.id]
    });

    res.status(201).json({
        status: 'success',
        data: {
            community: newCommunity
        }
    });
});

exports.joinCommunityRequest = catchAsync(async (req, res, next) => {
    const community = await Community.findById(req.params.id); // Fixed: was req.user.id

    if (!community) {
        return next(new AppError('No community found with that ID', 404));
    }

    // Check if user is already in community or has pending request
    const isMember = community.members.some(member => member.equals(req.user.id));
    const hasPendingRequest = community.pendingMembers.some(member => member.equals(req.user.id));

    if (isMember || hasPendingRequest) {
        return next(new AppError('You have already joined or requested to join this community', 400));
    }

    community.pendingMembers.push(req.user.id);
    await community.save();

    res.status(200).json({
        status: 'success',
        message: 'Join request sent successfully', 
        data: {
            community
        }
    });
});

exports.approveJoinRequest = catchAsync(async (req, res, next) => {
    const { userId } = req.body;
    const community = await Community.findById(req.params.id);

    if (!community) {
        return next(new AppError('No community found with that ID', 404));
    }

    // Only admin or moderators can approve requests
    const isModerator = community.moderators.some(mod => mod.equals(req.user.id));
    if (!isModerator && req.user.role !== 'admin') {
        return next(new AppError('You do not have permission to approve requests for this community', 403));
    }

    // Check if user has pending request
    const hasPendingRequest = community.pendingMembers.some(member => member.equals(userId));
    if (!hasPendingRequest) {
        return next(new AppError('This user does not have a pending request for this community', 400));
    }

    // Move user from pending to members
    community.pendingMembers = community.pendingMembers.filter(
        id => !id.equals(userId)
    );
    community.members.push(userId);
    await community.save();

    // Update user's joinedCommunities
    if (req.user.role === 'student') {
        await Student.findByIdAndUpdate(userId, {
            $addToSet: { joinedCommunities: community._id }
        });
    } else {
        await Teacher.findByIdAndUpdate(userId, {
            $addToSet: { joinedCommunities: community._id }
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'User added to community successfully',
        data: {
            community
        }
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
    const community = await Community.findById(req.params.id);

    if (!community) {
        return next(new AppError('No community found with that ID', 404));
    }

    // Check if user is a member of this community
    const isMember = community.members.some(member => member.equals(req.user.id));
    if (!isMember) {
        return next(new AppError('You must be a member to post in this community', 403));
    }

    const post = await Post.create({
        title: req.body.title,
        content: req.body.content,
        author: req.user.id,
        authorModel: req.user.role === 'student' ? 'Student' : 'Teacher', // Added authorModel
        community: req.params.id,
        isQuestion: req.body.isQuestion || false,
        tags: req.body.tags || []
    });

    // Add post to community
    community.posts.push(post._id);
    await community.save();

    res.status(201).json({
        status: 'success',
        data: {
            post
        }
    });
});

exports.getCommunityPosts = catchAsync(async (req, res, next) => {
    const community = await Community.findById(req.params.id);

    if (!community) {
        return next(new AppError('No community found with that ID', 404));
    }

    // Check if user is a member of this community
    const isMember = community.members.some(member => member.equals(req.user.id));
    if (!isMember) {
        return next(new AppError('You must be a member to view posts in this community', 403));
    }

    const posts = await Post.find({ community: req.params.id })
        .populate({
            path: 'author',
            select: 'name profilePicture',
            model: req.user.role === 'student' ? 'Student' : 'Teacher'
        })
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'name profilePicture',
                model: req.user.role === 'student' ? 'Student' : 'Teacher'
            }
        })
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: posts.length,
        data: {
            posts
        }
    });
});