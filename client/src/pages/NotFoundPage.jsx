import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-3xl mx-auto border border-indigo-100">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          The page or job listing you are looking for might have been moved, removed, or is temporarily unavailable.
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
