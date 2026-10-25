import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  FileCheck,
  Users,
  Layers,
  GraduationCap,
  Bell,
  Compass,
  Award,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  let links = [];

  if (role === 'Student') {
    links = [
      { name: 'Student Overview', path: '/student', icon: LayoutDashboard },
      { name: 'My Enrolled Courses', path: '/student/courses', icon: GraduationCap },
      { name: 'Browse Catalog', path: '/courses', icon: Compass },
      { name: 'Assignments & Deadlines', path: '/student/assignments', icon: FileCheck },
      { name: 'Announcements', path: '/announcements', icon: Bell },
    ];
  } else if (role === 'Faculty') {
    links = [
      { name: 'Faculty Overview', path: '/faculty', icon: LayoutDashboard },
      { name: 'Manage My Courses', path: '/faculty/courses', icon: BookOpen },
      { name: 'Create New Course', path: '/faculty/courses/new', icon: PlusCircle },
      { name: 'Student Submissions', path: '/faculty/submissions', icon: FileCheck },
      { name: 'Announcements', path: '/announcements', icon: Bell },
    ];
  } else if (role === 'Admin') {
    links = [
      { name: 'Admin Analytics', path: '/admin', icon: LayoutDashboard },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Course Management', path: '/admin/courses', icon: Layers },
      { name: 'Announcements', path: '/announcements', icon: Bell },
    ];
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden md:flex shrink-0">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 bg-gradient-to-br from-slate-50 to-teal-50/50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt={user.name}
              className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-xs"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-slate-800 truncate">{user.name}</h4>
              <p className="text-xs text-slate-500 truncate">{user.department || 'Academic'}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md">
                {user.role} Portal
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/student' || link.path === '/faculty' || link.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-3 shrink-0" />
                  <span className="truncate">{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Cloud Status Footer */}
      <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-700">Cloud DB Online</span>
        </div>
        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
          v1.0
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
