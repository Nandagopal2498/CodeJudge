# CodeJudge Platform

A high-performance, self-hosted online judge platform built for competitive programming and algorithmic practice. Runs untrusted C++20 code in isolated execution environments with strict CPU, memory, and timeout limits.

---

## 🌟 Key Features

- **Local Authentication**: Secure registration and login using SQLite with `bcrypt` password hashing and `httpOnly` JWT sessions.
- **Curated Problem Archive**: Categorized by difficulty (`Easy`, `Medium`, `Hard`) with constraints, input/output formats, and sample cases.
- **In-Browser C++ Code Editor**: Integrated Monaco Editor with C++20 syntax highlighting, starter code, and sample test evaluation.
- **Automated Sandboxed Judging Engine**:
  - Compiles with MinGW-w64 GCC (`-std=c++20 -O3`).
  - Isolated per-submission temp execution workspaces with automatic cleanup.
  - Concurrency queue limiting active runs to 2 simultaneous jobs.
  - Generates verdicts: `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Runtime Error`, and `Compilation Error`.
- **Live Leaderboard**: Ranked by total points, crediting each problem once on the user's first Accepted submission.
- **Admin Portal**: Role-based access control (`Admin`) with problem CRUD and full public sample / hidden test case management.
- **Security & Protection**: Per-IP rate limiting on authentication and submission endpoints; hidden test cases are strictly filtered from candidate-facing APIs.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, `@monaco-editor/react`, `lucide-react`, `react-router-dom`
- **Backend**: Node.js, Express, TypeScript, `better-sqlite3`, `bcryptjs`, `jsonwebtoken`, `express-rate-limit`, `cookie-parser`
- **Compiler**: MinGW-w64 GCC (`x86_64-w64-mingw32-g++` 16.2.0 supporting C++20)

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **C++ Compiler**: GCC with C++20 support (`g++`) added to system PATH.

### 2. Backend Setup
```bash
cd server
npm install
```

Configure your `.env` in `server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secure_random_jwt_secret_here
JWT_EXPIRES_IN=7d
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=20
SUBMIT_RATE_LIMIT_WINDOW_MS=60000
SUBMIT_RATE_LIMIT_MAX=15
```

Build and run:
```bash
# Build TypeScript
npm run build

# Start dev server with hot reload
npm run dev
```

### 3. Frontend Setup
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👑 Admin User Management

To grant admin privileges to any user by email:
```bash
cd server
npm run promote <user-email>
# Example: npm run promote admin@codejudge.dev
```

---

## 🧪 Architecture Overview

```text
Code-Judge/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # CodeEditorPanel, Navbar, DifficultyBadge, TestCaseManager
│   │   ├── context/     # AuthContext (JWT session management)
│   │   ├── pages/       # Problems, Detail, Submissions, Leaderboard, Admin, 404
│   │   └── services/    # Typed API communication clients
├── server/              # Express backend REST API
│   ├── src/
│   │   ├── config/      # SQLite connection & env configs
│   │   ├── controllers/ # Auth, Problem, Submission, Leaderboard, Admin
│   │   ├── judge/       # C++20 compiler & execution harness
│   │   ├── middlewares/ # Auth, Admin, and RateLimit guards
│   │   ├── queue/       # Concurrency queue (max 2 parallel workers)
│   │   └── scripts/     # Admin promotion script
└── README.md
```
