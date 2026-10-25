import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Award,
  Send,
  User,
  BookOpen,
} from 'lucide-react';

const SubmissionsReview = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Grading Modal
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/assignments/faculty/all');
      if (res.data.success) {
        setAssignments(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedAssignmentId(res.data.data[0]._id);
          fetchSubmissionsForAssignment(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionsForAssignment = async (assignId) => {
    try {
      setLoadingSubmissions(true);
      const res = await api.get(`/assignments/${assignId}/submissions`);
      if (res.data.success) {
        setSubmissions(res.data.data);
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleAssignmentChange = (e) => {
    const id = e.target.value;
    setSelectedAssignmentId(id);
    fetchSubmissionsForAssignment(id);
  };

  const openGradingModal = (sub) => {
    setGradingSubmission(sub);
    setScore(sub.score !== null ? sub.score : '');
    setFeedback(sub.feedback || '');
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      setSubmittingGrade(true);
      const res = await api.put(
        `/assignments/submissions/${gradingSubmission._id}/grade`,
        { score, feedback }
      );

      if (res.data.success) {
        setToast('Grade and feedback saved successfully!');
        setGradingSubmission(null);
        await fetchSubmissionsForAssignment(selectedAssignmentId);
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit grade');
    } finally {
      setSubmittingGrade(false);
    }
  };

  const activeAssignmentObj = assignments.find((a) => a._id === selectedAssignmentId);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Review Student Submissions
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Evaluate submitted lab assignments, assign grades, and provide constructive feedback
        </p>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between animate-fade-in">
          <span>{toast}</span>
          <button onClick={() => setToast('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Select Assignment dropdown */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Assignment to Review:
          </label>
          <select
            value={selectedAssignmentId}
            onChange={handleAssignmentChange}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {assignments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.course?.code}: {a.title} ({a.submissionCount || 0} submissions)
              </option>
            ))}
          </select>
        </div>

        {activeAssignmentObj && (
          <div className="text-left sm:text-right text-xs text-slate-500">
            <span className="font-bold text-slate-800 block text-sm">
              Max Points: {activeAssignmentObj.totalPoints || 100}
            </span>
            <span>Due Date: {new Date(activeAssignmentObj.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Submissions List */}
      {loadingSubmissions ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No submissions received yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Enrolled students will appear here once they complete and submit this assignment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const isGraded = sub.status === 'graded';
            return (
              <div
                key={sub._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <img
                      src={sub.student?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${sub.student?.name}`}
                      alt={sub.student?.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{sub.student?.name}</h4>
                      <p className="text-xs text-slate-500">
                        {sub.student?.email} • {sub.student?.department || 'Student'}
                      </p>
                    </div>
                  </div>

                  {sub.submissionText && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <p className="font-semibold text-slate-900 mb-1">Student Answer / Description:</p>
                      <p className="whitespace-pre-wrap">{sub.submissionText}</p>
                    </div>
                  )}

                  {sub.fileUrl && (
                    <div className="flex items-center space-x-2 pt-1">
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-colors border border-teal-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        <span>View Deliverable / Document ({sub.fileName || 'Attachment'})</span>
                      </a>
                    </div>
                  )}

                  {isGraded && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold">Feedback: </span>
                        <span>{sub.feedback || 'Graded'}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono font-bold shrink-0">
                        Score: {sub.score} / {activeAssignmentObj?.totalPoints || 100}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right side grading trigger */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      isGraded
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub.status === 'late'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isGraded ? 'Graded' : sub.status === 'late' ? 'Late Submission' : 'Pending Review'}
                  </span>

                  <span className="text-[11px] text-slate-400">
                    Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => openGradingModal(sub)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center space-x-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isGraded ? 'Update Grade' : 'Score Submission'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Grading Modal */}
      <Modal
        isOpen={!!gradingSubmission}
        onClose={() => setGradingSubmission(null)}
        title={`Grade Submission: ${gradingSubmission?.student?.name}`}
      >
        <form onSubmit={handleGradeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Score / Points (Out of {activeAssignmentObj?.totalPoints || 100}) *
            </label>
            <input
              type="number"
              required
              min={0}
              max={activeAssignmentObj?.totalPoints || 100}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g. 95"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Personalized Feedback & Comments
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide comments on code structure, test coverage, and areas of excellence..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setGradingSubmission(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingGrade}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingGrade ? 'Saving Grade...' : 'Submit Grade'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubmissionsReview;
