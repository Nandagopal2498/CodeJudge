import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ReactNode } from 'react';

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Verifying admin privileges...</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect non-admins to problems
  if (user.role !== 'Admin') {
    return <Navigate to="/problems" replace />;
  }

  return <>{children}</>;
}
