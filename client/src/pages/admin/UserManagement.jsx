import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  Shield,
  Trash2,
  CheckCircle2,
  XCircle,
  Filter,
  UserCheck,
  UserX,
} from 'lucide-react';

const UserManagement = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (roleFilter !== 'All') params.role = roleFilter;
      if (search) params.search = search;

      const res = await api.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/admin/users/${userId}`, { role: newRole });
      if (res.data.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
        setToast(`User role updated to ${newRole}`);
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating role');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const res = await api.put(`/admin/users/${userId}`, { isActive: !currentStatus });
      if (res.data.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u)));
        setToast(`User account ${!currentStatus ? 'activated' : 'deactivated'}`);
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and their associated submissions & enrollments?')) {
      return;
    }
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        setToast('User deleted successfully');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            User Management Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage student, faculty, and administrator accounts, roles, and access credentials
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fade-in">
          <span>{toast}</span>
          <button onClick={() => setToast('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User */}
                    <td className="px-6 py-4 flex items-center space-x-3 whitespace-nowrap">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{u.email}</td>

                    {/* Department */}
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{u.department || 'General'}</td>

                    {/* Role Dropdown */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === currentAdmin?._id}
                        className={`text-xs font-bold py-1 px-2.5 rounded-lg border transition-colors ${
                          u.role === 'Admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.role === 'Faculty'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-teal-50 text-teal-700 border-teal-200'
                        }`}
                      >
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(u._id, u.isActive)}
                        disabled={u._id === currentAdmin?._id}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          u.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.isActive ? (
                          <>
                            <UserCheck className="w-3 h-3 mr-1" /> Active
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3 mr-1" /> Deactivated
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {u._id !== currentAdmin?._id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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

export default UserManagement;
