const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private (Student)
const enrollInCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      progress: 0,
      completedLessons: [],
      status: 'active',
      enrolledAt: new Date(),
    });

    // Increment enrolled count on course
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    const populated = await Enrollment.findById(enrollment._id)
      .populate({
        path: 'course',
        populate: { path: 'faculty', select: 'name email avatar' },
      });

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in student's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'faculty', select: 'name email avatar department' },
      })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark lesson completed / toggle progress
// @route   PUT /api/enrollments/:courseId/lessons/:lessonId/complete
// @access  Private (Student)
const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment record not found for this course',
      });
    }

    const lessonExists = course.lessons.some(
      (l) => l._id.toString() === lessonId
    );
    if (!lessonExists) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const isAlreadyCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (isAlreadyCompleted) {
      // Toggle off
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id) => id.toString() !== lessonId
      );
    } else {
      // Toggle on
      enrollment.completedLessons.push(lessonId);
    }

    const totalLessons = course.lessons.length;
    const completedCount = enrollment.completedLessons.length;
    enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    if (enrollment.progress === 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
    } else {
      enrollment.status = 'active';
      enrollment.completedAt = null;
    }

    await enrollment.save();

    res.json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get enrolled students for a course
// @route   GET /api/enrollments/course/:courseId/students
// @access  Private (Faculty/Admin)
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email department avatar createdAt')
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  updateLessonProgress,
  getCourseStudents,
};
