const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add announcement title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please add announcement message'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null, // null means platform-wide
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priority: {
      type: String,
      enum: ['Normal', 'Important', 'Urgent'],
      default: 'Normal',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Announcement', announcementSchema);
