import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BrowseCourses from './pages/student/BrowseCourses';
import CourseDetail from './pages/student/CourseDetail';
import AnnouncementsPage from './pages/AnnouncementsPage';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import CourseLearn from './pages/student/CourseLearn';
import StudentAssignments from './pages/student/StudentAssignments';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ManageCourses from './pages/faculty/ManageCourses';
import CreateEditCourse from './pages/faculty/CreateEditCourse';
import SubmissionsReview from './pages/faculty/SubmissionsReview';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminCourses from './pages/admin/AdminCourses';

// Layout with sidebar for dashboards
const DashboardLayout = () => {
  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden bg-slate-50/50">
        <Outlet />
      </main>
    </div>
  );
};

// Layout without sidebar for public pages
const PublicLayout = () => {
  return (
    <main className="flex-1 min-h-[calc(100vh-4rem)]">
      <Outlet />
    </main>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<BrowseCourses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Authenticated Global Profile */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/courses" element={<MyCourses />} />
                <Route path="/student/assignments" element={<StudentAssignments />} />
              </Route>
              {/* Fullscreen classroom view for learning without sidebar clutter */}
              <Route element={<PublicLayout />}>
                <Route path="/student/learn/:id" element={<CourseLearn />} />
              </Route>
            </Route>

            {/* Faculty Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Faculty', 'Admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/faculty" element={<FacultyDashboard />} />
                <Route path="/faculty/courses" element={<ManageCourses />} />
                <Route path="/faculty/courses/new" element={<CreateEditCourse />} />
                <Route path="/faculty/courses/:id/edit" element={<CreateEditCourse />} />
                <Route path="/faculty/submissions" element={<SubmissionsReview />} />
              </Route>
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/courses" element={<AdminCourses />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
