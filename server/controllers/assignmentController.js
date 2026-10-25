const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Faculty/Admin)
const createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, dueDate, totalPoints, instructions } = req.body;

    if (!courseId || !title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course, title, and due date',
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (
      course.faculty.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create assignments for this course',
      });
    }

    const assignment = await Assignment.create({
      course: courseId,
      faculty: req.user._id,
      title,
      description,
      dueDate,
      totalPoints: totalPoints || 100,
      instructions: instructions || '',
    });

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;

    const assignments = await Assignment.find({ course: courseId })
      .populate('faculty', 'name email avatar')
      .sort({ dueDate: 1 });

    // If student, attach their submission status
    const enriched = await Promise.all(
      assignments.map(async (a) => {
        let mySubmission = null;
        if (req.user.role === 'Student') {
          mySubmission = await Submission.findOne({
            assignment: a._id,
            student: req.user._id,
          });
        }
        const submissionCount = await Submission.countDocuments({ assignment: a._id });

        return {
          ...a.toObject(),
          mySubmission,
          submissionCount,
        };
      })
    );

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all assignments for faculty
// @route   GET /api/assignments/faculty/all
// @access  Private (Faculty/Admin)
const getFacultyAssignments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Faculty') {
      query.faculty = req.user._id;
    }

    const assignments = await Assignment.find(query)
      .populate('course', 'title code')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      assignments.map(async (a) => {
        const submissionCount = await Submission.countDocuments({ assignment: a._id });
        const gradedCount = await Submission.countDocuments({
          assignment: a._id,
          status: 'graded',
        });
        return {
          ...a.toObject(),
          submissionCount,
          gradedCount,
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

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
const submitAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const { submissionText } = req.body;
    let fileUrl = req.body.fileUrl || '';
    let fileName = req.body.fileName || '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    }

    if (!submissionText && !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either text content or an uploaded file/link',
      });
    }

    const isLate = new Date() > new Date(assignment.dueDate);

    // Upsert submission
    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });

    if (submission) {
      submission.submissionText = submissionText || submission.submissionText;
      if (fileUrl) {
        submission.fileUrl = fileUrl;
        submission.fileName = fileName;
      }
      submission.submittedAt = new Date();
      submission.status = isLate ? 'late' : 'submitted';
      await submission.save();
    } else {
      submission = await Submission.create({
        assignment: assignmentId,
        student: req.user._id,
        course: assignment.course,
        submissionText: submissionText || '',
        fileUrl,
        fileName,
        status: isLate ? 'late' : 'submitted',
        submittedAt: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private (Faculty/Admin)
const getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate('student', 'name email department avatar')
      .populate('assignment', 'title totalPoints dueDate')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Grade submission
// @route   PUT /api/assignments/submissions/:submissionId/grade
// @access  Private (Faculty/Admin)
const gradeSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body;

    const submission = await Submission.findById(req.params.submissionId).populate('assignment');
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    submission.score = Number(score);
    submission.feedback = feedback || '';
    submission.status = 'graded';
    submission.gradedBy = req.user._id;
    submission.gradedAt = new Date();

    await submission.save();

    res.json({
      success: true,
      message: 'Submission graded successfully',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAssignment,
  getCourseAssignments,
  getFacultyAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
};
