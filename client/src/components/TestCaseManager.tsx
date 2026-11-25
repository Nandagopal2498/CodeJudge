import React, { useState, useEffect } from 'react';
import {
  fetchTestCasesApi,
  addTestCaseApi,
  deleteTestCaseApi,
  updateTestCaseApi
} from '../services/admin.service.js';
import { AdminTestCase } from '../types/admin.js';
import { ProblemListItem } from '../types/problem.js';
import { Plus, Trash2, CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react';

interface TestCaseManagerProps {
  problem: ProblemListItem;
  onClose: () => void;
}

export function TestCaseManager({ problem, onClose }: TestCaseManagerProps) {
  const [testCases, setTestCases] = useState<AdminTestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New test case state
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [isSample, setIsSample] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const loadTestCases = () => {
    setLoading(true);
    fetchTestCasesApi(problem.id)
      .then((data) => {
        setTestCases(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load test cases');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTestCases();
  }, [problem.id]);

  const handleAddTestCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !expectedOutput) return;

    try {
      setIsAdding(true);
      await addTestCaseApi(problem.id, input, expectedOutput, isSample);
      setInput('');
      setExpectedOutput('');
      setIsSample(0);
      loadTestCases();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add test case');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this test case?')) return;
    try {
      await deleteTestCaseApi(id);
      loadTestCases();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete test case');
    }
  };

  const handleToggleSample = async (tc: AdminTestCase) => {
    try {
      const nextSample = tc.is_sample === 1 ? 0 : 1;
      await updateTestCaseApi(tc.id, { is_sample: nextSample });
      loadTestCases();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update test case');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Test Case Vault & Inspector
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Managing test cases for <span className="font-semibold text-slate-800">#{problem.id} {problem.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm px-2.5 py-1 rounded-lg hover:bg-slate-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Add New Test Case Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center space-x-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add New Test Case</span>
            </h3>
            <form onSubmit={handleAddTestCase} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Standard Input (stdin)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. 4 9\n2 7 11 15"
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Expected Output (stdout)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={expectedOutput}
                    onChange={(e) => setExpectedOutput(e.target.value)}
                    placeholder="e.g. 0 1"
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSample === 1}
                    onChange={(e) => setIsSample(e.target.checked ? 1 : 0)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Public Sample Case (visible in problem description)</span>
                </label>

                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {isAdding ? 'Adding...' : 'Add Test Case'}
                </button>
              </div>
            </form>
          </div>

          {/* Test Case List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Existing Test Cases ({testCases.length})
            </h3>

            {loading ? (
              <div className="text-center py-6 text-xs text-slate-400">Loading test cases...</div>
            ) : testCases.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No test cases found. Add one above.
              </div>
            ) : (
              <div className="space-y-2.5">
                {testCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-bold text-slate-400">#{idx + 1}</span>
                      <button
                        onClick={() => handleToggleSample(tc)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                          tc.is_sample === 1
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                        title="Click to toggle Public / Hidden status"
                      >
                        {tc.is_sample === 1 ? (
                          <>
                            <Eye className="w-3 h-3 text-blue-600" />
                            <span>Public Sample</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-slate-500" />
                            <span>Hidden Test</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 flex-1 font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Input:</div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-800 truncate max-h-16 overflow-hidden">
                          {tc.input}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Output:</div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-800 truncate max-h-16 overflow-hidden">
                          {tc.expected_output}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(tc.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="Delete test case"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Vault Sync Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
