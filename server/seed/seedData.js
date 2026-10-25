const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Announcement = require('../models/Announcement');

const populateSeedData = async () => {
  // Clear existing data
  await User.deleteMany();
  await Course.deleteMany();
  await Enrollment.deleteMany();
  await Assignment.deleteMany();
  await Submission.deleteMany();
  await Announcement.deleteMany();

  console.log('🧹 Existing collections cleared for fresh seed');

  // 1. Create Users
  const admin = await User.create({
    name: 'Dr. Eleanor Vance (Admin)',
    email: 'admin@lms.com',
    password: 'password123',
    role: 'Admin',
    department: 'University Administration',
    bio: 'Chief System Administrator & Dean of Online Academic Affairs.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop&crop=faces',
  });

  const faculty1 = await User.create({
    name: 'Prof. David K. Miller',
    email: 'faculty@lms.com',
    password: 'password123',
    role: 'Faculty',
    department: 'Computer Science',
    bio: 'Senior Professor of Cloud Computing and Full-Stack Engineering with 12+ years of research and industry experience.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&crop=faces',
  });

  const faculty2 = await User.create({
    name: 'Dr. Priya Sharma',
    email: 'faculty2@lms.com',
    password: 'password123',
    role: 'Faculty',
    department: 'AI & Data Science',
    bio: 'Lead AI Researcher specializing in Deep Learning, PyTorch, and Computer Vision architectures.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&crop=faces',
  });

  const student1 = await User.create({
    name: 'Alex Morgan',
    email: 'student@lms.com',
    password: 'password123',
    role: 'Student',
    department: 'Computer Science',
    bio: 'Undergraduate student passionate about cloud distributed systems and modern web applications.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&fit=crop&crop=faces',
  });

  const student2 = await User.create({
    name: 'Emily Chen',
    email: 'student2@lms.com',
    password: 'password123',
    role: 'Student',
    department: 'Software Engineering',
    bio: 'Honors student focusing on scalable microservices, UI engineering, and database design.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&fit=crop&crop=faces',
  });

  console.log('👤 Users seeded: Admin, 2 Faculty, 2 Students');

  // 2. Create Courses
  const course1 = await Course.create({
    title: 'Full-Stack Cloud Architecture with MERN',
    code: 'CS-401',
    description: 'Master full-stack web application development using MongoDB Atlas, Express.js, React, Node.js, and modern cloud deployment pipelines.',
    category: 'Web Development',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    faculty: faculty1._id,
    published: true,
    enrolledCount: 2,
    lessons: [
      {
        title: 'Introduction to Cloud Architectures & MERN Stack',
        description: 'Understanding client-server separation, RESTful conventions, and MongoDB Atlas cloud database setup.',
        duration: '35 mins',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        notes: 'Key Takeaways:\n1. Stateless REST APIs decouple client and server.\n2. MongoDB Atlas clusters provide automatic sharding and replication.\n3. JWT Bearer authorization provides scalable session tokens.',
        order: 1,
        isFreePreview: true,
      },
      {
        title: 'Securing APIs with JWT Authentication and Bcrypt',
        description: 'Implementing token-based authentication, salted password hashing, and role-based route middleware.',
        duration: '45 mins',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        notes: 'Always hash passwords before saving with pre-save hooks and verify payload signatures on every authenticated request.',
        order: 2,
        isFreePreview: false,
      },
      {
        title: 'Designing MongoDB Schemas & Complex Relationships',
        description: 'Mongoose models, embedding versus referencing, validation, and indexing for high performance.',
        duration: '40 mins',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        notes: 'Referencing is preferred for unbounded growth (e.g., student submissions), while embedding works best for atomic entity attributes.',
        order: 3,
        isFreePreview: false,
      },
      {
        title: 'Building Interactive Frontends with React & Tailwind CSS',
        description: 'Modern component architecture, custom hooks, React Router v6 guards, and responsive Tailwind layouts.',
        duration: '50 mins',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        notes: 'Use Context API for global auth state and clean separation of presentation and business logic.',
        order: 4,
        isFreePreview: false,
      },
    ],
    materials: [
      {
        title: 'Syllabus & Lecture Notes Pack (PDF)',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
      {
        title: 'Cloud LMS REST API Reference Specification',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
    ],
  });

  const course2 = await Course.create({
    title: 'Deep Learning & Neural Networks with PyTorch',
    code: 'AI-502',
    description: 'Explore neural network foundations, backpropagation, CNNs, Transformers, and training models on cloud GPU clusters.',
    category: 'AI & Machine Learning',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    faculty: faculty2._id,
    published: true,
    enrolledCount: 1,
    lessons: [
      {
        title: 'Tensors, Autograd & Mathematical Foundations',
        description: 'Vector calculus, matrix multiplications, and tensor operations in PyTorch.',
        duration: '45 mins',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        notes: 'Autograd records computational graphs dynamically for automatic gradient computation during backward passes.',
        order: 1,
        isFreePreview: true,
      },
      {
        title: 'Convolutional Neural Networks for Image Recognition',
        description: 'Kernels, feature maps, pooling layers, and building ResNet architectures.',
        duration: '60 mins',
        notes: 'Convolutions exploit spatial locality to drastically reduce model parameters compared to fully connected layers.',
        order: 2,
        isFreePreview: false,
      },
    ],
    materials: [
      {
        title: 'Neural Networks Mathematical Cheatsheet',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
    ],
  });

  const course3 = await Course.create({
    title: 'Cloud Security & Ethical Hacking Protocols',
    code: 'SEC-305',
    description: 'Defend distributed systems, conduct vulnerability scanning, and implement zero-trust cloud network security.',
    category: 'Cybersecurity',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    faculty: faculty1._id,
    published: true,
    enrolledCount: 1,
    lessons: [
      {
        title: 'OWASP Top 10 Vulnerabilities Explained',
        description: 'SQL/NoSQL injection, Broken Access Control, and XSS attack vectors with live remediation.',
        duration: '40 mins',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        order: 1,
        isFreePreview: true,
      },
    ],
    materials: [
      {
        title: 'Cloud Security Audit Checklist (PDF)',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'pdf',
      },
    ],
  });

  const course4 = await Course.create({
    title: 'DevOps & Cloud Native Kubernetes Deployment',
    code: 'CLD-410',
    description: 'Containerize microservices with Docker, manage container orchestration with Kubernetes, and automate CI/CD.',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    faculty: faculty1._id,
    published: true,
    enrolledCount: 0,
    lessons: [
      {
        title: 'Dockerizing Microservices from Scratch',
        description: 'Multi-stage builds, alpine images, and layer caching techniques.',
        duration: '30 mins',
        order: 1,
        isFreePreview: true,
      },
    ],
  });

  console.log('📚 Courses seeded: 4 courses with modules and lessons');

  // 3. Create Enrollments
  const lesson1Id = course1.lessons[0]._id;
  const lesson2Id = course1.lessons[1]._id;

  // Alex Morgan enrolled in Course 1 (50% progress - 2 out of 4 lessons)
  await Enrollment.create({
    student: student1._id,
    course: course1._id,
    completedLessons: [lesson1Id, lesson2Id],
    progress: 50,
    status: 'active',
    enrolledAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
  });

  // Emily Chen enrolled in Course 1 (100% completed)
  await Enrollment.create({
    student: student2._id,
    course: course1._id,
    completedLessons: course1.lessons.map((l) => l._id),
    progress: 100,
    status: 'completed',
    enrolledAt: new Date(Date.now() - 14 * 24 * 3600 * 1000),
    completedAt: new Date(),
  });

  // Alex Morgan enrolled in Course 2 (0% progress)
  await Enrollment.create({
    student: student1._id,
    course: course2._id,
    completedLessons: [],
    progress: 0,
    status: 'active',
    enrolledAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
  });

  // Emily Chen enrolled in Course 3 (100% progress)
  await Enrollment.create({
    student: student2._id,
    course: course3._id,
    completedLessons: course3.lessons.map((l) => l._id),
    progress: 100,
    status: 'completed',
    enrolledAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    completedAt: new Date(),
  });

  console.log('🎓 Enrollments seeded');

  // 4. Create Assignments
  const assignment1 = await Assignment.create({
    course: course1._id,
    faculty: faculty1._id,
    title: 'Lab 1: Design and Implement a Secure JWT Authentication Service',
    description: 'Build a Node.js & Express RESTful service featuring registration, salted password hashing, JWT generation, and protected middleware routes.',
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000),
    totalPoints: 100,
    instructions: 'Submit a link to your GitHub repository or zip archive of your source code, along with sample Postman test logs.',
  });

  const assignment2 = await Assignment.create({
    course: course1._id,
    faculty: faculty1._id,
    title: 'Lab 2: Responsive Course Dashboard with Tailwind CSS',
    description: 'Create a responsive React front-end interface with modern course cards, progress indicators, and interactive modals.',
    dueDate: new Date(Date.now() + 18 * 24 * 3600 * 1000),
    totalPoints: 100,
    instructions: 'Ensure full responsiveness on mobile, tablet, and desktop viewports.',
  });

  const assignment3 = await Assignment.create({
    course: course2._id,
    faculty: faculty2._id,
    title: 'Mini-Project: Train a CNN on CIFAR-10 Dataset',
    description: 'Implement a Convolutional Neural Network in PyTorch with Data Augmentation and Dropout to achieve >85% validation accuracy.',
    dueDate: new Date(Date.now() + 12 * 24 * 3600 * 1000),
    totalPoints: 100,
    instructions: 'Include loss/accuracy graphs and confusion matrix in your submission report.',
  });

  console.log('📝 Assignments seeded');

  // 5. Create Submissions
  await Submission.create({
    assignment: assignment1._id,
    student: student1._id,
    course: course1._id,
    submissionText: 'I have completed the JWT authentication API with bcrypt salt rounds of 10 and implemented unit tests verifying unauthorized 401 status codes.',
    fileUrl: 'https://github.com/alexmorgan/jwt-auth-lab',
    fileName: 'alex_morgan_jwt_lab.zip',
    status: 'graded',
    score: 96,
    feedback: 'Excellent clean architecture, error handling middleware was thoroughly designed. Good job!',
    gradedBy: faculty1._id,
    gradedAt: new Date(),
  });

  await Submission.create({
    assignment: assignment1._id,
    student: student2._id,
    course: course1._id,
    submissionText: 'Implemented with refresh token rotation and automated Swagger documentation.',
    fileUrl: 'https://github.com/emilychen/mern-auth-service',
    fileName: 'emily_chen_lab1.pdf',
    status: 'submitted',
    score: null,
    feedback: '',
  });

  console.log('📬 Submissions seeded');

  // 6. Create Announcements
  await Announcement.create({
    title: 'Welcome to Cloud LMS Academic Portal',
    message: 'Welcome all students and faculty! Our high-performance cloud learning platform is now live. Please review your enrolled courses and upcoming submission deadlines.',
    course: null,
    author: admin._id,
    priority: 'Important',
  });

  await Announcement.create({
    title: 'CS-401: Live Office Hours & Q&A Session Scheduled',
    message: 'Join us this Thursday at 4:00 PM EST for a live walk-through of MongoDB aggregation pipelines and project milestones.',
    course: course1._id,
    author: faculty1._id,
    priority: 'Normal',
  });

  console.log('📢 Announcements seeded');
};

module.exports = populateSeedData;

// Run directly if called as CLI script
if (require.main === module) {
  const mongoose = require('mongoose');
  const dotenv = require('dotenv');
  dotenv.config();

  (async () => {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lms_cloud_db';
      console.log(`Connecting to MongoDB for seeding: ${uri}...`);
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      } catch (err) {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongodInstance = await MongoMemoryServer.create();
        await mongoose.connect(mongodInstance.getUri());
      }
      await populateSeedData();
      console.log('🎉 Seeding successfully completed!');
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
