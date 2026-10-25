import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Modal from '../components/common/Modal';
import {
  Bell,
  PlusCircle,
  Trash2,
  AlertCircle,
  Megaphone,
  Send,
  Calendar,
  Sparkles,
} from 'lucide-react';

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const isPrivileged = user && (user.role === 'Faculty' || user.role === 'Admin');

  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Announcement Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newPriority, setNewPriority] = useState('Normal');
  const [newCourseId, setNewCourseId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchAnnouncements();
    if (isPrivileged) {
      fetchCourses();
    }
  }, [isPrivileged]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error('Error loading courses for announcements:', err);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/announcements', {
        title: newTitle,
        message: newMessage,
        priority: newPriority,
        courseId: newCourseId || null,
      });

      if (res.data.success) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewMessage('');
        setNewPriority('Normal');
        setNewCourseId('');
        setToast('Announcement published successfully!');
        await fetchAnnouncements();
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await api.delete(`/announcements/${id}`);
      if (res.data.success) {
        setAnnouncements(announcements.filter((a) => a._id !== id));
        setToast('Announcement deleted');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Academic Announcements & Bulletins
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay informed with institution updates, course schedules, and academic deadlines
          </p>
        </div>

        {isPrivileged && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Announcement</span>
          </button>
        )}
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fade-in">
          <span>{toast}</span>
          <button onClick={() => setToast('')} className="font-bold">✕</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No announcements published</h3>
          <p className="text-xs text-slate-500 mt-1">Check back later for campus-wide bulletins.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        ann.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : ann.priority === 'Important'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}
                    >
                      {ann.priority}
                    </span>

                    {ann.course ? (
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {ann.course.code}: {ann.course.title}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        Campus-Wide
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 pt-1">{ann.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {ann.message}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <img
                    src={ann.author?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${ann.author?.name}`}
                    alt={ann.author?.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>
                    Posted by <strong className="text-slate-700">{ann.author?.name}</strong> ({ann.author?.role})
                  </span>
                </div>

                {user && (user._id === ann.author?._id || user.role === 'Admin') && (
                  <button
                    onClick={() => handleDeleteAnnouncement(ann._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Announcement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post New Announcement"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Announcement Title *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Final Exam Dates and Venue Allocation"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority Tag
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Scope / Course (Optional)
              </label>
              <select
                value={newCourseId}
                onChange={(e) => setNewCourseId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Campus-Wide (All Users)</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.code}: {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Message Content *
            </label>
            <textarea
              rows={4}
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Detailed notification announcement..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AnnouncementsPage;
