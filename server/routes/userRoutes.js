const express = require('express');
const router = express.Router();
const {
  updateProfile,
  toggleSaveJob,
  getSavedJobs,
  getDashboardStats,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateProfile);
router.get('/dashboard-stats', protect, getDashboardStats);

// Job Seeker routes for saved jobs
router.post('/save-job/:jobId', protect, authorize('job_seeker'), toggleSaveJob);
router.get('/saved-jobs', protect, authorize('job_seeker'), getSavedJobs);

module.exports = router;
