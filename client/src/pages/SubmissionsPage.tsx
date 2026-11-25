import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserSubmissionsApi } from '../services/submission.service.js';
import { SubmissionItem } from '../types/submission.js';
import { VerdictBadge } from '../components/VerdictBadge.js';
import { DifficultyBadge } from '../components/DifficultyBadge.js';
import { Clock, Code2, AlertCircle, CheckCircle, X, Copy, Check, Calendar } from 'lucide-react';

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const loadSubmissions = () => {
    setLoading(true);
    fetchUserSubmissionsApi()
      .then((data) => {
        setSubmissions(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load submissions');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const copyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Real stats calculation based on the user's submissions
  const totalSubmissions = submissions.length;
  const acceptedCount = submissions.filter((s) => s.verdict === 'Accepted').length;
  const accuracyRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-1">
            <span>COMPETITIVE RUNTIME TELEMETRY</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">AUTO-SYNC ACTIVE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Submissions
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Track execution results, performance benchmarks, and historical code runs across algorithmic sets.
          </p>
        </div>
      </div>

      {/* Real Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Submissions
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {totalSubmissions}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Accepted Submissions
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{acceptedCount}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Accuracy Rate
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600">
            {accuracyRate}%
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">Loading submission records...</span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Code2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Submissions Yet</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            You haven't submitted any solutions yet. Pick a problem from the archive and submit your C++ code.
          </p>
          <Link
            to="/problems"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700 transition"
          >
            <span>Explore Problems</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">#Run ID</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Runtime</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {submissions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className="hover:bg-blue-50/40 transition cursor-pointer group"
                    title="Click row to inspect submission details and code"
                  >
                    <td className="py-4 px-4 font-mono font-medium text-slate-500 group-hover:text-blue-600">
                      #{sub.id}
                    </td>
                    <td className="py-4 px-4">
                      <VerdictBadge verdict={sub.verdict} size="sm" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                          {sub.problem_title}
                        </span>
                        {sub.difficulty && <DifficultyBadge difficulty={sub.difficulty} />}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>{sub.language || 'C++20'}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sub.runtime_ms} ms</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(sub.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubmission(sub);
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50 group-hover:bg-white text-slate-700 group-hover:text-blue-600 font-semibold text-xs transition shadow-2xs"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submission Detail Modal View */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-600">
                  Submission #{selectedSubmission.id}
                </span>
                <span className="text-slate-300">•</span>
                <Link
                  to={`/problems/${selectedSubmission.problem_slug}`}
                  className="text-xs font-bold text-slate-900 hover:text-blue-600 transition"
                >
                  {selectedSubmission.problem_title}
                </Link>
                {selectedSubmission.difficulty && (
                  <DifficultyBadge difficulty={selectedSubmission.difficulty} />
                )}
                <VerdictBadge verdict={selectedSubmission.verdict} size="sm" />
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition"
                title="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Telemetry Summary Bar */}
            <div className="px-5 py-3 border-b border-slate-200 bg-white grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">
                  Verdict
                </span>
                <span className={`font-semibold ${
                  selectedSubmission.verdict === 'Accepted' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {selectedSubmission.verdict}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">
                  Runtime
                </span>
                <div className="flex items-center space-x-1 text-slate-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedSubmission.runtime_ms} ms</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">
                  Tests Passed
                </span>
                <span className="text-slate-700 font-semibold">
                  {selectedSubmission.verdict === 'Accepted'
                    ? (selectedSubmission.total_tests ? `${selectedSubmission.total_tests} / ${selectedSubmission.total_tests}` : 'All Passed')
                    : (selectedSubmission.verdict === 'Compilation Error'
                      ? '0 (Build Failed)'
                      : (selectedSubmission.total_tests ? `Passed partially / ${selectedSubmission.total_tests}` : 'Failed'))}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">
                  Submitted At
                </span>
                <div className="flex items-center space-x-1 text-slate-700 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(selectedSubmission.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Read-Only Submitted Code Container */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
              <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{selectedSubmission.language || 'C++20'} · Read-Only</span>
                <button
                  onClick={() => copyCode(selectedSubmission.code)}
                  className="inline-flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white transition"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 flex-1 overflow-auto font-mono text-xs text-slate-200">
                <pre className="whitespace-pre leading-relaxed select-text">{selectedSubmission.code}</pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <Link
                to={`/problems/${selectedSubmission.problem_slug}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Go to Problem →
              </Link>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-medium transition shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
