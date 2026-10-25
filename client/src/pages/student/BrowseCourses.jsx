import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Search,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';

const categories = [
  'All',
  'Web Development',
  'AI & Machine Learning',
  'Cybersecurity',
  'Cloud & DevOps',
  'Computer Science',
];

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const BrowseCourses = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [enrollingId, setEnrollingId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedLevel]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel !== 'All') params.level = selectedLevel;
      if (search) params.search = search;

      const courseRes = await api.get('/courses', { params });

      if (courseRes.data.success) {
        setCourses(courseRes.data.data);
      }

      // If student is logged in, fetch their enrolled courses to highlight state
      if (isAuthenticated && user?.role === 'Student') {
        const enrollRes = await api.get('/enrollments/my-courses');
        if (enrollRes.data.success) {
          const ids = new Set(enrollRes.data.data.map((e) => e.course?._id));
          setEnrolledCourseIds(ids);
        }
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'Student') {
      alert('Only students can enroll in courses.');
      return;
    }

    try {
      setEnrollingId(courseId);
      const res = await api.post(`/enrollments/${courseId}`);
      if (res.data.success) {
        setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
        setAlertMessage('🎉 Successfully enrolled! You can now start learning.');
        setTimeout(() => setAlertMessage(null), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not complete enrollment');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore Course Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover cutting-edge engineering, cloud computing, and software development courses
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, code or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {alertMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fade-in">
          <span>{alertMessage}</span>
          <button onClick={() => setAlertMessage(null)} className="font-bold text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Filter Category Tabs & Level selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Level:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course._id);
            return (
              <div
                key={course._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
                      {course.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-xs font-semibold bg-teal-600 text-white shadow-xs">
                      {course.level}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-teal-600">{course.code}</span>
                      <span className="text-xs text-slate-400 flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1" />
                        {course.enrolledCount || 0} students
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="mt-4 flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center">
                        <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {course.lessons?.length || 0} Lessons
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Self-Paced
                      </span>
                    </div>

                    {/* Faculty Info */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                      <img
                        src={course.faculty?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${course.faculty?.name}`}
                        alt={course.faculty?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {course.faculty?.name || 'Faculty Instructor'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center space-x-2">
                  <Link
                    to={`/courses/${course._id}`}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold text-center transition-colors"
                  >
                    Course Details
                  </Link>

                  {isEnrolled ? (
                    <Link
                      to={`/student/learn/${course._id}`}
                      className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold text-center transition-colors flex items-center justify-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resume</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      disabled={enrollingId === course._id}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold text-center transition-colors disabled:opacity-50"
                    >
                      {enrollingId === course._id ? 'Enrolling...' : 'Enroll Free'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
