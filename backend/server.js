// Use the 'require' syntax for CommonJS modules
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs'); // Added fs module
const path = require('path'); // Added path module

const app = express();
const PORT = 4000;

const JWT_SECRET = 'your-super-secret-key-that-is-long-and-secure';
const USERS_FILE_PATH = path.join(__dirname, 'users.json'); // Define path for users.json

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// --- Dummy Data ---
// 'require' works correctly for JSON files in CommonJS modules
let apiUsers = require('./users.json'); // Changed to let for reassignment
let dummyUsers = [ // Changed to let for reassignment
  {
    id: 1,
    name: 'Nirav Parmar',
    email: 'niravparmar@gmail.com',
    password: 'password123',
    role: 'Admin', // Added role
    status: 'Active', // Added status
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

// 4. Create User Route
app.post('/api/users', (req, res) => {
  const { name, email, password, role, status, ...otherData } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  // Check if user already exists in dummyUsers or apiUsers
  if (dummyUsers.some(u => u.email === email) || apiUsers.some(u => u.email === email)) {
    return res.status(400).json({ message: 'User with this email already exists.' });
  }

  const newId = Math.max(0, ...apiUsers.map(u => u.id), ...dummyUsers.map(u => u.id)) + 1;

  const newUserApi = {
    id: newId,
    name,
    email,
    role: role || 'User', // Default role
    status: status || 'Active', // Default status
    ...otherData
  };
  apiUsers.push(newUserApi);

  // Add to dummyUsers only if password is provided
  if (password) {
    const newUserDummy = {
      id: newId,
      name,
      email,
      password
    };
    dummyUsers.push(newUserDummy);
  }

  // Update users.json
  fs.writeFile(USERS_FILE_PATH, JSON.stringify(apiUsers, null, 2), (err) => {
    if (err) {
      console.error("Failed to write to users.json:", err);
      // Even if file write fails, proceed with response as user is added in-memory
      // For a real app, might want to handle this more robustly (e.g., transaction, rollback)
    }
  });

  res.status(201).json({ message: 'User created successfully!', user: newUserApi });
});

// 5. Update User Route
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { name, email, password, role, status, ...otherData } = req.body;

  let userFound = false;
  let updatedUserInApi = null;

  // Update in apiUsers
  apiUsers = apiUsers.map(user => {
    if (user.id === userId) {
      userFound = true;
      updatedUserInApi = {
        ...user,
        name: name || user.name,
        email: email || user.email,
        role: role || user.role, // Update role if provided
        status: status || user.status, // Update status if provided
        ...otherData // otherData will not overwrite existing role/status unless explicitly included by client
      };
      return updatedUserInApi;
    }
    return user;
  });

  // Update in dummyUsers if email, password, name, role or status changed for that user
  // Note: dummyUsers primarily for login, role/status less critical here but kept for consistency
  if (userFound && (email || password || name || role || status)) {
    dummyUsers = dummyUsers.map(user => {
      if (user.id === userId) {
        const updatedDummyUser = { ...user };
        if (name) updatedDummyUser.name = name;
        if (email) updatedDummyUser.email = email;
        if (password) updatedDummyUser.password = password;
        if (role) updatedDummyUser.role = role;
        if (status) updatedDummyUser.status = status;
        return updatedDummyUser;
      }
      return user;
    });
  }

  if (!userFound) {
    return res.status(404).json({ message: 'User not found.' });
  }
  // If userFound is true, but no actual data fields were provided for update,
  // it will just return the existing user data.
  // The frontend UserForm is expected to send at least one modifiable field.

  // Update users.json
  fs.writeFile(USERS_FILE_PATH, JSON.stringify(apiUsers, null, 2), (err) => {
    if (err) {
      console.error("Failed to write to users.json:", err);
      // Potentially handle error more gracefully
    }
  });

  res.json({ message: 'User updated successfully!', user: updatedUserInApi });
});

// 6. Delete User Route
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);

  const initialApiUsersLength = apiUsers.length;
  const initialDummyUsersLength = dummyUsers.length;

  apiUsers = apiUsers.filter(user => user.id !== userId);
  dummyUsers = dummyUsers.filter(user => user.id !== userId);

  if (apiUsers.length === initialApiUsersLength && dummyUsers.length === initialDummyUsersLength) {
    return res.status(404).json({ message: 'User not found.' });
  }

  // Update users.json
  fs.writeFile(USERS_FILE_PATH, JSON.stringify(apiUsers, null, 2), (err) => {
    if (err) {
      console.error("Failed to write to users.json:", err);
      // Potentially handle error more gracefully
    }
  });

  res.status(200).json({ message: 'User deleted successfully.' });
});


app.listen(PORT, () => {
  console.log(`JWT Auth Server running on http://localhost:${PORT}`);
});