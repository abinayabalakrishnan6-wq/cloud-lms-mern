# 🎓 Cloud-Based Learning Management System (CloudLMS)

A modern, responsive, full-stack **Cloud-Based Learning Management System (LMS)** developed using the **MERN Stack** (MongoDB Atlas, Express.js, React.js, and Node.js) with Tailwind CSS.

Designed for higher education and online academies, CloudLMS provides specialized portals for **Students**, **Faculty**, and **Administrators**—facilitating interactive video learning, curriculum authoring, downloadable study materials, assignment submissions with grading feedback, and real-time database analytics.

---

## 🌟 Key Features

### 1. 🔐 User Authentication & Authorization
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Student`, `Faculty`, and `Admin`.
- **Stateless Authentication**: Secured using JSON Web Tokens (JWT) stored client-side and verified via server-side middleware.
- **Salted Password Hashing**: Passwords encrypted with `bcryptjs` using automatic pre-save hooks.
- **Protected Routing**: React Router v6 guards redirect unauthenticated or unauthorized users automatically.
- **One-Click Demo Access**: Instant pre-populated login buttons for Student, Faculty, and Admin on the login page for rapid evaluator testing.

### 2. 👨‍🎓 Student Dashboard & Classroom
- **Interactive Lesson Player**: Dedicated classroom player with embedded video lectures, formatted study notes, and downloadable course resources.
- **Dynamic Progress Engine**: Marking lessons as completed instantly recalculates overall percentage progress ($0\% \rightarrow 100\%$) and marks the course certified.
- **Browse & Enroll**: Search course catalog by keywords, category tabs, and skill level (Beginner, Intermediate, Advanced).
- **Assignment Submissions**: Submit text solutions, project repository links, or upload document deliverables.
- **Feedback & Grades**: View scores out of 100 along with personalized feedback from instructors.
- **Announcements**: Course-specific and campus-wide notice boards.

### 3. 👩‍🏫 Faculty Dashboard
- **Course Authoring**: Create, edit, and organize courses with categories, difficulty levels, and cover images.
- **Curriculum Builder**: Add structured lessons with video URLs, descriptions, study notes, and free preview flags.
- **Study Materials Upload**: Upload PDFs, slides, and lab guides directly (or link cloud storage assets).
- **Assignment Management**: Set assignment instructions, deadlines, and maximum points.
- **Student Submission Grading**: Review student submissions and assign grades and direct written feedback.

### 4. 🛡️ Admin Dashboard & Analytics
- **Live Platform Metrics**: Real database aggregates for Total Users, Active Courses, Total Enrollments, and Submissions.
- **Discipline Analytics**: Dynamic visual distribution bars showing courses across Computer Science, AI, Web Development, and Cybersecurity.
- **User Directory**: View all registered users, filter by role, toggle active/deactivated status, modify user roles, or delete accounts.
- **Course Supervision**: Publish/unpublish courses, inspect enrollment numbers, and manage catalog listings.
- **Platform Announcements**: Broadcast campus-wide notifications with priority tags (`Urgent`, `Important`, `Normal`).

---

## 🧱 Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, React Router v6, Axios |
| **Backend** | Node.js, Express.js, RESTful API architecture |
| **Database** | MongoDB Atlas (Cloud) / Mongoose ODM (with automatic in-memory fallback for offline testing) |
| **Authentication**| JSON Web Tokens (JWT) & Bcrypt |
| **File Handling** | Multer for static uploads & external cloud storage URLs |

---

## 📁 Project Architecture & Folder Structure

```
mini project/
├── client/                     # React Single Page Application (Vite + Tailwind)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   └── common/         # Navbar, Sidebar, ProtectedRoute, Modal, StatCard
│   │   ├── context/            # AuthContext.jsx (JWT state, login, logout, profile)
│   │   ├── pages/
│   │   │   ├── auth/           # Login.jsx, Register.jsx
│   │   │   ├── student/        # StudentDashboard, BrowseCourses, CourseDetail, CourseLearn, MyCourses, StudentAssignments
│   │   │   ├── faculty/        # FacultyDashboard, ManageCourses, CreateEditCourse, SubmissionsReview
│   │   │   ├── admin/          # AdminDashboard, UserManagement, AdminCourses
│   │   │   ├── AnnouncementsPage.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Home.jsx        # Landing page with hero & instant demo login cards
│   │   │   └── NotFound.jsx
│   │   ├── services/           # api.js (Axios instance with Bearer interceptors)
│   │   ├── App.jsx             # Router definition & layout configuration
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind directives & styles
│   ├── tailwind.config.js
│   ├── vite.config.js          # Proxy /api & /uploads to port 5000
│   └── package.json
│
├── server/                     # Node.js + Express REST API
│   ├── config/
│   │   └── db.js               # MongoDB Atlas connection (with fallback engine)
│   ├── controllers/            # authController, courseController, enrollmentController, assignmentController, adminController, announcementController
│   ├── middleware/             # authMiddleware, uploadMiddleware, errorMiddleware
│   ├── models/                 # User.js, Course.js, Enrollment.js, Assignment.js, Submission.js, Announcement.js
│   ├── routes/                 # authRoutes, courseRoutes, enrollmentRoutes, assignmentRoutes, adminRoutes, announcementRoutes
│   ├── seed/
│   │   └── seedData.js         # Comprehensive demonstration seed data generator
│   ├── uploads/                # Directory for uploaded documents/PDFs
│   ├── .env                    # Active environment variables
│   ├── .env.example            # Environment template
│   ├── server.js               # Express application entry point
│   ├── run-e2e-verification.js # End-to-end API test verification suite
│   └── package.json
│
├── package.json                # Root package configuration
└── README.md                   # Full documentation
```

---

## ⚡ Quick Start & Running Locally

### Prerequisites
- **Node.js** (v18 or higher recommended; v24 installed)
- **npm** (v9 or higher)

### 1. Clone or Open the Workspace
```bash
cd "mini project"
```

### 2. Install Dependencies
Install dependencies for both client and server:
```bash
# In the server folder:
cd server
npm install

