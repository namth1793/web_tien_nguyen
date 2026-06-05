const router = require('express').Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.get('/:id', (req, res) => {
  const user = db.prepare('SELECT id, username, avatar, bio, level, xp, coin, createdAt FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.get('/:id/bookmarks', auth, (req, res) => {
  const bookmarks = db.prepare(`
    SELECT c.*, b.createdAt as bookmarkedAt FROM bookmarks b
    JOIN comics c ON b.comicId = c.id WHERE b.userId = ?
    ORDER BY b.createdAt DESC
  `).all(req.user.id);
  res.json(bookmarks.map(c => ({ ...c, genres: JSON.parse(c.genres || '[]') })));
});

router.get('/:id/favorites', auth, (req, res) => {
  const favorites = db.prepare(`
    SELECT c.*, f.createdAt as favoritedAt FROM favorites f
    JOIN comics c ON f.comicId = c.id WHERE f.userId = ?
    ORDER BY f.createdAt DESC
  `).all(req.user.id);
  res.json(favorites.map(c => ({ ...c, genres: JSON.parse(c.genres || '[]') })));
});

router.get('/:id/history', auth, (req, res) => {
  const history = db.prepare(`
    SELECT rh.*, c.title, c.cover, c.slug, ch.chapterNumber FROM reading_history rh
    JOIN comics c ON rh.comicId = c.id
    LEFT JOIN chapters ch ON rh.chapterId = ch.id
    WHERE rh.userId = ? ORDER BY rh.updatedAt DESC LIMIT 20
  `).all(req.user.id);
  res.json(history);
});

router.get('/:id/stats', auth, (req, res) => {
  const userId = req.user.id;
  const totalRead = db.prepare('SELECT COUNT(DISTINCT comicId) as count FROM reading_history WHERE userId = ?').get(userId).count;
  const totalBookmarks = db.prepare('SELECT COUNT(*) as count FROM bookmarks WHERE userId = ?').get(userId).count;
  const totalFavorites = db.prepare('SELECT COUNT(*) as count FROM favorites WHERE userId = ?').get(userId).count;
  const totalComments = db.prepare('SELECT COUNT(*) as count FROM comments WHERE userId = ?').get(userId).count;
  res.json({ totalRead, totalBookmarks, totalFavorites, totalComments });
});

module.exports = router;
