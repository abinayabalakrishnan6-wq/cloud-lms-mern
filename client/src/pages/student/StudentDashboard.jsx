import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlayCircle,
  FileCheck,
  AlertCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [enrollRes, annRes] = await Promise.all([
          api.get('/enrollments/my-courses'),
          api.get('/announcements'),
        ]);

        if (enrollRes.data.success) {
          setEnrollments(enrollRes.data.data);
        }
        if (annRes.data.success) {
          setAnnouncements(annRes.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.progress === 100).length;
  const inProgressCourses = enrollments.filter((e) => e.progress < 100).length;
  const avgProgress =
    totalEnrolled > 0
      ? Math.round(
          enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) /
            totalEnrolled
        )
      : 0;

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-32 bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 sm:p-8 text-white shadow-lg shadow-teal-600/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Academic Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="mt-2 text-teal-100 text-sm sm:text-base leading-relaxed">
            You are enrolled in <span className="font-bold text-white">{totalEnrolled} courses</span> with an overall progress average of <span className="font-bold text-white">{avgProgress}%</span>. Keep up the great work!
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/courses"
              className="px-4 py-2 rounded-xl bg-white text-teal-800 text-xs font-bold hover:bg-teal-50 transition-colors shadow-xs"
            >
              Browse Catalog
            </Link>
            <Link
              to="/student/assignments"
              className="px-4 py-2 rounded-xl bg-teal-800/60 hover:bg-teal-800 text-white text-xs font-bold transition-colors border border-white/20"
            >
              View Deadlines
            </Link>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={totalEnrolled}
          subtitle="Active subjects"
          icon={BookOpen}
          color="teal"
        />
        <StatCard
          title="In Progress"
          value={inProgressCourses}
          subtitle="Courses underway"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={completedCourses}
          subtitle="Finished courses"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Avg Progress"
          value={`${avgProgress}%`}
          subtitle="Platform overall"
          icon={GraduationCap}
          color="purple"
        />
      </div>

      {/* Continue Learning Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
            <p className="text-xs text-slate-500">Pick up right where you left off</p>
          </div>
          <Link
            to="/student/courses"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center"
          >
            All my courses <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">You haven't enrolled in any courses yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Explore our wide variety of computer science, web development, and cloud computing courses.
            </p>
            <Link
              to="/courses"
              className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-sm hover:bg-teal-700 transition-colors"
            >
              Browse Catalog Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((item) => {
              const course = item.course;
              if (!course) return null;
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-36 overflow-hidden bg-slate-100">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-slate-800 shadow-xs">
                        {course.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <span className="text-[11px] font-bold text-teal-600">{course.code}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-teal-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center text-xs font-semibold mb-1">
                          <span className="text-slate-600">Course Progress</span>
                          <span className="text-teal-700 font-bold">{item.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              item.progress === 100 ? 'bg-emerald-500' : 'bg-teal-600'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      to={`/student/learn/${course._id}`}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{item.progress > 0 ? 'Resume Lesson' : 'Start Course'}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Announcements and Updates */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 mr-2"></span>
            Academic Announcements
          </h2>
          <Link to="/announcements" className="text-xs font-bold text-teal-600 hover:text-teal-700">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ann.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-700'
                        : ann.priority === 'Important'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">{ann.title}</h4>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">{ann.message}</p>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">
                {new Date(ann.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