# In the client folder:
cd ../client
npm install
cd ..
```

### 3. Initialize Demonstration Data (Optional)
CloudLMS automatically initializes sample demonstration data upon first run if the database is empty. You can also run the seed script directly at any time:
```bash
cd server
node seed/seedData.js
cd ..
```

### 4. Start the Application

You can start the backend and frontend in separate terminals:

**Terminal 1 (Backend API):**
```bash
cd server
npm start
# Runs on http://localhost:5000
```

**Terminal 2 (React Frontend):**
```bash
cd client
npm run dev
# Runs on http://localhost:3000
```

Open your browser and navigate to **`http://localhost:3000`**.

---

## 🔑 Pre-Configured Demo Credentials

For quick evaluation, use the one-click demo buttons on the Login page or use the credentials below:

| Role | Name | Email | Password |
|---|---|---|---|
| **Administrator** | Dr. Eleanor Vance | `admin@lms.com` | `password123` |
| **Faculty** | Prof. David K. Miller | `faculty@lms.com` | `password123` |
| **Faculty (AI/ML)** | Dr. Priya Sharma | `faculty2@lms.com` | `password123` |
| **Student** | Alex Morgan | `student@lms.com` | `password123` |
| **Student** | Emily Chen | `student2@lms.com` | `password123` |

---

## ☁️ MongoDB Atlas Cloud Setup Guide

To connect CloudLMS to your live **MongoDB Atlas** cloud cluster:

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in or create a free account.
2. Create a free **M0 Sandbox Cluster**.
3. Under **Security → Database Access**, create a database user with read/write privileges (e.g., username `lms_admin` and a strong password).
4. Under **Security → Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere) for deployment, or add your current IP address.
5. In **Database Deployments**, click **Connect → Drivers (Node.js)** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/lms_cloud_db?retryWrites=true&w=majority
   ```
6. Open `server/.env` and replace `MONGODB_URI`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/lms_cloud_db?retryWrites=true&w=majority
   JWT_SECRET=lms_super_secret_jwt_key_2025_secure_cloud
   JWT_EXPIRE=30d
   ```
7. Restart the server. The console will display:
   ```
   ✅ MongoDB Atlas Connected: cluster0-shard-00-00.abcde.mongodb.net
   ```

*(Note: CloudLMS includes an automatic in-memory fallback database engine, allowing the app to run completely out of the box even before you enter your MongoDB Atlas credentials.)*

---

## 🌐 Online Cloud Deployment Instructions

### Option A: Unified Monolith Deployment (Render / Railway / Heroku / DigitalOcean)
In production mode, the Express backend serves the compiled React application directly from `client/dist`.

1. **Build the frontend**:
   ```bash
   cd client
   npm run build
   ```
2. **Set environment variables on your cloud provider**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or host provided)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random secret key
3. **Start Command**:
   ```bash
   node server/server.js
   ```

### Option B: Decoupled Deployment (Frontend on Vercel + Backend on Render)
- **Frontend (Vercel)**:
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
- **Backend (Render)**:
  - Root directory: `server`
  - Build command: `npm install`
  - Start command: `node server.js`
  - Add your MongoDB Atlas connection string in Environment Variables.

