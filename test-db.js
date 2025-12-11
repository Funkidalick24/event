import Database from 'better-sqlite3';
const db = new Database('./database.db');

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables);

  const schema = db.prepare("PRAGMA table_info(events)").all();
  console.log('Events schema:', schema);

  const events = db.prepare("SELECT * FROM events").all();
  console.log('Events:', events);
} catch (error) {
  console.error('Error:', error);
} finally {
  db.close();
}