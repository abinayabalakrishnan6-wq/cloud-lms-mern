import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save, BookOpen, Sparkles } from 'lucide-react';

const categories = [
  'Web Development',
  'AI & Machine Learning',
  'Cybersecurity',
  'Cloud & DevOps',
  'Computer Science',
  'Data Science',
  'Software Engineering',
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const CreateEditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/courses/${id}`);
          if (res.data.success) {
            const c = res.data.data;
            setFormData({
              title: c.title,
              code: c.code,
              description: c.description,
              category: c.category,
              level: c.level,
              thumbnail: c.thumbnail,
            });
          }
        } catch (err) {
          setError('Failed to fetch course details');
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isEditing) {
        await api.put(`/courses/${id}`, formData);
      } else {
        await api.post('/courses', formData);
      }
      navigate('/faculty/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving course');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <Link
        to="/faculty/courses"
        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to courses
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isEditing ? 'Edit Course Details' : 'Create New Course'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Specify course catalog details, academic level, and curriculum overview
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Course Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Distributed Cloud Systems with Docker & Kubernetes"
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Course Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. CS-450"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Academic Level
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Course Description & Syllabus Summary *
          </label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Comprehensive description outlining topics, prerequisite knowledge, and learning outcomes..."
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Course Thumbnail Image URL
          </label>
          <input
            type="url"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {formData.thumbnail && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1">Image Preview:</p>
              <img
                src={formData.thumbnail}
                alt="Preview"
                className="w-48 h-28 rounded-xl object-cover border border-slate-200 shadow-xs"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <Link
            to="/faculty/courses"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Course...' : isEditing ? 'Update Course' : 'Create Course'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditCourse;
