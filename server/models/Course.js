const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '15 mins',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  fileUrl: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 1,
  },
  isFreePreview: {
    type: Boolean,
    default: false,
  },
});

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    default: 'pdf',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: function () {
        return 'CS-' + Math.floor(100 + Math.random() * 900);
      },
    },
    description: {
      type: String,
      required: [true, 'Please add a course description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Computer Science', 'Web Development', 'Data Science', 'Cloud & DevOps', 'Cybersecurity', 'AI & Machine Learning', 'Software Engineering'],
      default: 'Web Development',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessons: [lessonSchema],
    materials: [materialSchema],
    published: {
      type: Boolean,
      default: true,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);
