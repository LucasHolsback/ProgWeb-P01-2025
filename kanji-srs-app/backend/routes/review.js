const express = require('express');
const db = require('../db');
const router = express.Router();

// Get next due card for a user
router.get('/next', (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).json({ message: 'Missing user' });

  const query = `
    SELECT cards.*, user_cards.id as user_card_id, user_cards.interval
    FROM user_cards
    JOIN cards ON user_cards.card_id = cards.id
    WHERE user_cards.user = ? AND date(user_cards.next_review_date) <= date('now')
    ORDER BY user_cards.next_review_date ASC
    LIMIT 1
  `;

  db.get(query, [user], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.json({ message: 'No cards due', card: null });

    res.json({ card: row });
  });
});

// Submit review result
router.post('/submit', (req, res) => {
  const { user, cardId, rating } = req.body;
  if (!user || !cardId || !rating)
    return res.status(400).json({ message: 'Missing fields' });

  const multipliers = { again: 0, hard: 1.2, good: 2.5, easy: 3.0 };

  db.get(
    'SELECT * FROM user_cards WHERE user = ? AND card_id = ?',
    [user, cardId],
    (err, uc) => {
      if (err || !uc) return res.status(404).json({ message: 'User card not found' });

      let interval;
      let nextReview;

      if (rating === 'again') {
        interval = 1;
        nextReview = new Date(); // today
      } else {
        interval = Math.max(1, Math.round(uc.interval * multipliers[rating]));
        nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);
      }

      const nextReviewStr = nextReview.toISOString().split('T')[0];

      db.run(
        `UPDATE user_cards SET interval = ?, next_review_date = ? WHERE id = ?`,
        [interval, nextReviewStr, uc.id],
        (err) => {
          if (err) return res.status(500).json({ message: 'Failed to update card' });
          res.json({ message: 'Review submitted' });
        }
      );
    }
  );
});

module.exports = router;
