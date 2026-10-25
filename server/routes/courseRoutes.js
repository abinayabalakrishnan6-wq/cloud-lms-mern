const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getFacultyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  deleteLesson,
  addMaterial,
  deleteMaterial,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Soft auth middleware to populate req.user if token is present
const softAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('Faculty', 'Admin'), createCourse);

router.get(
  '/faculty/my-courses',
  protect,
  authorize('Faculty', 'Admin'),
  getFacultyCourses
);

router.route('/:id')
  .get(softAuth, getCourseById)
  .put(protect, authorize('Faculty', 'Admin'), updateCourse)
  .delete(protect, authorize('Faculty', 'Admin'), deleteCourse);

// Lessons
router.post(
  '/:id/lessons',
  protect,
  authorize('Faculty', 'Admin'),
  addLesson
);
router.delete(
  '/:id/lessons/:lessonId',
  protect,
  authorize('Faculty', 'Admin'),
  deleteLesson
);

// Materials
router.post(
  '/:id/materials',
  protect,
  authorize('Faculty', 'Admin'),
  upload.single('file'),
  addMaterial
);
router.delete(
  '/:id/materials/:materialId',
  protect,
  authorize('Faculty', 'Admin'),
  deleteMaterial
);

module.exports = router;
