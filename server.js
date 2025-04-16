
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Mock database (replace with real database later)
const users = [];

// Mock user progress data
const userProgress = new Map();

function initializeUserProgress(userId) {
  if (!userProgress.has(userId)) {
    userProgress.set(userId, {
      level: 1,
      completedLessons: [],
      reviewsDue: []
    });
  }
  return userProgress.get(userId);
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./'));

app.get('/api/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = users.find(u => u.username === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const progress = initializeUserProgress(userId);
  res.json({ user, progress });
});

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  // Store user (in our mock database)
  const newUser = { username, email, password };
  users.push(newUser);
  
  res.status(201).json({ message: 'Registration successful' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
