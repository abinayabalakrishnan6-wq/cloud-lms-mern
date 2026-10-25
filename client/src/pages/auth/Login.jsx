import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Faculty') navigate('/faculty');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-teal-600 text-white items-center justify-center shadow-lg shadow-teal-600/30 mb-4">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Sign in to CloudLMS
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Access courses, assignments, and academic dashboards
          </p>
        </div>

        {/* Demo Quick-Fill Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Demo Credentials Quick Fill
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('student@lms.com', 'password123')}
              className="px-2 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100 transition-colors border border-teal-100 text-center"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('faculty@lms.com', 'password123')}
              className="px-2 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-100 text-center"
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@lms.com', 'password123')}
              className="px-2 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-colors border border-purple-100 text-center"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
