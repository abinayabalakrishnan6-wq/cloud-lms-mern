const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add assignment title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add assignment description'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Please specify a due date'],
    },
    totalPoints: {
      type: Number,
      default: 100,
    },
    instructions: {
      type: String,
      default: '',
    },
    attachments: [
      {
        title: String,
        fileUrl: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
