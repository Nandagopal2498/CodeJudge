import { db } from '../config/db.js';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'User' | 'Admin';
  created_at: string;
}

export type SafeUser = Omit<User, 'password_hash'>;

export class UserModel {
  static create(username: string, email: string, passwordHash: string, role: 'User' | 'Admin' = 'User'): SafeUser {
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(username, email.toLowerCase(), passwordHash, role);
    return {
      id: Number(info.lastInsertRowid),
      username,
      email: email.toLowerCase(),
      role,
      created_at: new Date().toISOString()
    };
  }

  static findByEmail(email: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email.toLowerCase()) as User | undefined;
  }

  static findByUsername(username: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
  }

  static findById(id: number): SafeUser | undefined {
    const stmt = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?');
    return stmt.get(id) as SafeUser | undefined;
  }
}
