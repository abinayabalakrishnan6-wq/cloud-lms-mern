import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  GraduationCap,
  PlayCircle,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/enrollments/my-courses');
      if (res.data.success) {
        setEnrollments(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your ongoing progress, access curriculum lessons, and complete certificates
          </p>
        </div>

        <Link
          to="/courses"
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center space-x-1"
        >
          <BookOpen className="w-4 h-4 mr-1" /> Browse More Courses
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">You haven't enrolled in any courses</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse our catalog to enroll in courses and begin your learning path.
          </p>
          <Link
            to="/courses"
            className="mt-4 inline-flex items-center px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((item) => {
            const course = item.course;
            if (!course) return null;
            const isCompleted = item.progress === 100;

            return (
              <div
                key={item._id}
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
                    {isCompleted && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-600 text-white shadow-xs flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] font-bold text-teal-600">{course.code}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-teal-700 font-bold">{item.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isCompleted ? 'bg-emerald-500' : 'bg-teal-600'
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
  );
};

export default MyCourses;
