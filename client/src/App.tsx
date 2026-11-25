import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/Navbar.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { LoginPage } from './pages/LoginPage.js';
import { SignupPage } from './pages/SignupPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProblemsPage } from './pages/ProblemsPage.js';
import { ProblemDetailPage } from './pages/ProblemDetailPage.js';
import { SubmissionsPage } from './pages/SubmissionsPage.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { AdminPage } from './pages/AdminPage.js';
import { AdminRoute } from './components/AdminRoute.js';
import { NotFoundPage } from './pages/NotFoundPage.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes */}
                <Route
                  path="/problems"
                  element={
                    <ProtectedRoute>
                      <ProblemsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/problems/:slug"
                  element={
                    <ProtectedRoute>
                      <ProblemDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute>
                      <LeaderboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/submissions"
                  element={
                    <ProtectedRoute>
                      <SubmissionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Home route: redirect to /login if unauthenticated, or /problems if authenticated */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/problems" replace />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
              CodeJudge Platform v1.0 · Multi-Language Sandbox Engine · Built with Express & React
            </footer>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
