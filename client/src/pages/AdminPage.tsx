import React, { useState, useEffect } from 'react';
import { fetchProblemsApi } from '../services/problem.service.js';
import {
  createProblemApi,
  updateProblemApi,
  deleteProblemApi
} from '../services/admin.service.js';
import { ProblemListItem, ProblemDetail } from '../types/problem.js';
import { ProblemInputData } from '../types/admin.js';
import { DifficultyBadge } from '../components/DifficultyBadge.js';
import { TestCaseManager } from '../components/TestCaseManager.js';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  Database,
  Clock,
  Award,
  AlertCircle,
  X
} from 'lucide-react';

const EMPTY_FORM: ProblemInputData = {
  title: '',
  slug: '',
  difficulty: 'Easy',
  description: '',
  input_format: '',
  output_format: '',
  constraints: '',
  time_limit: 1000,
  memory_limit: 256,
  points: 100
};

export function AdminPage() {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProblemInputData>(EMPTY_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Test case manager state
  const [selectedProblemForTests, setSelectedProblemForTests] = useState<ProblemListItem | null>(null);

  const loadProblems = () => {
    setLoading(true);
    fetchProblemsApi()
      .then((data) => {
        setProblems(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load problems');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData(EMPTY_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = async (prob: ProblemListItem) => {
    try {
      setSaving(true);
      const res = await fetch(`/api/problems/${prob.slug}`, { credentials: 'include' });
      const data = await res.json();
      const p: ProblemDetail = data.problem;

      setIsEditing(true);
      setEditId(p.id);
      setFormData({
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        description: p.description,
        input_format: p.input_format,
        output_format: p.output_format,
        constraints: p.constraints,
        time_limit: p.time_limit,
        memory_limit: p.memory_limit,
        points: p.points
      });
      setIsFormOpen(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch problem details');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProblem = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this problem and all its test cases?')) return;
    try {
      await deleteProblemApi(id);
      loadProblems();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete problem');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      if (isEditing && editId !== null) {
        await updateProblemApi(editId, formData);
      } else {
        await createProblemApi(formData);
      }
      setIsFormOpen(false);
      loadProblems();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save problem');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-1">
            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 font-semibold flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SUPERUSER PRIVILEGES</span>
            </span>
            <span>•</span>
            <span>ADMIN CONSOLE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Problem & Test Vault Management
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Create, calibrate, and modify algorithmic problems, limits, and public/hidden test suites.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Problem</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Problems Table */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin"></div>
          <span className="text-xs text-slate-500 font-medium">Loading problems...</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">#ID</th>
                  <th className="py-3 px-4">Title & Slug</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Limits</th>
                  <th className="py-3 px-4">Points</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/75 transition">
                    <td className="py-4 px-4 font-mono font-medium text-slate-500">
                      #{p.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{p.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">/{p.slug}</div>
                    </td>
                    <td className="py-4 px-4">
                      <DifficultyBadge difficulty={p.difficulty} />
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600 text-[11px]">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.time_limit} ms · {p.memory_limit} MB</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-700">
                      <div className="flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{p.points} pts</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedProblemForTests(p)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-blue-50 text-blue-700 font-semibold text-xs transition"
                        title="Manage test cases (sample & hidden)"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Test Cases</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="inline-flex items-center p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                        title="Edit Problem"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteProblem(p.id)}
                        className="inline-flex items-center p-1.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 text-red-600 transition"
                        title="Delete Problem"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Problem Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `Edit Problem #${editId}` : 'Create New Algorithmic Problem'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm px-2.5 py-1 rounded-lg hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Problem Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Subarray Sum Equals K"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slug (URL identifier)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. subarray-sum-equals-k"
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Points</label>
                  <input
                    type="number"
                    required
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Limit (ms)</label>
                  <input
                    type="number"
                    required
                    value={formData.time_limit}
                    onChange={(e) => setFormData({ ...formData, time_limit: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">RAM Limit (MB)</label>
                  <input
                    type="number"
                    required
                    value={formData.memory_limit}
                    onChange={(e) => setFormData({ ...formData, memory_limit: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Problem Description</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the algorithmic task..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Input Format</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.input_format}
                    onChange={(e) => setFormData({ ...formData, input_format: e.target.value })}
                    placeholder="First line contains N..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Output Format</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.output_format}
                    onChange={(e) => setFormData({ ...formData, output_format: e.target.value })}
                    placeholder="Print single integer..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Constraints</label>
                <textarea
                  rows={2}
                  required
                  value={formData.constraints}
                  onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                  placeholder="1 <= N <= 10^5..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Case Manager Modal */}
      {selectedProblemForTests && (
        <TestCaseManager
          problem={selectedProblemForTests}
          onClose={() => setSelectedProblemForTests(null)}
        />
      )}
    </div>
  );
}
