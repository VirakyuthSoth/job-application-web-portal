const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'jobportal_supersecret_jwt_fsd001_26_securekey',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      headline,
      bio,
      companyName,
      companyWebsite,
      companyLocation,
      skills,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    // Role validation
    const assignedRole = role === 'employer' ? 'employer' : 'job_seeker';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      headline: headline || (assignedRole === 'employer' ? 'Hiring Manager' : 'Job Seeker'),
      bio: bio || '',
      companyName: assignedRole === 'employer' ? companyName || `${name}'s Company` : '',
      companyWebsite: companyWebsite || '',
      companyLocation: companyLocation || '',
      skills: Array.isArray(skills) ? skills : [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        headline: user.headline,
        bio: user.bio,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
        portfolioUrl: user.portfolioUrl,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        companyLocation: user.companyLocation,
        savedJobs: user.savedJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user (must explicitly select password since select: false)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        headline: user.headline,
        bio: user.bio,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
        portfolioUrl: user.portfolioUrl,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        companyLocation: user.companyLocation,
        savedJobs: user.savedJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
