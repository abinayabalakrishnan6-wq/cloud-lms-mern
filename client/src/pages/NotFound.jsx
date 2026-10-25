import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-50 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-sm text-slate-500">
          The academic module or page you are requesting could not be located on the platform.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