---

## 📡 RESTful API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`Student`, `Faculty`, `Admin`) |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile |
| `PUT` | `/api/auth/profile` | Private | Update user bio, avatar, name, and department |

### Courses (`/api/courses`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/courses` | Public | List courses (supports search, category, level filters) |
| `GET` | `/api/courses/:id` | Public/Private | Retrieve course details, lessons, materials & status |
| `GET` | `/api/courses/faculty/my-courses` | Faculty/Admin | Get all courses authored by the logged-in instructor |
| `POST` | `/api/courses` | Faculty/Admin | Create a new course |
| `PUT` | `/api/courses/:id` | Faculty/Admin | Update existing course metadata |
| `DELETE` | `/api/courses/:id` | Faculty/Admin | Delete course and cascade remove enrollments |
| `POST` | `/api/courses/:id/lessons` | Faculty/Admin | Add module/lesson with video URL and study notes |
| `DELETE` | `/api/courses/:id/lessons/:lessonId`| Faculty/Admin | Delete a lesson from curriculum |
| `POST` | `/api/courses/:id/materials` | Faculty/Admin | Upload PDF study material or add cloud resource link |
| `DELETE` | `/api/courses/:id/materials/:materialId`| Faculty/Admin| Remove study material |

### Enrollments & Progress (`/api/enrollments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/enrollments/:courseId` | Student | Enroll student into a course |
| `GET` | `/api/enrollments/my-courses` | Student | List courses the student is currently enrolled in |
| `PUT` | `/api/enrollments/:courseId/lessons/:lessonId/complete` | Student | Toggle lesson completion and recalculate progress % |
| `GET` | `/api/enrollments/course/:courseId/students` | Faculty/Admin | Get list of students enrolled in a specific course |

### Assignments & Submissions (`/api/assignments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/assignments` | Faculty/Admin | Create lab assignment with due date and max points |
| `GET` | `/api/assignments/course/:courseId` | Private | List assignments for a course |
| `GET` | `/api/assignments/faculty/all` | Faculty/Admin | Get all assignments created by instructor |
| `POST` | `/api/assignments/:id/submit` | Student | Submit assignment (text description + file/link) |
| `GET` | `/api/assignments/:id/submissions` | Faculty/Admin | Get all student submissions for an assignment |
| `PUT` | `/api/assignments/submissions/:submissionId/grade` | Faculty/Admin | Grade submission (score and feedback notes) |

### Admin & Platform Management (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Real-time platform aggregates and category breakdowns |
| `GET` | `/api/admin/users` | Admin | List all user accounts with search and role filtering |
| `PUT` | `/api/admin/users/:id` | Admin | Update user role or toggle active/deactivated status |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete user account and associated records |

### Announcements (`/api/announcements`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/announcements` | Public/Private | Retrieve bulletins (course or campus-wide) |
| `POST` | `/api/announcements` | Faculty/Admin | Post notice with priority tag (`Urgent`, `Important`, `Normal`)|
| `DELETE` | `/api/announcements/:id` | Faculty/Admin | Delete announcement |

---

## 🧪 Automated End-to-End Test Suite

CloudLMS includes a built-in end-to-end verification script testing all critical routes, JWT validation, database queries, and progress tracking algorithms:

```bash
cd server
node run-e2e-verification.js
```

**Results:**
```
[PASS] 1. Health Check (HTTP 200): Cloud-Based LMS REST API
[PASS] 2. Student Authentication (HTTP 200): Logged in as Alex Morgan (Role: Student)
[PASS] 3. Admin Authentication (HTTP 200): Logged in as Dr. Eleanor Vance (Admin) (Role: Admin)
[PASS] 4. Faculty Authentication (HTTP 200): Logged in as Prof. David K. Miller (Role: Faculty)
[PASS] 5. Fetch Courses Catalog (HTTP 200): Found 4 published courses.
[PASS] 6. Admin Analytics Platform Stats (HTTP 200): Total Users: 5, Courses: 4, Enrollments: 4, Submissions: 2
[PASS] 7. Student Enrolled Courses (HTTP 200): Student is enrolled in 2 courses.
[PASS] 8. Real-time Lesson Progress Calculation (HTTP 200): Progress updated to 50%
🎉 ALL 8 E2E TESTS PASSED WITH 100% SUCCESSFUL VALIDATION!
```

---

## 📜 License
This project is open-source and created for academic mini-project demonstration.
