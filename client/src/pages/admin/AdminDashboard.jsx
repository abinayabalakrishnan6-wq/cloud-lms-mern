import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import {
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin statistics:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const totals = stats?.totals || {};
  const categoryStats = stats?.categoryStats || [];
  const recentEnrollments = stats?.recentEnrollments || [];
  const recentUsers = stats?.recentUsers || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 p-6 sm:p-8 text-white shadow-lg shadow-purple-700/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master System Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            System Executive Dashboard 🛡️
          </h1>
          <p className="mt-2 text-purple-100 text-sm sm:text-base leading-relaxed">
            Platform is healthy and synchronized with cloud database. Overseeing <span className="font-bold text-white">{totals.users || 0} total accounts</span>, <span className="font-bold text-white">{totals.courses || 0} courses</span>, and <span className="font-bold text-white">{totals.enrollments || 0} active enrollments</span>.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/users"
              className="px-4 py-2 rounded-xl bg-white text-purple-900 text-xs font-bold hover:bg-purple-50 transition-colors shadow-xs"
            >
              Manage Users Directory
            </Link>
            <Link
              to="/admin/courses"
              className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-900 text-white text-xs font-bold transition-colors border border-white/20"
            >
              Oversee Courses ({totals.courses || 0})
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totals.users || 0}
          subtitle={`${totals.students || 0} Students • ${totals.faculty || 0} Faculty`}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Published Courses"
          value={totals.publishedCourses || 0}
          subtitle={`${totals.courses || 0} Total across platform`}
          icon={BookOpen}
          color="teal"
        />
        <StatCard
          title="Course Enrollments"
          value={totals.enrollments || 0}
          subtitle={`${totals.completedEnrollments || 0} Finished (100%)`}
          icon={GraduationCap}
          color="emerald"
        />
        <StatCard
          title="Submissions"
          value={totals.submissions || 0}
          subtitle={`${totals.gradedSubmissions || 0} Graded`}
          icon={FileCheck}
          color="amber"
        />
      </div>

      {/* Visual Analytics Grid: Category Breakdown + User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Course Distribution by Discipline
              </h2>
              <p className="text-xs text-slate-500">Live counts calculated from cloud database</p>
            </div>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>

          <div className="space-y-3 pt-2">
            {categoryStats.map((cat, idx) => {
              const maxCount = Math.max(...categoryStats.map((c) => c.count), 1);
              const percentage = Math.round((cat.count / maxCount) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat._id || 'Unassigned'}</span>
                    <span className="text-teal-700 font-bold">{cat.count} Courses</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Distribution Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Account Roles Breakdown
            </h2>
            <p className="text-xs text-slate-500">Registered platform user segmentation</p>

            <div className="mt-6 space-y-3">
              <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800">Students</span>
                <span className="text-sm font-black text-teal-900">{totals.students || 0}</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">Faculty Members</span>
                <span className="text-sm font-black text-amber-900">{totals.faculty || 0}</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-800">Administrators</span>
                <span className="text-sm font-black text-purple-900">{totals.admins || 0}</span>
              </div>
            </div>
          </div>

          <Link
            to="/admin/users"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-purple-700 text-white text-xs font-bold transition-colors text-center block"
          >
            Manage Accounts
          </Link>
        </div>
      </div>

      {/* Recent Activity: Recent Enrollments & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Enrollments</h3>
            <span className="text-xs text-slate-400">Live Feed</span>
          </div>

          <div className="space-y-3">
            {recentEnrollments.map((item) => (
              <div
                key={item._id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.student?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${item.student?.name}`}
                    alt={item.student?.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.student?.name}</h4>
                    <p className="text-[11px] text-teal-600 font-semibold truncate max-w-[200px]">
                      {item.course?.title}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">{item.progress}%</span>
                  <p className="text-[10px] text-slate-400">
                    {new Date(item.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recently Registered Users</h3>
            <Link to="/admin/users" className="text-xs font-bold text-purple-600 hover:text-purple-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div
                key={u._id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                    alt={u.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{u.name}</h4>
                    <p className="text-[11px] text-slate-500">{u.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.role === 'Admin'
                        ? 'bg-purple-100 text-purple-700'
                        : u.role === 'Faculty'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {u.role}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
