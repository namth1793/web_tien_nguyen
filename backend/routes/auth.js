const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const auth = require('../middleware/auth');

function sign(user) {
  return jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const hash = bcrypt.hashSync(password, 10);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    const result = db.prepare(`INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)`).run(username, email, hash, avatar);
    const user = db.prepare('SELECT id, username, email, avatar, coin, bio, level, xp, role, status, createdAt FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.json({ token: sign(user), user });
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Username or email already exists' });
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const { password: _, ...safeUser } = user;
  res.json({ token: sign(safeUser), user: safeUser });
});

router.get('/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, username, email, avatar, coin, bio, level, xp, role, status, createdAt FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.put('/profile', auth, (req, res) => {
  const { bio, avatar } = req.body;
  db.prepare('UPDATE users SET bio = ?, avatar = ? WHERE id = ?').run(bio, avatar, req.user.id);
  const user = db.prepare('SELECT id, username, email, avatar, coin, bio, level, xp, role, status, createdAt FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

module.exports = router;
