import React from 'react';

interface CodeFormattedTextProps {
  text: string;
  className?: string;
}

export function CodeFormattedText({ text, className = '' }: CodeFormattedTextProps) {
  // Split on backticks `...`
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          const codeContent = part.slice(1, -1);
          return (
            <code
              key={index}
              className="px-1.5 py-0.5 mx-0.5 font-mono text-xs font-semibold bg-slate-100 text-blue-700 border border-slate-200 rounded"
            >
              {codeContent}
            </code>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
