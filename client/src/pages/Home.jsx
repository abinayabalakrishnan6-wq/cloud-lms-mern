import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Video,
  FileText,
  TrendingUp,
  LogIn,
} from 'lucide-react';

const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [demoLoggingIn, setDemoLoggingIn] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        if (res.data.success) {
          setCourses(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleQuickLogin = async (email, password, role) => {
    try {
      setDemoLoggingIn(role);
      const user = await login(email, password);
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Faculty') navigate('/faculty');
      else navigate('/student');
    } catch (err) {
      alert('Login error: ' + err.message);
    } finally {
      setDemoLoggingIn('');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50/70 via-transparent to-slate-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold mb-6 border border-teal-200">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Full-Stack Cloud-Based LMS on MERN Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Empowering Next-Gen Education on the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                Cloud
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              A comprehensive Learning Management System connecting Students, Faculty, and Administrators. Streamlined video lessons, assignment submissions, automated progress tracking, and cloud analytics.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/courses"
                className="px-6 py-3.5 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-md shadow-teal-600/30 hover:bg-teal-700 hover:shadow-lg transition-all flex items-center"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Explore Courses
              </Link>
              <Link
                to={user ? (user.role === 'Admin' ? '/admin' : user.role === 'Faculty' ? '/faculty' : '/student') : '/register'}
                className="px-6 py-3.5 rounded-xl bg-white text-slate-800 font-bold text-sm border border-slate-200 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center"
              >
                {user ? 'Go to My Dashboard' : 'Join as Student / Faculty'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Quick Demo Login Cards */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Instant Demo Access (One-Click Testing)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Student Card */}
              <div className="p-5 rounded-2xl bg-white border border-teal-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    ST
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Student Portal</h4>
                    <p className="text-xs text-slate-500">Alex Morgan</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Browse courses, track progress, watch video lessons, and submit lab assignments.
                </p>
                <button
                  onClick={() => handleQuickLogin('student@lms.com', 'password123', 'Student')}
                  disabled={demoLoggingIn !== ''}
                  className="w-full py-2 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  {demoLoggingIn === 'Student' ? 'Signing in...' : 'Sign in as Student'}
                </button>
              </div>

              {/* Faculty Card */}
              <div className="p-5 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    FA
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Faculty Portal</h4>
                    <p className="text-xs text-slate-500">Prof. David Miller</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Author courses, upload PDFs, create assignments, and review & grade submissions.
                </p>
                <button
                  onClick={() => handleQuickLogin('faculty@lms.com', 'password123', 'Faculty')}
                  disabled={demoLoggingIn !== ''}
                  className="w-full py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  {demoLoggingIn === 'Faculty' ? 'Signing in...' : 'Sign in as Faculty'}
                </button>
              </div>

              {/* Admin Card */}
              <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    AD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Admin Portal</h4>
                    <p className="text-xs text-slate-500">Dr. Eleanor Vance</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Platform analytics, manage student & faculty accounts, oversee course catalogs.
                </p>
                <button
                  onClick={() => handleQuickLogin('admin@lms.com', 'password123', 'Admin')}
                  disabled={demoLoggingIn !== ''}
                  className="w-full py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  {demoLoggingIn === 'Admin' ? 'Signing in...' : 'Sign in as Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              Engineered for Seamless Learning
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              Everything You Need in a Modern LMS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center mb-4">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Video & Materials</h3>
              <p className="text-sm text-slate-600">
                Interactive lesson player with embedded video lectures, downloadable PDFs, and lecture notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Assignments & Grading</h3>
              <p className="text-sm text-slate-600">
                Students submit files and text; faculty score submissions with direct personalized feedback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Progress Tracking</h3>
              <p className="text-sm text-slate-600">
                Real-time percentage completion indicators as students complete lessons and reach 100%.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Role-Based Security</h3>
              <p className="text-sm text-slate-600">
                JWT auth, bcrypt salted hashing, and protected route guards across Student, Faculty, and Admin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Featured Courses</h2>
            <p className="text-sm text-slate-500 mt-1">Explore cloud and engineering courses</p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center"
          >
            View all courses <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
                    {course.category}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold bg-teal-600 text-white shadow-xs">
                    {course.level}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-600">{course.code}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-teal-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={course.faculty?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${course.faculty?.name}`}
                        alt={course.faculty?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                        {course.faculty?.name}
                      </span>
                    </div>

                    <Link
                      to={`/courses/${course._id}`}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
