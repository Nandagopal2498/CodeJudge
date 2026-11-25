import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchProblemsApi } from '../services/problem.service.js';
import { useAuth } from '../context/AuthContext.js';
import { ProblemListItem } from '../types/problem.js';
import { DifficultyBadge } from '../components/DifficultyBadge.js';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

const PAGE_SIZE = 27;

export function ProblemsPage() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const loadProblems = useCallback((silent = false) => {
    if (!silent) setLoading(true);
    fetchProblemsApi()
      .then((data) => {
        setProblems(data || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load problems');
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadProblems(false);
  }, [loadProblems, user]);

  // Live update after accepted submission
  useEffect(() => {
    const handleSubmissionAccepted = (event: Event) => {
      const customEvent = event as CustomEvent<{ problemId: number }>;
      const problemId = customEvent.detail?.problemId;
      if (problemId) {
        setProblems((prev) =>
          prev.map((p) => (p.id === problemId ? { ...p, is_solved: true } : p))
        );
      }
      // Re-fetch in background to ensure sync
      loadProblems(true);
    };

    window.addEventListener('codejudge:submission-accepted', handleSubmissionAccepted);
    return () => {
      window.removeEventListener('codejudge:submission-accepted', handleSubmissionAccepted);
    };
  }, [loadProblems]);

  const handleDifficultyChange = (diff: string) => {
    setFilterDifficulty(diff);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setFilterDifficulty('All');
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.id.toString().includes(query) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)));

      const matchesDifficulty =
        filterDifficulty === 'All' || p.difficulty === filterDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [problems, search, filterDifficulty]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProblems = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safeCurrentPage]);

  const easyCount = problems.filter((p) => p.difficulty === 'Easy').length;
  const mediumCount = problems.filter((p) => p.difficulty === 'Medium').length;
  const hardCount = problems.filter((p) => p.difficulty === 'Hard').length;

  const solvedCount = problems.filter((p) => p.is_solved).length;
  const solvedPercent =
    problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

  const hasActiveFilters =
    search.trim() !== '' || filterDifficulty !== 'All';

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Archive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-1">
            <span>MULTI-LANGUAGE SANDBOX</span>
            <span>•</span>
            <span>{problems.length} PROBLEMS LOADED</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Problem Archive
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Curated algorithmic problem sets ranging from foundational data structures to complex algorithmic challenges.
          </p>
        </div>

        {/* Real Solved Target Progress Widget */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex items-center space-x-4 min-w-[240px]">
          {loading ? (
            <div className="flex items-center space-x-3 py-1">
              <div className="w-12 h-12 rounded-full border-3 border-emerald-600/30 border-t-emerald-600 animate-spin flex items-center justify-center"></div>
              <div className="space-y-1.5">
                <div className="w-24 h-2.5 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-32 h-3.5 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          ) : user ? (
            <>
              {/* Circular SVG Progress Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  {/* Background track */}
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    className="text-emerald-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Animated Progress Ring */}
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    className="text-emerald-600 transition-all duration-700 ease-out"
                    strokeWidth="4"
                    strokeDasharray={119.38}
                    strokeDashoffset={119.38 - (119.38 * Math.min(100, Math.max(0, solvedPercent))) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute font-mono font-bold text-[11px] text-emerald-700">
                  {solvedPercent}%
                </span>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Your Progress
                </div>
                <div className="text-xs font-bold text-slate-800 font-mono">
                  {solvedCount} of {problems.length} Solved ({solvedPercent}%)
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, ID, or tag..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
          />
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => handleDifficultyChange('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterDifficulty === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Problems ({problems.length})
          </button>
          <button
            onClick={() => handleDifficultyChange('Easy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterDifficulty === 'Easy'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-emerald-700 hover:bg-slate-200'
            }`}
          >
            Easy ({easyCount})
          </button>
          <button
            onClick={() => handleDifficultyChange('Medium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterDifficulty === 'Medium'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-amber-700 hover:bg-slate-200'
            }`}
          >
            Medium ({mediumCount})
          </button>
          <button
            onClick={() => handleDifficultyChange('Hard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterDifficulty === 'Hard'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-rose-700 hover:bg-slate-200'
            }`}
          >
            Hard ({hardCount})
          </button>
        </div>
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">
            Loading problem archive...
          </span>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State with Reset Filters */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No problems match your filters
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            {hasActiveFilters
              ? 'Try adjusting your search keywords or difficulty filter to find what you are looking for.'
              : 'There are currently no problems in the archive.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      ) : (
        /* Problem Table */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4 w-16">#ID</th>
                  <th className="py-3 px-4">Title & Tags</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Time Limit</th>
                  <th className="py-3 px-4">Points</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-normal">
                {paginatedProblems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/75 transition group">
                    <td className="py-4 px-4 text-center">
                      {p.is_solved ? (
                        <span title="Solved (Accepted)">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 inline-block" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 inline-block text-slate-300 font-mono text-[11px]">
                          -
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-500">
                      #{p.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/problems/${p.slug}`}
                            className="font-semibold text-slate-900 group-hover:text-blue-600 transition"
                          >
                            {p.title}
                          </Link>
                        </div>
                        {p.tags && p.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {p.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <DifficultyBadge difficulty={p.difficulty} />
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.time_limit} ms</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-700">
                      <div className="flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{p.points} pts</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/problems/${p.slug}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-xs transition border border-blue-200"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500 font-medium">
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {(safeCurrentPage - 1) * PAGE_SIZE + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-slate-700">
                  {Math.min(safeCurrentPage * PAGE_SIZE, filtered.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-700">
                  {filtered.length}
                </span>{' '}
                problems
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg font-mono text-xs font-semibold flex items-center justify-center transition ${
                        pageNum === safeCurrentPage
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
