const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getCourseAssignments,
  getFacultyAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, authorize('Faculty', 'Admin'), createAssignment);
router.get('/course/:courseId', protect, getCourseAssignments);
router.get(
  '/faculty/all',
  protect,
  authorize('Faculty', 'Admin'),
  getFacultyAssignments
);
router.post(
  '/:id/submit',
  protect,
  authorize('Student'),
  upload.single('file'),
  submitAssignment
);
router.get(
  '/:id/submissions',
  protect,
  authorize('Faculty', 'Admin'),
  getAssignmentSubmissions
);
router.put(
  '/submissions/:submissionId/grade',
  protect,
  authorize('Faculty', 'Admin'),
  gradeSubmission
);

module.exports = router;
