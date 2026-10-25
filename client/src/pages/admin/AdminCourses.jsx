import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Layers,
  BookOpen,
  Search,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  PlusCircle,
} from 'lucide-react';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses', { params: { search } });
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (courseId, currentPublished) => {
    try {
      const res = await api.put(`/courses/${courseId}`, { published: !currentPublished });
      if (res.data.success) {
        setCourses(courses.map((c) => (c._id === courseId ? { ...c, published: !currentPublished } : c)));
        setToast(`Course ${!currentPublished ? 'published' : 'unpublished'}`);
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and all associated student enrollments?')) {
      return;
    }
    try {
      const res = await api.delete(`/courses/${courseId}`);
      if (res.data.success) {
        setCourses(courses.filter((c) => c._id !== courseId));
        setToast('Course removed successfully');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting course');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Platform Course Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Global management and supervision of all academic courses and enrollments
          </p>
        </div>

        <Link
          to="/faculty/courses/new"
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Course</span>
        </Link>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fade-in">
          <span>{toast}</span>
          <button onClick={() => setToast('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Courses Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-3.5">Course</th>
                  <th className="px-6 py-3.5">Instructor</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Level</th>
                  <th className="px-6 py-3.5">Enrolled</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Course */}
                    <td className="px-6 py-4 flex items-center space-x-3 whitespace-nowrap">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-teal-600 block">{course.code}</span>
                        <span className="font-bold text-slate-900">{course.title}</span>
                      </div>
                    </td>

                    {/* Instructor */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <img
                          src={course.faculty?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${course.faculty?.name}`}
                          alt={course.faculty?.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-slate-800 font-medium">
                          {course.faculty?.name || 'Faculty Member'}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{course.category}</td>

                    {/* Level */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        {course.level}
                      </span>
                    </td>

                    {/* Enrolled */}
                    <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                      {course.enrolledCount || 0} students
                    </td>

                    {/* Status Toggle */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(course._id, course.published)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          course.published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {course.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/student/learn/${course._id}`}
                        className="p-1.5 inline-block rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        title="View Course"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
