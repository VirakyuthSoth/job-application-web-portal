const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker only)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { fullName, email, phone, resumeUrl, coverLetter, portfolioUrl } =
      req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer active',
      });
    }

    // Check if employer is trying to apply to own job
    if (job.employer.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot apply to your own job posting',
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    // Validate required fields
    if (!resumeUrl || resumeUrl.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid resume link or document URL',
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      employer: job.employer,
      fullName: fullName || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone || '',
      resumeUrl: resumeUrl.trim(),
      coverLetter: coverLetter || '',
      portfolioUrl: portfolioUrl || '',
      status: 'Pending',
    });

    // Increment applicant count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    // Save resume to user profile if not yet set
    if (!req.user.resumeUrl && resumeUrl) {
      await User.findByIdAndUpdate(req.user._id, { resumeUrl: resumeUrl.trim() });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by the logged-in job seeker
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker only)
const getSeekerApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        select:
          'title companyName companyLogo location workplaceType jobType category salaryMin salaryMax currency status deadline',
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific job (Employer only)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants for this job',
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email phone avatar headline skills resumeUrl')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      jobTitle: job.title,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for all jobs posted by current employer
// @route   GET /api/applications/employer/all
// @access  Private (Employer only)
const getEmployerApplications = async (req, res, next) => {
  try {
    const { status, jobId } = req.query;

    const query = { employer: req.user._id };
    if (status && status !== 'All') {
      query.status = status;
    }
    if (jobId) {
      query.job = jobId;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'job',
        select: 'title companyName location jobType workplaceType',
      })
      .populate({
        path: 'applicant',
        select: 'name email phone avatar headline skills resumeUrl portfolioUrl',
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Pending, Reviewed, Interviewing, Accepted, Rejected)
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, employerNotes } = req.body;

    const validStatuses = [
      'Pending',
      'Reviewed',
      'Interviewing',
      'Accepted',
      'Rejected',
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Verify ownership
    if (application.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    if (status) application.status = status;
    if (employerNotes !== undefined) application.employerNotes = employerNotes;

    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getSeekerApplications,
  getJobApplications,
  getEmployerApplications,
  updateApplicationStatus,
};
