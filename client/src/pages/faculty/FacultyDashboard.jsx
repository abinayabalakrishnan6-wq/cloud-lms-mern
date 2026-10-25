import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  BookOpen,
  Users,
  FileCheck,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      const [coursesRes, assignRes] = await Promise.all([
        api.get('/courses/faculty/my-courses'),
        api.get('/assignments/faculty/all'),
      ]);

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data);
      }
      if (assignRes.data.success) {
        setAssignments(assignRes.data.data);
      }
    } catch (err) {
      console.error('Error loading faculty dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
  const totalAssignments = assignments.length;
  const pendingSubmissions = assignments.reduce(
    (acc, a) => acc + ((a.submissionCount || 0) - (a.gradedCount || 0)),
    0
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-32 bg-slate-200 rounded-3xl"></div>
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600 p-6 sm:p-8 text-white shadow-lg shadow-amber-600/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faculty Academic Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.name}! 🎓
          </h1>
          <p className="mt-2 text-amber-100 text-sm sm:text-base leading-relaxed">
            You are managing <span className="font-bold text-white">{totalCourses} courses</span> instructing <span className="font-bold text-white">{totalStudents} enrolled students</span>. You have <span className="font-bold text-white">{pendingSubmissions} submissions</span> awaiting review.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/faculty/courses/new"
              className="px-4 py-2 rounded-xl bg-white text-amber-900 text-xs font-bold hover:bg-amber-50 transition-colors shadow-xs flex items-center"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Create New Course
            </Link>
            <Link
              to="/faculty/submissions"
              className="px-4 py-2 rounded-xl bg-amber-900/60 hover:bg-amber-900 text-white text-xs font-bold transition-colors border border-white/20"
            >
              Grade Submissions ({pendingSubmissions})
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Courses Teaching"
          value={totalCourses}
          subtitle="Authored syllabi"
          icon={BookOpen}
          color="amber"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Enrolled across courses"
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Assignments"
          value={totalAssignments}
          subtitle="Active lab tasks"
          icon={Layers}
          color="purple"
        />
        <StatCard
          title="Pending Grading"
          value={pendingSubmissions}
          subtitle="Submissions to score"
          icon={Clock}
          color="rose"
        />
      </div>

      {/* Course Management Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Authored Courses</h2>
            <p className="text-xs text-slate-500">Manage curriculum, lessons, and materials</p>
          </div>
          <Link
            to="/faculty/courses"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">You haven't authored any courses yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Start building your online curriculum with video lessons and downloadable study notes.
            </p>
            <Link
              to="/faculty/courses/new"
              className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-sm hover:bg-amber-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Create First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-slate-800 shadow-xs">
                      {course.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-white shadow-xs">
                      {course.code}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{course.lessons?.length || 0} Lessons</span>
                      <span>{course.enrolledCount || 0} Enrolled</span>
                      <span>{course.materials?.length || 0} Materials</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center space-x-2">
                  <Link
                    to={`/faculty/courses/${course._id}/edit`}
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold text-center transition-colors"
                  >
                    Manage Course
                  </Link>
                  <Link
                    to={`/student/learn/${course._id}`}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
