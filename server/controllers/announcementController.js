const Announcement = require('../models/Announcement');

// @desc    Get announcements (by course or platform-wide)
// @route   GET /api/announcements
// @access  Public / Private
const getAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.query;
    let query = {};

    if (courseId) {
      query.$or = [{ course: courseId }, { course: null }];
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'name email role avatar')
      .populate('course', 'title code')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Faculty/Admin)
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, courseId, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and message',
      });
    }

    const announcement = await Announcement.create({
      title,
      message,
      course: courseId || null,
      author: req.user._id,
      priority: priority || 'Normal',
    });

    const populated = await Announcement.findById(announcement._id)
      .populate('author', 'name email role avatar')
      .populate('course', 'title code');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Faculty/Admin)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    if (
      announcement.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this announcement',
      });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};
