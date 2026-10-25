import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  BookOpen,
  Clock,
  Users,
  Award,
  PlayCircle,
  FileText,
  CheckCircle2,
  Lock,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.data);
          setIsEnrolled(res.data.isEnrolled);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'Student') {
      alert('Only students can enroll in courses.');
      return;
    }

    try {
      setEnrolling(true);
      const res = await api.post(`/enrollments/${id}`);
      if (res.data.success) {
        setIsEnrolled(true);
        navigate(`/student/learn/${id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Course not found</h2>
        <Link to="/courses" className="mt-4 inline-block text-teal-600 font-bold">
          ← Back to course catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <Link
        to="/courses"
        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to courses
      </Link>

      {/* Hero Header Card */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden text-white relative shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-10 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500 text-white">
                {course.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {course.level}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-800 text-teal-300">
                {course.code}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            {/* Instructor summary */}
            <div className="flex items-center space-x-3 pt-2">
              <img
                src={course.faculty?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${course.faculty?.name}`}
                alt={course.faculty?.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-600"
              />
              <div>
                <p className="text-xs text-slate-400">Course Instructor</p>
                <p className="text-sm font-bold text-white">{course.faculty?.name}</p>
              </div>
            </div>
          </div>

          {/* Right Action Card */}
          <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700 space-y-5">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 rounded-xl object-cover"
            />

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-700">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-teal-400" /> Total Lessons
                </span>
                <span className="font-bold text-white">{course.lessons?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-700">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-teal-400" /> Study Materials
                </span>
                <span className="font-bold text-white">{course.materials?.length || 0} Files</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-700">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-teal-400" /> Enrolled Students
                </span>
                <span className="font-bold text-white">{course.enrolledCount || 0}</span>
              </div>
            </div>

            {isEnrolled ? (
              <Link
                to={`/student/learn/${course._id}`}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Go to Classroom</span>
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
              >
                <GraduationCap className="w-5 h-5" />
                <span>{enrolling ? 'Enrolling...' : 'Enroll in Course (Free)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum / Lessons Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-teal-600" />
              Course Curriculum ({course.lessons?.length || 0} Lessons)
            </h2>

            <div className="space-y-3">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, idx) => (
                  <div
                    key={lesson._id || idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{lesson.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{lesson.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-xs text-slate-400 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {lesson.duration}
                      </span>
                      {lesson.isFreePreview ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          Free Preview
                        </span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No lessons added yet for this course.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Instructor Bio Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              About the Instructor
            </h3>
            <div className="flex items-center space-x-3">
              <img
                src={course.faculty?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${course.faculty?.name}`}
                alt={course.faculty?.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-800">{course.faculty?.name}</h4>
                <p className="text-xs text-slate-500">{course.faculty?.department}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {course.faculty?.bio || 'Experienced university faculty member specializing in computer science research and cloud software development.'}
            </p>
          </div>

          {/* Downloadable Materials Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Study Materials ({course.materials?.length || 0})
            </h3>
            {course.materials && course.materials.length > 0 ? (
              course.materials.map((mat, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-700 truncate pr-2">{mat.title}</span>
                  <span className="text-[10px] uppercase font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    {mat.fileType || 'PDF'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Materials will be available upon enrollment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
