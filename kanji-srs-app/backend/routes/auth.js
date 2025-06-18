const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);

  if (!username || !password)
    return res.status(400).json({ message: 'Missing username or password' });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE'))
          return res.status(400).json({ message: 'Username already exists' });
        return res.status(500).json({ message: 'Internal error' });
      }

      // New user inserted, now link all cards to this user
      db.all('SELECT id FROM cards', [], (err, rows) => {
        if (err) {
          console.error('Error fetching cards:', err);
          // Optionally delete the created user here to avoid half setup, or just respond anyway
          return res.status(500).json({ message: 'Internal error linking cards' });
        }

        // Insert a user_cards row for each card
        const stmt = db.prepare(`INSERT INTO user_cards (user, card_id) VALUES (?, ?)`);
        rows.forEach(card => {
          stmt.run(username, card.id);
        });
        stmt.finalize((err) => {
          if (err) {
            console.error('Error linking cards to user:', err);
            return res.status(500).json({ message: 'Internal error linking cards' });
          }

          // All done, respond success
          res.status(201).json({ message: 'User registered successfully' });
        });
      });
    }
  );
});


// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Missing username or password' });

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Internal error' });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful' });
  });
});

module.exports = router;
