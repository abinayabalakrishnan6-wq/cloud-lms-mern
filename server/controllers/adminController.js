const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc    Get Admin platform statistics & analytics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalFaculty = await User.countDocuments({ role: 'Faculty' });
    const totalAdmins = await User.countDocuments({ role: 'Admin' });

    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ published: true });

    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });

    const totalAssignments = await Assignment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const gradedSubmissions = await Submission.countDocuments({ status: 'graded' });

    // Category breakdown
    const categoryStats = await Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent enrollments with populated details
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'name email avatar department')
      .populate('course', 'title code thumbnail')
      .sort({ enrolledAt: -1 })
      .limit(6);

    // Recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          students: totalStudents,
          faculty: totalFaculty,
          admins: totalAdmins,
          courses: totalCourses,
          publishedCourses,
          enrollments: totalEnrollments,
          activeEnrollments,
          completedEnrollments,
          assignments: totalAssignments,
          submissions: totalSubmissions,
          gradedSubmissions,
        },
        categoryStats,
        recentEnrollments,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { role, isActive, department, name } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent demoting last admin or self deactivation
    if (user._id.toString() === req.user._id.toString() && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own admin account',
      });
    }

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (department) user.department = department;
    if (name) user.name = name;

    const updated = await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        department: updated.department,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account',
      });
    }

    await User.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ student: req.params.id });
    await Submission.deleteMany({ student: req.params.id });

    res.json({
      success: true,
      message: 'User and associated records deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUser,
  deleteUser,
};
