import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const CourseLearn = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingLesson, setUpdatingLesson] = useState(false);

  useEffect(() => {
    fetchCourseAndEnrollment();
  }, [id]);

  const fetchCourseAndEnrollment = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}`);
      if (res.data.success) {
        setCourse(res.data.data);
        if (res.data.enrollment) {
          setEnrollment(res.data.enrollment);
        } else {
          // If not enrolled yet, fetch enrollments
          const myEnrollments = await api.get('/enrollments/my-courses');
          const found = myEnrollments.data.data.find((e) => e.course?._id === id);
          if (found) setEnrollment(found);
        }
      }
    } catch (err) {
      console.error('Error loading course learning space:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (lessonId) => {
    try {
      setUpdatingLesson(true);
      const res = await api.put(`/enrollments/${id}/lessons/${lessonId}/complete`);
      if (res.data.success) {
        setEnrollment(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update progress');
    } finally {
      setUpdatingLesson(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[500px] bg-slate-200 rounded-2xl"></div>
          <div className="h-[500px] bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Course not found</h2>
        <Link to="/courses" className="mt-4 inline-block text-teal-600 font-bold">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const currentLesson = lessons[activeLessonIndex] || {};
  const completedIds = new Set(
    (enrollment?.completedLessons || []).map((l) => (typeof l === 'object' ? l._id : l))
  );
  const isCurrentLessonCompleted = currentLesson._id ? completedIds.has(currentLesson._id) : false;
  const progressPercent = enrollment?.progress || 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/student"
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
              {course.code} • {course.category}
            </span>
            <h1 className="text-lg font-black text-slate-900 leading-tight">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Dynamic Progress indicator */}
        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-600 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Lesson {lessons.length > 0 ? activeLessonIndex + 1 : 0} of {lessons.length}
            </span>
            <span className="text-teal-700 font-black">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent === 100 ? 'bg-emerald-500' : 'bg-teal-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Completion Banner if 100% */}
      {progressPercent === 100 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Award className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">🎉 Congratulations! You have completed this course!</h3>
              <p className="text-xs text-emerald-100">
                You have finished all required lessons and materials in this syllabus.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold bg-white text-emerald-800">
            Course Certified
          </span>
        </div>
      )}

      {/* Main Learning Space: Video / Notes / Materials + Playlist Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lesson Player & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Box */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center shadow-lg">
            {currentLesson.videoUrl && currentLesson.videoUrl.includes('youtube') ? (
              <iframe
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : currentLesson.videoUrl ? (
              <video
                src={currentLesson.videoUrl}
                controls
                className="w-full h-full object-cover"
              ></video>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <PlayCircle className="w-16 h-16 mx-auto text-teal-500/60" />
                <h4 className="text-white font-bold text-base">Interactive Lecture & Study Material</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Review the lesson notes and downloadable documentation below for this topic.
                </p>
              </div>
            )}
          </div>

          {/* Lesson Controls & Toggle Complete */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-teal-600">
                  Lesson {activeLessonIndex + 1}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {currentLesson.title || 'Welcome to this Course'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Duration: {currentLesson.duration || '15 mins'}
                </p>
              </div>

              {/* Complete Toggle Button */}
              {currentLesson._id && (
                <button
                  onClick={() => handleToggleComplete(currentLesson._id)}
                  disabled={updatingLesson}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
                    isCurrentLessonCompleted
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/30'
                  }`}
                >
                  {isCurrentLessonCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completed ✓</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>Mark as Complete</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Lesson Description & Study Notes */}
            <div className="space-y-4">
              {currentLesson.description && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lesson Overview
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentLesson.description}
                  </p>
                </div>
              )}

              {currentLesson.notes && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1 text-teal-600" /> Key Lecture Notes & Takeaways
                  </h4>
                  <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
                    {currentLesson.notes}
                  </pre>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveLessonIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeLessonIndex === 0}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous Lesson
              </button>

              <button
                onClick={() =>
                  setActiveLessonIndex((prev) => Math.min(lessons.length - 1, prev + 1))
                }
                disabled={activeLessonIndex === lessons.length - 1}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-teal-600 disabled:opacity-40 transition-colors flex items-center"
              >
                Next Lesson <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Downloadable Study Materials Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <Download className="w-4 h-4 mr-2 text-teal-600" />
              Downloadable Course Materials ({course.materials?.length || 0})
            </h3>
            {course.materials && course.materials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.materials.map((mat, i) => (
                  <a
                    key={i}
                    href={mat.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-teal-50 hover:border-teal-200 transition-colors flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center space-x-2.5 truncate pr-2">
                      <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="font-semibold text-slate-800 group-hover:text-teal-700 truncate">
                        {mat.title}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No additional PDF materials uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Lesson Syllabus Playlist */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Course Syllabus
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                {completedIds.size} / {lessons.length} done
              </span>
            </div>

            <div className="space-y-2">
              {lessons.map((lesson, idx) => {
                const isCompleted = lesson._id ? completedIds.has(lesson._id) : false;
                const isActive = idx === activeLessonIndex;

                return (
                  <button
                    key={lesson._id || idx}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center justify-between border ${
                      isActive
                        ? 'bg-teal-50/80 border-teal-300 text-teal-900 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200/70 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden pr-2">
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              isActive ? 'border-teal-600 bg-white' : 'border-slate-300'
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p
                          className={`text-xs font-bold truncate ${
                            isActive ? 'text-teal-900' : 'text-slate-800'
                          }`}
                        >
                          {idx + 1}. {lesson.title}
                        </p>
                        <span className="text-[10px] text-slate-400">{lesson.duration}</span>
                      </div>
                    </div>

                    <PlayCircle
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-teal-600' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Assignments Link */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Course Assignments
            </h4>
            <p className="text-xs text-slate-500">
              Submit required lab practicals and projects for grading.
            </p>
            <Link
              to="/student/assignments"
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Assignments</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearn;
