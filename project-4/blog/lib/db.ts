import sql from 'better-sqlite3';

const db = sql('blog.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT
  );
`);

db.exec(`CREATE TABLE IF NOT EXISTS sessions (
  id TEXT NOT NULL PRIMARY KEY AUTOINCREMENT,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`);

db.exec(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
    content TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
  CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
  CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
  CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
  `)




// const hasTrainings =
//   db.prepare('SELECT COUNT(*) as count FROM trainings').get().count > 0;

// if (!hasTrainings) {
//   db.exec(`
//     INSERT INTO trainings (title, image, description)
//     VALUES
//     ('Yoga', '/yoga.jpg', 'A gentle way to improve flexibility and balance.'),
//     ('Boxing', '/boxing.jpg', 'A high-energy workout that improves strength and speed.'),
//     ('Running', '/running.jpg', 'A great way to improve cardiovascular health and endurance.'),
//     ('Weightlifting', '/weightlifting.jpg', 'A strength-building workout that helps tone muscles.'),
//     ('Cycling', '/cycling.jpg', 'A low-impact workout that improves cardiovascular health and endurance.'),
//     ('Gaming', '/gaming.jpg', 'A fun way to improve hand-eye coordination and reflexes.'),
//     ('Sailing', '/sailing.jpg', 'A relaxing way to enjoy the outdoors and improve balance.');
// `);
// }

export default db;