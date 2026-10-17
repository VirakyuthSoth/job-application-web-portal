const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      name,
      phone,
      headline,
      bio,
      avatar,
      skills,
      resumeUrl,
      portfolioUrl,
      companyName,
      companyWebsite,
      companyLocation,
    } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    if (user.role === 'job_seeker') {
      if (skills !== undefined) {
        user.skills = Array.isArray(skills)
          ? skills
          : skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
      if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
      if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
    }

    if (user.role === 'employer') {
      if (companyName !== undefined) user.companyName = companyName;
      if (companyWebsite !== undefined) user.companyWebsite = companyWebsite;
      if (companyLocation !== undefined) user.companyLocation = companyLocation;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle save/bookmark a job
// @route   POST /api/users/save-job/:jobId
// @access  Private (Job Seeker only)
const toggleSaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const user = await User.findById(req.user._id);
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    const isAlreadySaved = user.savedJobs.some(
      (id) => id.toString() === jobId.toString()
    );

    if (isAlreadySaved) {
      user.savedJobs = user.savedJobs.filter(
        (id) => id.toString() !== jobId.toString()
      );
    } else {
      user.savedJobs.push(jobId);
    }

    await user.save();

    res.json({
      success: true,
      saved: !isAlreadySaved,
      message: isAlreadySaved ? 'Job removed from saved' : 'Job saved successfully',
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private (Job Seeker only)
const getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      populate: { path: 'employer', select: 'name companyName companyLogo' },
    });

    res.json({
      success: true,
      savedJobs: user.savedJobs || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for current user
// @route   GET /api/users/dashboard-stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    if (req.user.role === 'employer') {
      const [totalJobs, activeJobs, applications] = await Promise.all([
        Job.countDocuments({ employer: req.user._id }),
        Job.countDocuments({ employer: req.user._id, status: 'active' }),
        Application.find({ employer: req.user._id }),
      ]);

      const totalApplicants = applications.length;
      const pendingApplicants = applications.filter(
        (app) => app.status === 'Pending'
      ).length;
      const shortlistedApplicants = applications.filter((app) =>
        ['Reviewed', 'Interviewing', 'Accepted'].includes(app.status)
      ).length;

      return res.json({
        success: true,
        role: 'employer',
        stats: {
          totalJobs,
          activeJobs,
          totalApplicants,
          pendingApplicants,
          shortlistedApplicants,
        },
      });
    } else {
      const [applications, user] = await Promise.all([
        Application.find({ applicant: req.user._id }),
        User.findById(req.user._id),
      ]);

      const totalApplied = applications.length;
      const pending = applications.filter((app) => app.status === 'Pending').length;
      const interviewing = applications.filter(
        (app) => app.status === 'Interviewing'
      ).length;
      const accepted = applications.filter((app) => app.status === 'Accepted').length;
      const savedCount = user.savedJobs ? user.savedJobs.length : 0;

      return res.json({
        success: true,
        role: 'job_seeker',
        stats: {
          totalApplied,
          pending,
          interviewing,
          accepted,
          savedCount,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  toggleSaveJob,
  getSavedJobs,
  getDashboardStats,
};
