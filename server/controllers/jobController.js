const Job = require('../models/Job');
const Application = require('../models/Application');
const jwt = require('jsonwebtoken');

// @desc    Get all active jobs with search, filtering, and pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      jobType,
      workplaceType,
      experienceLevel,
      location,
      minSalary,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'active' };

    // Keyword search (title, companyName, description)
    if (keyword && keyword.trim() !== '') {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { title: regex },
        { companyName: regex },
        { description: regex },
        { location: regex },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Job type filter (Full-time, Part-time, etc.)
    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    // Workplace type filter (On-site, Remote, Hybrid)
    if (workplaceType && workplaceType !== 'All') {
      query.workplaceType = workplaceType;
    }

    // Experience level filter
    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    // Location filter
    if (location && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Minimum salary filter
    if (minSalary && !isNaN(Number(minSalary))) {
      query.salaryMax = { $gte: Number(minSalary) };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'salary-high') {
      sortOptions = { salaryMax: -1 };
    } else if (sort === 'salary-low') {
      sortOptions = { salaryMin: 1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate('employer', 'name email companyName companyLogo')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalJobs / limitNum) || 1;

    res.json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages,
      currentPage: pageNum,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'employer',
      'name email companyName companyLogo companyWebsite companyLocation bio'
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Check if the current user (if logged in) has applied or saved this job
    let hasApplied = false;
    let applicationStatus = null;
    let isSaved = false;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'jobportal_supersecret_jwt_fsd001_26_securekey'
        );
        if (decoded && decoded.id) {
          const application = await Application.findOne({
            job: job._id,
            applicant: decoded.id,
          });
          if (application) {
            hasApplied = true;
            applicationStatus = application.status;
          }

          const User = require('../models/User');
          const user = await User.findById(decoded.id);
          if (user && user.savedJobs && user.savedJobs.includes(job._id)) {
            isSaved = true;
          }
        }
      } catch (err) {
        // Token invalid/expired - continue as guest
      }
    }

    res.json({
      success: true,
      job,
      hasApplied,
      applicationStatus,
      isSaved,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      companyLogo,
      location,
      workplaceType,
      jobType,
      category,
      experienceLevel,
      salaryMin,
      salaryMax,
      currency,
      description,
      requirements,
      responsibilities,
      benefits,
      deadline,
    } = req.body;

    const job = await Job.create({
      title,
      employer: req.user._id,
      companyName: companyName || req.user.companyName || `${req.user.name}'s Company`,
      companyLogo: companyLogo || '',
      location,
      workplaceType: workplaceType || 'On-site',
      jobType: jobType || 'Full-time',
      category,
      experienceLevel: experienceLevel || 'Mid Level',
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      currency: currency || 'USD',
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : typeof requirements === 'string'
        ? requirements.split('\n').filter((item) => item.trim() !== '')
        : [],
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : typeof responsibilities === 'string'
        ? responsibilities.split('\n').filter((item) => item.trim() !== '')
        : [],
      benefits: Array.isArray(benefits)
        ? benefits
        : typeof benefits === 'string'
        ? benefits.split('\n').filter((item) => item.trim() !== '')
        : [],
      deadline: deadline || null,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Employer only, owner)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Make sure user owns the job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job posting',
      });
    }

    // Process array fields if string passed
    const updateData = { ...req.body };
    ['requirements', 'responsibilities', 'benefits'].forEach((field) => {
      if (typeof updateData[field] === 'string') {
        updateData[field] = updateData[field]
          .split('\n')
          .filter((item) => item.trim() !== '');
      }
    });

    job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only, owner)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job posting',
      });
    }

    await job.deleteOne();
    // Delete associated applications
    await Application.deleteMany({ job: job._id });

    res.json({
      success: true,
      message: 'Job posting and associated applications removed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs posted by current employer
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer only)
const getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job categories with counts
// @route   GET /api/jobs/meta/categories
// @access  Public
const getJobCategories = async (req, res, next) => {
  try {
    const categories = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getJobCategories,
};
