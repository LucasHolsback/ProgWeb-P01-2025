const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./srs.db');

db.serialize(() => {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Seed users if empty
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
  if (err) return console.error(err);
  if (row.count === 0) {
    const sampleUsers = [
      { username: 'testuser', password: 'testpass' },
      { username: 'alice', password: 'password123' },
      { username: 'bob', password: 'qwerty' },
    ];

    sampleUsers.forEach(({ username, password }) => {
      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, password]
      );
    });

    console.log("Sample users inserted.");
    }
  });

  
  

  // Create cards table
  db.run(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kanji TEXT NOT NULL,
      meaning TEXT NOT NULL,
      onyomi TEXT,
      kunyomi TEXT,
      example TEXT
    )
  `);

  // Create user_cards table (SRS tracking)
  db.run(`
    CREATE TABLE IF NOT EXISTS user_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user TEXT NOT NULL,
      card_id INTEGER NOT NULL,
      interval INTEGER DEFAULT 1,
      next_review_date TEXT DEFAULT CURRENT_DATE,
      ease_factor REAL DEFAULT 2.5,
      FOREIGN KEY (card_id) REFERENCES cards(id)
    )
  `);

  // Seed sample cards if table is empty
  db.get('SELECT COUNT(*) as count FROM cards', (err, row) => {
    if (err) return console.error(err);
    if (row.count === 0) {
      const sampleCards = [
        ['日', 'sun, day', 'ニチ, ジツ', 'ひ, -び, -か', '今日は良い日です。'],
        ['月', 'moon, month', 'ゲツ, ガツ', 'つき', '月がとても明るい。'],
        ['火', 'fire', 'カ', 'ひ, -び, ほ-', '火を使って料理する。'],
        ['水', 'water', 'スイ', 'みず', '水をたくさん飲みましょう。'],
        ['木', 'tree, wood', 'ボク, モク', 'き, こ-', '大きな木の下で休む。'],
      ];

      sampleCards.forEach(([kanji, meaning, onyomi, kunyomi, example]) => {
        db.run(
          `INSERT INTO cards (kanji, meaning, onyomi, kunyomi, example)
           VALUES (?, ?, ?, ?, ?)`,
          [kanji, meaning, onyomi, kunyomi, example]
        );
      });

      console.log("Sample kanji cards inserted.");
    }
  });

  // (Optional) Seed user_cards for a specific user — update if needed
  const defaultUser = 'testuser';
  db.get(`SELECT COUNT(*) AS count FROM user_cards WHERE user = ?`, [defaultUser], (err, row) => {
    if (row && row.count === 0) {
      db.all('SELECT id FROM cards', [], (err, rows) => {
        rows.forEach(card => {
          db.run(`INSERT INTO user_cards (user, card_id) VALUES (?, ?)`, [defaultUser, card.id]);
        });
        console.log(`Linked cards to user "${defaultUser}".`);
      });
    }
  });
});

module.exports = db;
