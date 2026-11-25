import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Always resolve to server/data regardless of cwd
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'codejudge.db');
export const db = new Database(dbPath);

// Enable WAL mode
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'User',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
    description TEXT NOT NULL,
    input_format TEXT NOT NULL,
    output_format TEXT NOT NULL,
    constraints TEXT NOT NULL,
    time_limit INTEGER NOT NULL DEFAULT 1000, -- in ms
    memory_limit INTEGER NOT NULL DEFAULT 256, -- in MB
    points INTEGER NOT NULL DEFAULT 100,
    starter_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS test_cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample INTEGER NOT NULL DEFAULT 0 CHECK(is_sample IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language TEXT DEFAULT 'C++20',
    verdict TEXT NOT NULL,
    runtime_ms INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  UPDATE problems SET starter_code = '#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    

    return 0;
}';
`);

try {
  db.prepare("ALTER TABLE submissions ADD COLUMN language TEXT DEFAULT 'C++20'").run();
} catch (e) {
  // Column already exists
}
