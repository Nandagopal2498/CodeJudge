import { db } from '../config/db.js';

const email = process.argv[2];

if (!email) {
  console.error('Usage: npm run promote <email>');
  process.exit(1);
}

const user = db.prepare('SELECT id, username, email, role FROM users WHERE email = ?').get(email.toLowerCase()) as {
  id: number;
  username: string;
  email: string;
  role: string;
} | undefined;

if (!user) {
  console.error(`User with email "${email}" not found.`);
  process.exit(1);
}

db.prepare("UPDATE users SET role = 'Admin' WHERE id = ?").run(user.id);
console.log(`[Success] User "${user.username}" (${user.email}) has been promoted to Admin.`);
