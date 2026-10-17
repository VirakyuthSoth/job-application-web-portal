const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getSeekerApplications,
  getJobApplications,
  getEmployerApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Job Seeker routes
router.post('/:jobId', protect, authorize('job_seeker'), applyForJob);
router.get('/my-applications', protect, authorize('job_seeker'), getSeekerApplications);

// Employer routes
router.get('/employer/all', protect, authorize('employer'), getEmployerApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.patch('/:id/status', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;
