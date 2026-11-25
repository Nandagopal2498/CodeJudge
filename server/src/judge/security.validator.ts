/**
 * Security code validator to reject dangerous includes or function calls before compiling.
 */

export interface SecurityCheckResult {
  isSafe: boolean;
  verdict?: 'Compilation Error';
  reason?: string;
}

const FORBIDDEN_HEADERS = [
  'fstream',
  'fstream.h',
  'filesystem',
  'experimental/filesystem',
  'sys/socket.h',
  'winsock2.h',
  'winsock.h',
  'ws2tcpip.h',
  'arpa/inet.h',
  'netinet/in.h',
  'netdb.h',
  'windows.h',
  'unistd.h',
  'sys/types.h',
  'sys/stat.h',
  'dirent.h',
  'process.h'
];

const FORBIDDEN_PATTERNS = [
  { pattern: /\bsystem\s*\(/i, name: 'system()' },
  { pattern: /\bfork\s*\(/i, name: 'fork()' },
  { pattern: /\bvfork\s*\(/i, name: 'vfork()' },
  { pattern: /\bpopen\s*\(/i, name: 'popen()' },
  { pattern: /\bexec[lv]?[pe]?\s*\(/i, name: 'exec*' },
  { pattern: /\bCreateProcess[AW]?\s*\(/i, name: 'CreateProcess' },
  { pattern: /\bShellExecute[AW]?\s*\(/i, name: 'ShellExecute' },
  { pattern: /\bWinExec\s*\(/i, name: 'WinExec' },
  { pattern: /\bsocket\s*\(/i, name: 'socket()' },
  { pattern: /\bconnect\s*\(/i, name: 'connect()' },
  { pattern: /\bbind\s*\(/i, name: 'bind()' },
  { pattern: /\blisten\s*\(/i, name: 'listen()' },
  { pattern: /\baccept\s*\(/i, name: 'accept()' },
  { pattern: /\bkill\s*\(/i, name: 'kill()' },
  { pattern: /\bclone\s*\(/i, name: 'clone()' }
];

export function validateCodeSecurity(code: string): SecurityCheckResult {
  // Check code size limit (64 KB)
  if (Buffer.byteLength(code, 'utf8') > 64 * 1024) {
    return {
      isSafe: false,
      verdict: 'Compilation Error',
      reason: 'Security Violation: Code size exceeds 64 KB limit.'
    };
  }

  // Strip comments before checking patterns to avoid false positives in comment blocks
  const cleanedCode = code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, ' ');

  // 1. Check prohibited headers
  for (const header of FORBIDDEN_HEADERS) {
    const escaped = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const headerRegex = new RegExp(`#\\s*include\\s*[<"]\\s*${escaped}\\s*[>"]`, 'i');
    if (headerRegex.test(cleanedCode)) {
      return {
        isSafe: false,
        verdict: 'Compilation Error',
        reason: `Security Violation: Prohibited header <${header}> is not allowed.`
      };
    }
  }

  // 2. Check prohibited function calls
  for (const item of FORBIDDEN_PATTERNS) {
    if (item.pattern.test(cleanedCode)) {
      return {
        isSafe: false,
        verdict: 'Compilation Error',
        reason: `Security Violation: Restricted function call ${item.name} is prohibited.`
      };
    }
  }

  return { isSafe: true };
}
