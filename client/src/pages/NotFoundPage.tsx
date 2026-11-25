import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-xs text-slate-600 max-w-md mb-6">
        The algorithmic challenge, problem route, or page you were looking for does not exist or has been relocated.
      </p>
      <div className="flex items-center space-x-3">
        <Link
          to="/problems"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Go to Problems</span>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}
