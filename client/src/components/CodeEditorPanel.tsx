import { useState, useEffect, useRef, useCallback } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput, StreamLanguage } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { cpp } from '@codemirror/lang-cpp';
import { Play, Send, RotateCcw, Clock, Check, X, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import { runSampleTestsApi, submitSolutionApi } from '../services/submission.service.js';
import { RunTestsResponse, SubmitResponse } from '../types/submission.js';
import { VerdictBadge } from './VerdictBadge.js';
import { useAuth } from '../context/AuthContext.js';

interface CodeEditorPanelProps {
  problemId: number;
  initialCode?: string;
  problemTitle?: string;
  onSubmitted?: () => void;
}

export interface LanguageOption {
  id: string;
  name: string;
  filename: string;
  starterCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    id: 'cpp',
    name: 'C++20',
    filename: 'solution.cpp',
    starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    

    return 0;
}
`
  },
  {
    id: 'c',
    name: 'C',
    filename: 'solution.c',
    starterCode: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    

    return 0;
}
`
  },
  {
    id: 'java',
    name: 'Java',
    filename: 'Main.java',
    starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        
    }
}
`
  },
  {
    id: 'python',
    name: 'Python 3',
    filename: 'solution.py',
    starterCode: `import sys

def main():
    pass

if __name__ == '__main__':
    main()
`
  },
  {
    id: 'javascript',
    name: 'JavaScript (Node.js)',
    filename: 'solution.js',
    starterCode: `const fs = require('fs');

function main() {
    
}

main();
`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    filename: 'solution.ts',
    starterCode: `import * as fs from 'fs';

function main(): void {
    
}

main();
`
  },
  {
    id: 'csharp',
    name: 'C#',
    filename: 'Solution.cs',
    starterCode: `using System;
using System.Collections.Generic;

class Solution {
    static void Main(string[] args) {
        
    }
}
`
  },
  {
    id: 'go',
    name: 'Go',
    filename: 'solution.go',
    starterCode: `package main

import "fmt"

func main() {
    
}
`
  },
  {
    id: 'rust',
    name: 'Rust',
    filename: 'solution.rs',
    starterCode: `use std::io;

fn main() {
    
}
`
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    filename: 'Solution.kt',
    starterCode: `import java.util.Scanner

fun main() {
    
}
`
  },
  {
    id: 'swift',
    name: 'Swift',
    filename: 'solution.swift',
    starterCode: `import Foundation

func main() {
    
}

main()
`
  }
];

// Lightweight stream-based syntax highlighters for non-C++ languages
function createStreamTokenizer(keywords: Set<string>, types: Set<string>, isHashComment: boolean = false) {
  return StreamLanguage.define({
    token(stream) {
      if (stream.eatSpace()) return null;

      // Line comments
      if (stream.match('//')) {
        stream.skipToEnd();
        return 'comment';
      }
      if (isHashComment && stream.match('#')) {
        stream.skipToEnd();
        return 'comment';
      }

      // Block comments
      if (stream.match('/*')) {
        while (!stream.eol()) {
          if (stream.match('*/')) break;
          stream.next();
        }
        return 'comment';
      }

      // Strings
      const ch = stream.peek();
      if (ch === '"' || ch === "'" || ch === '`') {
        stream.next();
        let escaped = false;
        while (!stream.eol()) {
          const next = stream.next();
          if (next === ch && !escaped) break;
          escaped = !escaped && next === '\\';
        }
        return 'string';
      }

      // Numbers
      if (stream.match(/^-?\d+(\.\d+)?/)) {
        return 'number';
      }

      // Identifiers / keywords
      if (stream.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*/)) {
        const word = stream.current();
        if (keywords.has(word)) return 'keyword';
        if (types.has(word)) return 'typeName';
        return 'variableName';
      }

      // Operators and punctuation
      stream.next();
      return null;
    }
  });
}

