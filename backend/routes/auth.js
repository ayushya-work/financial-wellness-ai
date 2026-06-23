const express = require('express');
const router = express.Router();
const users = require('../data/users.json');
const { generateToken } = require('../middleware/auth');

// Employee login - validates userId and password, issues secure token
router.post('/login', (req, res) => {
  const { userId, password } = req.body;
  
  if (!userId || !password) {
    return res.status(400).json({ error: "User ID and password are required" });
  }
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: "Invalid user ID or password" });
  }
  
  // Validate password (in production, would use bcrypt for hashing)
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid user ID or password" });
  }
  
  // Generate secure token for this session
  const token = generateToken(userId);
  
  // Return user object without password
  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  
  res.json({ token, user: userResponse });
});

module.exports = router;
