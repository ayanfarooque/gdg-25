const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError.js');
const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');
const Admin = require('../models/Admin.js');

/**
 * Middleware to protect routes by verifying JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      // Alternatively get token from cookie
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Get user based on role
    let user;
    switch (decoded.role) {
      case 'student':
        user = await Student.findById(decoded.id);
        break;
      case 'teacher':
        user = await Teacher.findById(decoded.id);
        break;
      case 'admin':
        user = await Admin.findById(decoded.id);
        break;
      default:
        return next(new AppError('Invalid user role', 400));
    }

    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // 4) Grant access
    req.user = user;
    req.user.role = decoded.role; // Add role to request
    next();
  } catch (err) {
    next(err);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

/**
 * Middleware to restrict access based on roles
 * @param {...String} roles - Allowed roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * Middleware to check if user is logged in (for views)
 */
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1) Verify token
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      let user;
      switch (decoded.role) {
        case 'student':
          user = await Student.findById(decoded.id);
          break;
        case 'teacher':
          user = await Teacher.findById(decoded.id);
          break;
        case 'admin':
          user = await Admin.findById(decoded.id);
          break;
      }

      if (!user) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (user.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = user;
      return next();
    }
    next();
  } catch (err) {
    return next();
  }
};

/**
 * Middleware to generate JWT token
 * @param {Object} user - User object
 * @param {Number} statusCode - HTTP status code
 * @param {Object} res - Response object
 */
exports.createSendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};



// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");
// const User = require("../models/User");


// //work pending on this file currenty using it as dummy
// const protect = asyncHandler(async (req, res, next) => {
//     let token;
    
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         try {
//             // Get token from header
//             token = req.headers.authorization.split(" ")[1];
            
//             // Verify token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
//             // Get user from token
//             req.user = await User.findById(decoded.id).select("-password");
            
//             next();
//         } catch (error) {
//             console.error(error);
//             res.status(401);
//             throw new Error("Not authorized");
//         }
//     }
    
//     if (!token) {
//         res.status(401);
//         throw new Error("Not authorized, no token");
//     }
// });

// const authorize = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             res.status(403);
//             throw new Error(`User role ${req.user.role} is not authorized to access this route`);
//         }
//         next();
//     };
// };

// module.exports = { protect, authorize };