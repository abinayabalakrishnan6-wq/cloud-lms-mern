const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  updateLessonProgress,
  getCourseStudents,
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:courseId', protect, authorize('Student'), enrollInCourse);
router.get('/my-courses', protect, authorize('Student'), getMyEnrollments);
router.put(
  '/:courseId/lessons/:lessonId/complete',
  protect,
  authorize('Student'),
  updateLessonProgress
);
router.get(
  '/course/:courseId/students',
  protect,
  authorize('Faculty', 'Admin'),
  getCourseStudents
);

module.exports = router;
