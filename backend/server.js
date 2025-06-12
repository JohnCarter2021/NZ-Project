// Use the 'require' syntax for CommonJS modules
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 4000;

const JWT_SECRET = 'your-super-secret-key-that-is-long-and-secure';

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// --- Dummy Data ---
// 'require' works correctly for JSON files in CommonJS modules
const apiUsers = require('./users.json');
const dummyUsers = [
  {
    id: 1,
    name: 'Nirav Parmar',
    email: 'niravparmar@gmail.com',
    password: 'password123',
  },
];

// --- Routes ---

// 1. Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = dummyUsers.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = { id: user.id, name: user.name, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  res.json({
    message: 'Login successful!',
    token: token,
    user: payload,
  });
});

// 2. JWT Verification Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// 3. Protected Route
app.get('/api/users', authenticateToken, (req, res) => {
  res.json(apiUsers);
});


app.listen(PORT, () => {
  console.log(`JWT Auth Server running on http://localhost:${PORT}`);
});