const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getJobCategories,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getJobs);
router.get('/meta/categories', getJobCategories);

// Employer protected routes
router.get('/employer/my-jobs', protect, authorize('employer'), getEmployerJobs);
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

// Public route with optional auth check for hasApplied/isSaved
router.get('/:id', getJobById);

module.exports = router;
