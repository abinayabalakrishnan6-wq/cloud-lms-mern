const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');

// @desc    Get all published courses (or all for Admin)
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = { published: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .populate('faculty', 'name email avatar department')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get courses taught by logged-in faculty
// @route   GET /api/courses/faculty/my-courses
// @access  Private (Faculty/Admin)
const getFacultyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user._id })
      .populate('faculty', 'name email avatar')
      .sort({ createdAt: -1 });

    // Attach student enrollment count dynamically
    const enriched = await Promise.all(
      courses.map(async (c) => {
        const studentCount = await Enrollment.countDocuments({ course: c._id });
        const assignmentCount = await Assignment.countDocuments({ course: c._id });
        return {
          ...c.toObject(),
          enrolledCount: studentCount,
          assignmentCount,
        };
      })
    );

    res.json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public / Private
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'faculty',
      'name email avatar department bio'
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user is enrolled
    let isEnrolled = false;
    let enrollmentData = null;

    if (req.user) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: course._id,
      });
      if (enrollment) {
        isEnrolled = true;
        enrollmentData = enrollment;
      }
    }

    res.json({
      success: true,
      data: course,
      isEnrolled,
      enrollment: enrollmentData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Faculty/Admin)
const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, code } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course title and description',
      });
    }

    const course = await Course.create({
      title,
      description,
      category: category || 'Web Development',
      level: level || 'Beginner',
      thumbnail:
        thumbnail ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
      code: code || ('CS-' + Math.floor(100 + Math.random() * 900)),
      faculty: req.user._id,
      published: true,
    });

    const populatedCourse = await Course.findById(course._id).populate(
      'faculty',
      'name email avatar'
    );

    res.status(201).json({
      success: true,
      data: populatedCourse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Faculty/Admin)
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership or admin
    if (
      course.faculty.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this course',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('faculty', 'name email avatar');

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Faculty/Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (
      course.faculty.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    await Course.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ course: req.params.id });
    await Assignment.deleteMany({ course: req.params.id });

    res.json({
      success: true,
      message: 'Course and related data removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private (Faculty/Admin)
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (
      course.faculty.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course',
      });
    }

    const { title, description, duration, videoUrl, fileUrl, notes, isFreePreview } =
      req.body;

    const newLesson = {
      title,
      description: description || '',
      duration: duration || '15 mins',
      videoUrl: videoUrl || '',
      fileUrl: fileUrl || '',
      notes: notes || '',
      order: course.lessons.length + 1,
      isFreePreview: !!isFreePreview,
    };

    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lesson from course
// @route   DELETE /api/courses/:id/lessons/:lessonId
// @access  Private (Faculty/Admin)
const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (
      course.faculty.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course',
      });
    }

    course.lessons = course.lessons.filter(
      (l) => l._id.toString() !== req.params.lessonId
    );
    await course.save();

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add study material / PDF to course
// @route   POST /api/courses/:id/materials
// @access  Private (Faculty/Admin)
const addMaterial = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (
      course.faculty.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course',
      });
    }

    let fileUrl = req.body.fileUrl;
    let title = req.body.title || 'Course Material';
    let fileType = req.body.fileType || 'pdf';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      title = req.body.title || req.file.originalname;
      const ext = req.file.originalname.split('.').pop();
      fileType = ext || 'pdf';
    }

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a file or file URL',
      });
    }

    course.materials.push({
      title,
      fileUrl,
      fileType,
      uploadedAt: new Date(),
    });

    await course.save();

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete material from course
// @route   DELETE /api/courses/:id/materials/:materialId
// @access  Private (Faculty/Admin)
const deleteMaterial = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (
      course.faculty.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this course',
      });
    }

    course.materials = course.materials.filter(
      (m) => m._id.toString() !== req.params.materialId
    );
    await course.save();

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
