import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProblemBySlugApi } from '../services/problem.service.js';
import { ProblemDetail } from '../types/problem.js';
import { DifficultyBadge } from '../components/DifficultyBadge.js';
import { CodeFormattedText } from '../components/CodeFormattedText.js';
import { CodeEditorPanel } from '../components/CodeEditorPanel.js';
import {
  ArrowLeft,
  Clock,
  HardDrive,
  Award,
  Copy,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function ProblemDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProblemBySlugApi(slug)
      .then((data) => {
        setProblem(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load problem');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-3 border-blue-600 border-t-transparent animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading problem workspace...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs inline-flex items-center space-x-2 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error || 'Problem not found'}</span>
        </div>
        <div>
          <Link
            to="/problems"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Problem Archive</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Prev/Next Problem Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center space-x-3">
          <Link
            to="/problems"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Problem Archive</span>
          </Link>
          <span className="text-slate-300">•</span>
          <div className="flex items-center space-x-1 text-xs font-mono text-slate-500">
            <span className="text-emerald-600 font-medium">MULTI-LANGUAGE SANDBOX</span>
          </div>
        </div>

        {/* Previous / Next Problem Buttons */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {problem.prev_problem ? (
            <Link
              to={`/problems/${problem.prev_problem.slug}`}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition shadow-2xs"
              title={`Previous: #${problem.prev_problem.id} ${problem.prev_problem.title}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Problem</span>
            </Link>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-300 text-xs font-medium cursor-not-allowed">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Problem</span>
            </span>
          )}

          {problem.next_problem ? (
            <Link
              to={`/problems/${problem.next_problem.slug}`}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition shadow-2xs"
              title={`Next: #${problem.next_problem.id} ${problem.next_problem.title}`}
            >
              <span>Next Problem</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-300 text-xs font-medium cursor-not-allowed">
              <span>Next Problem</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Two-panel layout: Left Statement (5 cols), Right Editor (7 cols) */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Information (Statement, Limits, I/O Format, Constraints, Samples) */}
        <div className="w-full lg:col-span-5 space-y-4">
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-500">#{problem.id}</span>
                <DifficultyBadge difficulty={problem.difficulty} />
              </div>
              <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-mono flex items-center space-x-1">
                <Award className="w-3 h-3 text-amber-500" />
                <span>{problem.points} pts</span>
              </span>
            </div>

            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">
              {problem.title}
            </h1>

            {/* Limits */}
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-600">
              <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{problem.time_limit} ms</span>
              </div>
              <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <HardDrive className="w-3 h-3 text-slate-400" />
                <span>{problem.memory_limit} MB</span>
              </div>
            </div>
          </div>

          {/* Statement */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Problem Statement
            </h2>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
              <CodeFormattedText text={problem.description} />
            </div>
          </section>

          {/* Input & Output Format */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Input Format
              </h2>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                <CodeFormattedText text={problem.input_format} />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Output Format
              </h2>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                <CodeFormattedText text={problem.output_format} />
              </div>
            </div>
          </section>

          {/* Constraints */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Constraints
            </h2>
            <div className="text-xs font-mono text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-line leading-relaxed">
              <CodeFormattedText text={problem.constraints} />
            </div>
          </section>

          {/* Sample Cases with Explanations */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Sample Cases
            </h2>
            {problem.sample_cases.map((sample, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Example {idx + 1}
                  </span>
                  <button
                    onClick={() => copyToClipboard(sample.input, idx)}
                    className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-blue-600 transition px-2 py-0.5 rounded hover:bg-slate-50"
                    title="Copy sample input"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Input</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">
                      Input:
                    </div>
                    <pre className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 overflow-x-auto whitespace-pre">
                      {sample.input}
                    </pre>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">
                      Expected Output:
                    </div>
                    <pre className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 overflow-x-auto whitespace-pre">
                      {sample.expected_output}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column: C++20 Monaco Code Editor Panel (7 cols, sticky) */}
        <div className="w-full lg:col-span-7 lg:sticky lg:top-6 min-h-[540px]">
          <CodeEditorPanel
            problemId={problem.id}
            problemTitle={problem.title}
            initialCode={problem.starter_code}
            onSubmitted={() => {
              // Refresh problem details to reflect is_solved immediately if solved
              if (slug) {
                fetchProblemBySlugApi(slug).then((data) => {
                  if (data) setProblem(data);
                }).catch(() => {});
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