const javaStreamLanguage = createStreamTokenizer(
  new Set(['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'new', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'throw', 'throws', 'try', 'catch', 'finally', 'static', 'final', 'package', 'import']),
  new Set(['int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short', 'void', 'String', 'Scanner', 'List', 'ArrayList', 'Map', 'HashMap', 'Set', 'HashSet', 'Main'])
);

const pythonStreamLanguage = createStreamTokenizer(
  new Set(['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'import', 'from', 'as', 'pass', 'try', 'except', 'finally', 'raise', 'with', 'in', 'is', 'not', 'and', 'or', 'lambda', 'global', 'True', 'False', 'None']),
  new Set(['int', 'float', 'str', 'bool', 'list', 'dict', 'set', 'tuple', 'sys']),
  true
);

const jsStreamLanguage = createStreamTokenizer(
  new Set(['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends', 'import', 'export', 'from', 'default', 'async', 'await', 'require', 'module', 'exports', 'true', 'false', 'null', 'undefined']),
  new Set(['String', 'Number', 'Boolean', 'Array', 'Object', 'Promise', 'Set', 'Map', 'fs', 'process'])
);

const csharpStreamLanguage = createStreamTokenizer(
  new Set(['using', 'namespace', 'class', 'struct', 'interface', 'public', 'private', 'protected', 'internal', 'static', 'readonly', 'void', 'new', 'return', 'if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'try', 'catch', 'finally', 'throw', 'async', 'await']),
  new Set(['int', 'long', 'float', 'double', 'bool', 'char', 'string', 'Console', 'List', 'Dictionary', 'HashSet', 'Solution'])
);

const goStreamLanguage = createStreamTokenizer(
  new Set(['package', 'import', 'func', 'return', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 'break', 'continue', 'go', 'select', 'chan', 'var', 'const', 'type', 'struct', 'interface', 'nil', 'true', 'false']),
  new Set(['int', 'int64', 'float64', 'string', 'bool', 'error', 'fmt', 'main'])
);

const rustStreamLanguage = createStreamTokenizer(
  new Set(['fn', 'let', 'mut', 'return', 'if', 'else', 'for', 'while', 'loop', 'match', 'break', 'continue', 'use', 'mod', 'pub', 'struct', 'enum', 'impl', 'trait', 'type', 'where', 'unsafe', 'true', 'false']),
  new Set(['i32', 'i64', 'u32', 'u64', 'f64', 'bool', 'char', 'str', 'String', 'Vec', 'Option', 'Result', 'io'])
);

const kotlinStreamLanguage = createStreamTokenizer(
  new Set(['package', 'import', 'fun', 'val', 'var', 'return', 'if', 'else', 'for', 'while', 'do', 'when', 'break', 'continue', 'class', 'object', 'interface', 'null', 'true', 'false']),
  new Set(['Int', 'Long', 'Double', 'Float', 'Boolean', 'String', 'Array', 'List', 'Scanner'])
);

const swiftStreamLanguage = createStreamTokenizer(
  new Set(['import', 'func', 'let', 'var', 'return', 'if', 'else', 'for', 'in', 'while', 'repeat', 'switch', 'case', 'default', 'break', 'continue', 'class', 'struct', 'enum', 'guard', 'nil', 'true', 'false']),
  new Set(['Int', 'Double', 'Float', 'Bool', 'String', 'Array', 'Dictionary', 'Foundation'])
);

function getLanguageExtension(langId: string) {
  switch (langId) {
    case 'cpp':
    case 'c':
      return cpp();
    case 'java':
      return javaStreamLanguage;
    case 'python':
      return pythonStreamLanguage;
    case 'javascript':
    case 'typescript':
      return jsStreamLanguage;
    case 'csharp':
      return csharpStreamLanguage;
    case 'go':
      return goStreamLanguage;
    case 'rust':
      return rustStreamLanguage;
    case 'kotlin':
      return kotlinStreamLanguage;
    case 'swift':
      return swiftStreamLanguage;
    default:
      return cpp();
  }
}

// CodeMirror light theme matching Slate styling with horizontal scrolling
const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
  },
  '.cm-scroller': {
    overflowX: 'auto',
    overflowY: 'auto',
    fontFamily: 'inherit'
  },
  '.cm-content': {
    fontFamily: 'inherit',
    padding: '12px 0'
  },
  '.cm-line': {
    padding: '0 16px',
    lineHeight: '1.6'
  },
  '.cm-gutters': {
    backgroundColor: '#f8fafc',
    color: '#94a3b8',
    borderRight: '1px solid #e2e8f0',
    paddingRight: '4px'
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#e2e8f0',
    color: '#475569'
  },
  '.cm-activeLine': {
    backgroundColor: '#f8fafc'
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#2563eb',
    borderLeftWidth: '2px'
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: '#bfdbfe !important'
  }
});

export function CodeEditorPanel({ problemId, initialCode, onSubmitted }: CodeEditorPanelProps) {
  const { user } = useAuth();
  const userId = user?.id ?? 'anon';

  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const langCompartmentRef = useRef<Compartment>(new Compartment());
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectedLang, setSelectedLang] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Helper: draft storage key per user, per problem, per language
  const getDraftKey = useCallback((langId: string) => {
    return `codejudge:draft:${userId}:${problemId}:${langId}`;
  }, [userId, problemId]);

  // Helper: safely get saved code from localStorage or return fallback
  const getInitialCodeForLang = useCallback((lang: LanguageOption) => {
    try {
      const key = `codejudge:draft:${userId}:${problemId}:${lang.id}`;
      const saved = localStorage.getItem(key);
      if (saved !== null && saved !== undefined) {
        return saved;
      }
    } catch {
      // localStorage may fail in restricted contexts; ignore error
    }
    return lang.id === 'cpp' && initialCode ? initialCode : lang.starterCode;
  }, [userId, problemId, initialCode]);

  // Keep code per language in state, loading from localStorage initially
  const [codeByLang, setCodeByLang] = useState<Record<string, string>>(() => {
    const initialMap: Record<string, string> = {};
    for (const l of SUPPORTED_LANGUAGES) {
      initialMap[l.id] = getInitialCodeForLang(l);
    }
    return initialMap;
  });

  const codeRef = useRef<string>(getInitialCodeForLang(SUPPORTED_LANGUAGES[0]));

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Results state
  const [runResult, setRunResult] = useState<RunTestsResponse | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResponse['submission'] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBusy = isRunning || isSubmitting;

  // Debounced auto-save to localStorage
  const saveDraftDebounced = useCallback((langId: string, code: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      try {
        const key = getDraftKey(langId);
        localStorage.setItem(key, code);
      } catch {
        // Wrap localStorage access in try/catch
      }
    }, 500);
  }, [getDraftKey]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Initialize CodeMirror 6
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const startCode = getInitialCodeForLang(selectedLang);
    codeRef.current = startCode;
    setCodeByLang((prev) => ({
      ...prev,
      [selectedLang.id]: startCode
    }));

    const langExt = getLanguageExtension(selectedLang.id);

    const state = EditorState.create({
      doc: startCode,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        langCompartmentRef.current.of(langExt),
        editorTheme,
        keymap.of([
          indentWithTab,
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newDoc = update.state.doc.toString();
            codeRef.current = newDoc;
            setCodeByLang((prev) => ({
              ...prev,
              [selectedLang.id]: newDoc
            }));
            saveDraftDebounced(selectedLang.id, newDoc);
          }
        })
      ]
    });

    const view = new EditorView({
      state,
      parent: editorContainerRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [problemId, userId]);

  // Update editor doc when initialCode prop changes for cpp (only if no user draft is saved)
  useEffect(() => {
    if (initialCode) {
      try {
        const key = getDraftKey('cpp');
        const saved = localStorage.getItem(key);
        if (saved !== null) {
          // Keep user's saved draft
          return;
        }
      } catch {
        // ignore
      }

      setCodeByLang((prev) => ({
        ...prev,
        cpp: initialCode
      }));
      if (selectedLang.id === 'cpp' && viewRef.current && initialCode !== codeRef.current) {
        codeRef.current = initialCode;
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: initialCode
          }
        });
        setRunResult(null);
        setSubmitResult(null);
        setErrorMsg(null);
      }
    }
  }, [initialCode, getDraftKey, selectedLang.id]);

  const handleSelectLanguage = (lang: LanguageOption) => {
    if (lang.id === selectedLang.id) {
      setIsDropdownOpen(false);
      return;
    }

    // Save current code for current language in state and immediately flush to localStorage
    const currentCode = codeRef.current;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    try {
      localStorage.setItem(getDraftKey(selectedLang.id), currentCode);
    } catch {
      // ignore
    }
    setCodeByLang((prev) => ({
      ...prev,
      [selectedLang.id]: currentCode
    }));

    // Next language code: load saved draft first, fallback to starter template
    let targetCode = codeByLang[lang.id];
    try {
      const saved = localStorage.getItem(getDraftKey(lang.id));
      if (saved !== null && saved !== undefined) {
        targetCode = saved;
      }
    } catch {
      // ignore
    }

    if (targetCode === undefined || targetCode === null) {
      targetCode = lang.starterCode;
    }

    codeRef.current = targetCode;
    setSelectedLang(lang);
    setIsDropdownOpen(false);

    if (viewRef.current) {
      const nextExt = getLanguageExtension(lang.id);
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: targetCode
        },
        effects: langCompartmentRef.current.reconfigure(nextExt)
      });
      setRunResult(null);
      setSubmitResult(null);
      setErrorMsg(null);
    }
  };

  const handleReset = () => {
    if (isBusy || !viewRef.current) return;
    const resetVal = selectedLang.starterCode;
    codeRef.current = resetVal;

    // Delete that saved draft from localStorage
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    try {
      localStorage.removeItem(getDraftKey(selectedLang.id));
    } catch {
      // ignore
    }

    setCodeByLang((prev) => ({
      ...prev,
      [selectedLang.id]: resetVal
    }));
    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: resetVal
      }
    });
    setRunResult(null);
    setSubmitResult(null);
    setErrorMsg(null);
  };

  const handleRunTests = async () => {
    if (isBusy) return;
    const currentCode = codeRef.current;
    try {
      setIsRunning(true);
      setErrorMsg(null);
      setSubmitResult(null);
      const res = await runSampleTestsApi(problemId, currentCode, selectedLang.name);
      setRunResult(res);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Running sample tests failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (isBusy) return;
    const currentCode = codeRef.current;
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setRunResult(null);
      const res = await submitSolutionApi(problemId, currentCode, selectedLang.name);
      setSubmitResult(res.submission);
      if (res.submission && res.submission.verdict === 'Accepted') {
        window.dispatchEvent(new CustomEvent('codejudge:submission-accepted', {
          detail: { problemId, submission: res.submission }
        }));
      }
      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Editor Top Bar */}
      <div className="h-12 border-b border-slate-200 px-4 bg-slate-50/75 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Language selector dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => !isBusy && setIsDropdownOpen((prev) => !prev)}
              disabled={isBusy}
              className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-xs font-mono font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Select programming language"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span className="font-semibold">{selectedLang.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-56 max-h-72 overflow-y-auto bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
                  Select Language
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = lang.id === selectedLang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => handleSelectLanguage(lang)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition text-left ${
                        isSelected
                          ? 'bg-blue-50/80 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                        <span className="truncate">{lang.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 ml-2 shrink-0">
                        {lang.filename}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <span className="text-xs text-slate-400 font-mono hidden md:inline truncate max-w-xs">
            {selectedLang.filename}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Reset Code button */}
          <button
            type="button"
            onClick={handleReset}
            disabled={isBusy}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition border border-slate-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            title="Reset code to starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="font-semibold">Reset code</span>
          </button>

          {/* Run Tests (Sample cases only) */}
          <button
            type="button"
            onClick={handleRunTests}
            disabled={isBusy}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Run against sample cases only"
          >
            {isRunning ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
            ) : (
              <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            )}
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>

          {/* Submit Solution (All hidden tests) */}
          <button
            type="button"
            onClick={handleSubmitSolution}
            disabled={isBusy}
            className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Submit solution for evaluation against all test cases"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* CodeMirror 6 Editor Container */}
      <div className="h-[460px] relative overflow-hidden">
        {isBusy && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center space-y-2 pointer-events-auto">
            <div className="w-7 h-7 rounded-full border-3 border-blue-600 border-t-transparent animate-spin"></div>
            <span className="text-xs font-semibold text-slate-700 font-mono">
              {isSubmitting ? 'Evaluating solution against hidden tests...' : 'Compiling & running sample tests...'}
            </span>
          </div>
        )}
        <div ref={editorContainerRef} className="h-full w-full" />
      </div>

      {/* Execution / Submission Results Console Panel */}
      {(runResult || submitResult || errorMsg) && (
        <div className="border-t border-slate-200 bg-slate-50 p-4 max-h-72 overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submission Verdict Card */}
          {submitResult && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <VerdictBadge verdict={submitResult.verdict} size="md" />
                  <span className="text-xs font-mono text-slate-500">
                    Submission #{submitResult.id}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{submitResult.runtime_ms} ms</span>
                  </div>
                  <div className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {submitResult.passed_tests} / {submitResult.total_tests} Tests Passed
                  </div>
                </div>
              </div>

              {submitResult.verdict !== 'Accepted' && submitResult.verdict !== 'Compilation Error' && submitResult.failed_test_index && (
                <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 font-mono flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>
                    Failed on test {submitResult.failed_test_index}/{submitResult.total_tests}
                  </span>
                </div>
              )}

              {submitResult.verdict === 'Compilation Error' && submitResult.compilation_error && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                    Compiler Diagnostics:
                  </div>
                  <pre className="p-3 bg-slate-900 text-rose-300 rounded-xl text-xs font-mono whitespace-pre-wrap overflow-x-auto border border-slate-800">
                    {submitResult.compilation_error}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Run Sample Tests Card */}
          {runResult && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sample Tests:
                  </span>
                  <VerdictBadge verdict={runResult.verdict} size="sm" />
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{runResult.runtime_ms} ms</span>
                  </div>
                  <div className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {runResult.passed_tests} / {runResult.total_tests} Passed
                  </div>
                </div>
              </div>

              {runResult.verdict === 'Compilation Error' && runResult.compilation_error && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                    Compiler Diagnostics:
                  </div>
                  <pre className="p-3 bg-slate-900 text-rose-300 rounded-xl text-xs font-mono whitespace-pre-wrap overflow-x-auto border border-slate-800">
                    {runResult.compilation_error}
                  </pre>
                </div>
              )}

              {runResult.details && runResult.details.length > 0 && (
                <div className="space-y-2.5">
                  {runResult.details.map((tc) => (
                    <div
                      key={tc.testIndex}
                      className="bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {tc.status === 'Passed' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          <span className="font-semibold text-slate-800">
                            Sample Case #{tc.testIndex}
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          tc.status === 'Passed'
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : 'text-rose-700 bg-rose-50 border border-rose-200'
                        }`}>
                          {tc.status} ({tc.runtimeMs} ms)
                        </span>
                      </div>

                      <div className="text-[11px]">
                        <div className="text-slate-400 font-semibold mb-0.5">Input:</div>
                        <pre className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 overflow-x-auto whitespace-pre">
                          {tc.input}
                        </pre>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <div className="text-slate-500 font-semibold mb-0.5">Expected Output:</div>
                          <pre className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 overflow-x-auto whitespace-pre">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                        <div>
                          <div className="text-slate-500 font-semibold mb-0.5">Your Output:</div>
                          <pre className={`p-2 rounded-lg border overflow-x-auto whitespace-pre ${
                            tc.status === 'Passed'
                              ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                              : 'bg-rose-50/50 border-rose-200 text-rose-900 font-medium'
                          }`}>
                            {tc.actualOutput || '(No output)'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Editor Status Bottom Bar */}
      <div className="h-8 border-t border-slate-200 px-4 bg-slate-50 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-emerald-600">
            <CheckCircle2 className="w-3 h-3" />
            <span>CodeMirror 6 · {selectedLang.name}</span>
          </div>
          <span className="hidden sm:inline">Multi-Language Sandbox</span>
        </div>
        <div className="text-slate-400">
          Engine: {selectedLang.name}
        </div>
      </div>
    </div>
  );
}
