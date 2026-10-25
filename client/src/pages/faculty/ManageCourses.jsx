import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import {
  BookOpen,
  PlusCircle,
  Trash2,
  Edit,
  Video,
  FileText,
  Upload,
  Layers,
  Users,
  Eye,
  AlertCircle,
} from 'lucide-react';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Lesson Modal
  const [activeCourseForLesson, setActiveCourseForLesson] = useState(null);
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    duration: '20 mins',
    videoUrl: '',
    notes: '',
    isFreePreview: false,
  });

  // Add Material Modal
  const [activeCourseForMaterial, setActiveCourseForMaterial] = useState(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialFile, setMaterialFile] = useState(null);

  // Add Assignment Modal
  const [activeCourseForAssignment, setActiveCourseForAssignment] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalPoints: 100,
    instructions: '',
  });

  const [saving, setSaving] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses/faculty/my-courses');
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and its enrolled records?')) {
      return;
    }
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
      setFeedbackToast('Course deleted successfully');
      setTimeout(() => setFeedbackToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // Add Lesson Handler
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!activeCourseForLesson) return;

    try {
      setSaving(true);
      const res = await api.post(`/courses/${activeCourseForLesson._id}/lessons`, lessonData);
      if (res.data.success) {
        setActiveCourseForLesson(null);
        setLessonData({
          title: '',
          description: '',
          duration: '20 mins',
          videoUrl: '',
          notes: '',
          isFreePreview: false,
        });
        setFeedbackToast('Lesson added successfully!');
        await fetchCourses();
        setTimeout(() => setFeedbackToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add lesson');
    } finally {
      setSaving(false);
    }
  };

  // Add Material Handler
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    if (!activeCourseForMaterial) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('title', materialTitle);
      if (materialUrl) formData.append('fileUrl', materialUrl);
      if (materialFile) formData.append('file', materialFile);

      const res = await api.post(
        `/courses/${activeCourseForMaterial._id}/materials`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.success) {
        setActiveCourseForMaterial(null);
        setMaterialTitle('');
        setMaterialUrl('');
        setMaterialFile(null);
        setFeedbackToast('Material uploaded successfully!');
        await fetchCourses();
        setTimeout(() => setFeedbackToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload material');
    } finally {
      setSaving(false);
    }
  };

  // Add Assignment Handler
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    if (!activeCourseForAssignment) return;

    try {
      setSaving(true);
      const res = await api.post('/assignments', {
        ...assignmentData,
        courseId: activeCourseForAssignment._id,
      });

      if (res.data.success) {
        setActiveCourseForAssignment(null);
        setAssignmentData({
          title: '',
          description: '',
          dueDate: '',
          totalPoints: 100,
          instructions: '',
        });
        setFeedbackToast('Assignment created successfully!');
        await fetchCourses();
        setTimeout(() => setFeedbackToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Manage Courses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author and organize courses, upload learning materials, and schedule assignments
          </p>
        </div>

        <Link
          to="/faculty/courses/new"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Course</span>
        </Link>
      </div>

      {feedbackToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fade-in">
          <span>{feedbackToast}</span>
          <button onClick={() => setFeedbackToast('')} className="font-bold">✕</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No courses authored yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Click 'New Course' above to launch your first online learning module.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 hidden sm:block border border-slate-100"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{course.category}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{course.description}</p>

                  <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                    <span>{course.lessons?.length || 0} Lessons</span>
                    <span>{course.materials?.length || 0} Materials</span>
                    <span>{course.enrolledCount || 0} Enrolled Students</span>
                    <span>{course.assignmentCount || 0} Assignments</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveCourseForLesson(course)}
                  className="px-3 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-colors flex items-center space-x-1 border border-teal-200"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>+ Lesson</span>
                </button>

                <button
                  onClick={() => setActiveCourseForMaterial(course)}
                  className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors flex items-center space-x-1 border border-blue-200"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Material</span>
                </button>

                <button
                  onClick={() => setActiveCourseForAssignment(course)}
                  className="px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors flex items-center space-x-1 border border-purple-200"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>+ Task</span>
                </button>

                <Link
                  to={`/student/learn/${course._id}`}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                  title="Preview Course"
                >
                  <Eye className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Lesson */}
      <Modal
        isOpen={!!activeCourseForLesson}
        onClose={() => setActiveCourseForLesson(null)}
        title={`Add Lesson to ${activeCourseForLesson?.title}`}
      >
        <form onSubmit={handleAddLesson} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Lesson Title
            </label>
            <input
              type="text"
              required
              value={lessonData.title}
              onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
              placeholder="e.g. Asynchronous JavaScript & Promises"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Lesson Overview / Summary
            </label>
            <input
              type="text"
              value={lessonData.description}
              onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
              placeholder="Brief description of this lecture..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Duration
              </label>
              <input
                type="text"
                value={lessonData.duration}
                onChange={(e) => setLessonData({ ...lessonData, duration: e.target.value })}
                placeholder="e.g. 25 mins"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Video / Embed URL
              </label>
              <input
                type="url"
                value={lessonData.videoUrl}
                onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Lecture Notes / Study Takeaways
            </label>
            <textarea
              rows={3}
              value={lessonData.notes}
              onChange={(e) => setLessonData({ ...lessonData, notes: e.target.value })}
              placeholder="Bullet points or code snippet explanations for this lesson..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="freePreview"
              checked={lessonData.isFreePreview}
              onChange={(e) => setLessonData({ ...lessonData, isFreePreview: e.target.checked })}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="freePreview" className="text-xs text-slate-700 font-medium">
              Allow Free Preview before enrollment
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setActiveCourseForLesson(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Material */}
      <Modal
        isOpen={!!activeCourseForMaterial}
        onClose={() => setActiveCourseForMaterial(null)}
        title={`Upload Study Material to ${activeCourseForMaterial?.title}`}
      >
        <form onSubmit={handleAddMaterial} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Material Title
            </label>
            <input
              type="text"
              required
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="e.g. Chapter 1 PDF Handout & Cheatsheet"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              External Document / Cloud Link
            </label>
            <input
              type="url"
              value={materialUrl}
              onChange={(e) => setMaterialUrl(e.target.value)}
              placeholder="https://drive.google.com/... or cloud URL"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Or Choose File from Computer (PDF, DOCX, ZIP)
            </label>
            <input
              type="file"
              onChange={(e) => setMaterialFile(e.target.files[0])}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setActiveCourseForMaterial(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-50"
            >
              {saving ? 'Uploading...' : 'Save Material'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Assignment */}
      <Modal
        isOpen={!!activeCourseForAssignment}
        onClose={() => setActiveCourseForAssignment(null)}
        title={`Create Assignment for ${activeCourseForAssignment?.title}`}
      >
        <form onSubmit={handleAddAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={assignmentData.title}
              onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
              placeholder="e.g. Lab Exercise: Cloud Microservices Deployment"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Assignment Description
            </label>
            <textarea
              rows={3}
              required
              value={assignmentData.description}
              onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
              placeholder="Detailed instructions for student deliverables..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Due Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={assignmentData.dueDate}
                onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Marks / Points
              </label>
              <input
                type="number"
                value={assignmentData.totalPoints}
                onChange={(e) => setAssignmentData({ ...assignmentData, totalPoints: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setActiveCourseForAssignment(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Publish Assignment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCourses;
