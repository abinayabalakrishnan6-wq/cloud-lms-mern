import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const StudentAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submission Modal state
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      // Fetch enrolled courses
      const enrollRes = await api.get('/enrollments/my-courses');
      if (enrollRes.data.success) {
        const enrolledCourses = enrollRes.data.data.map((e) => e.course);
        let allAssignments = [];

        for (const c of enrolledCourses) {
          if (!c) continue;
          const assignRes = await api.get(`/assignments/course/${c._id}`);
          if (assignRes.data.success) {
            allAssignments = [...allAssignments, ...assignRes.data.data.map((a) => ({ ...a, courseInfo: c }))];
          }
        }

        setAssignments(allAssignments);
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmit = (assignment) => {
    setActiveAssignment(assignment);
    setSubmissionText(assignment.mySubmission?.submissionText || '');
    setFileUrl(assignment.mySubmission?.fileUrl || '');
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('submissionText', submissionText);
      if (fileUrl) formData.append('fileUrl', fileUrl);
      if (selectedFile) formData.append('file', selectedFile);

      const res = await api.post(
        `/assignments/${activeAssignment._id}/submit`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (res.data.success) {
        setSuccessToast('Assignment submitted successfully!');
        setActiveAssignment(null);
        await fetchAssignments();
        setTimeout(() => setSuccessToast(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Assignments & Submissions
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review lab projects, submission deadlines, and instructor feedback
        </p>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fade-in">
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast('')} className="font-bold">✕</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No assignments assigned yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            When instructors publish assignments for your courses, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((item) => {
            const sub = item.mySubmission;
            const isGraded = sub && sub.status === 'graded';
            const isSubmitted = sub && sub.status === 'submitted';
            const isPastDue = new Date() > new Date(item.dueDate);

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-100">
                      {item.courseInfo?.title || 'Enrolled Course'}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Max Points: {item.totalPoints || 100}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>

                  <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Due: {new Date(item.dueDate).toLocaleDateString()} at{' '}
                      {new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isPastDue && !sub && (
                      <span className="text-rose-600 font-bold flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" /> Overdue
                      </span>
                    )}
                  </div>

                  {/* Feedback display if graded */}
                  {isGraded && (
                    <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span>Instructor Feedback & Score</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono">
                          {sub.score} / {item.totalPoints || 100} Points
                        </span>
                      </div>
                      <p className="text-emerald-800">{sub.feedback || 'Good work on this lab submission!'}</p>
                    </div>
                  )}
                </div>

                {/* Right Status & Action */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                  <div>
                    {isGraded ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Graded
                      </span>
                    ) : isSubmitted ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Pending Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Not Submitted
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenSubmit(item)}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{sub ? 'Resubmit Assignment' : 'Submit Assignment'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      <Modal
        isOpen={!!activeAssignment}
        onClose={() => setActiveAssignment(null)}
        title={`Submit: ${activeAssignment?.title || 'Assignment'}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Submission Text / Solution Description
            </label>
            <textarea
              rows={4}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Describe your solution, methodology, or include your GitHub repository URL..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              External Project / Documentation Link (Optional)
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://github.com/your-username/project-repo"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Or Upload Lab File / Document (PDF, ZIP, DOCX)
            </label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setActiveAssignment(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Upload Submission'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentAssignments;
