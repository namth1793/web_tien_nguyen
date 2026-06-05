const router = require('express').Router();
const db = require('../database');
const auth = require('../middleware/auth');

function parseComic(c) {
  if (!c) return null;
  return { ...c, genres: JSON.parse(c.genres || '[]') };
}

router.get('/', (req, res) => {
  const { search, genre, status, sort = 'views', page = 1, limit = 20 } = req.query;
  let query = 'SELECT * FROM comics WHERE 1=1';
  const params = [];
  if (search) { query += ' AND title LIKE ?'; params.push(`%${search}%`); }
  if (genre) { query += ' AND genres LIKE ?'; params.push(`%${genre}%`); }
  if (status) { query += ' AND status = ?'; params.push(status); }

  const validSorts = { views: 'views DESC', rating: 'rating DESC', new: 'createdAt DESC', updated: 'updatedAt DESC' };
  query += ` ORDER BY ${validSorts[sort] || 'views DESC'}`;
  query += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

  const comics = db.prepare(query).all(...params).map(parseComic);
  const total = db.prepare('SELECT COUNT(*) as count FROM comics WHERE 1=1').get().count;
  res.json({ comics, total, page: parseInt(page), limit: parseInt(limit) });
});

router.get('/hot', (req, res) => {
  const comics = db.prepare('SELECT * FROM comics WHERE isHot = 1 ORDER BY views DESC LIMIT 10').all().map(parseComic);
  res.json(comics);
});

router.get('/new', (req, res) => {
  const comics = db.prepare('SELECT * FROM comics WHERE isNew = 1 ORDER BY createdAt DESC LIMIT 12').all().map(parseComic);
  res.json(comics);
});

router.get('/trending', (req, res) => {
  const comics = db.prepare('SELECT * FROM comics ORDER BY views DESC LIMIT 10').all().map(parseComic);
  res.json(comics);
});

router.get('/recommended', (req, res) => {
  const comics = db.prepare('SELECT * FROM comics ORDER BY rating DESC LIMIT 12').all().map(parseComic);
  res.json(comics);
});

router.get('/:slug', (req, res) => {
  const comic = db.prepare('SELECT * FROM comics WHERE slug = ?').get(req.params.slug);
  if (!comic) return res.status(404).json({ error: 'Comic not found' });
  db.prepare('UPDATE comics SET views = views + 1 WHERE id = ?').run(comic.id);
  const chapters = db.prepare('SELECT * FROM chapters WHERE comicId = ? ORDER BY chapterNumber ASC').all(comic.id);
  const comments = db.prepare(`
    SELECT c.*, u.username, u.avatar FROM comments c
    JOIN users u ON c.userId = u.id
    WHERE c.comicId = ? ORDER BY c.createdAt DESC LIMIT 20
  `).all(comic.id);
  res.json({ ...parseComic(comic), chapters, comments });
});

router.post('/:id/bookmark', auth, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('INSERT INTO bookmarks (userId, comicId) VALUES (?, ?)').run(req.user.id, id);
    res.json({ bookmarked: true });
  } catch {
    db.prepare('DELETE FROM bookmarks WHERE userId = ? AND comicId = ?').run(req.user.id, id);
    res.json({ bookmarked: false });
  }
});

router.post('/:id/favorite', auth, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('INSERT INTO favorites (userId, comicId) VALUES (?, ?)').run(req.user.id, id);
    res.json({ favorited: true });
  } catch {
    db.prepare('DELETE FROM favorites WHERE userId = ? AND comicId = ?').run(req.user.id, id);
    res.json({ favorited: false });
  }
});

router.post('/:id/comment', auth, (req, res) => {
  const { content, chapterId } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: 'Content required' });
  const result = db.prepare('INSERT INTO comments (userId, comicId, chapterId, content) VALUES (?, ?, ?, ?)').run(req.user.id, req.params.id, chapterId || null, content);
  const comment = db.prepare(`
    SELECT c.*, u.username, u.avatar FROM comments c
    JOIN users u ON c.userId = u.id WHERE c.id = ?
  `).get(result.lastInsertRowid);
  res.json(comment);
});

router.post('/:id/rate', auth, (req, res) => {
  const { score } = req.body;
  if (score < 1 || score > 10) return res.status(400).json({ error: 'Score must be 1-10' });
  try {
    db.prepare('INSERT INTO ratings (userId, comicId, score) VALUES (?, ?, ?)').run(req.user.id, req.params.id, score);
  } catch {
    db.prepare('UPDATE ratings SET score = ? WHERE userId = ? AND comicId = ?').run(score, req.user.id, req.params.id);
  }
  const { avg } = db.prepare('SELECT AVG(score) as avg FROM ratings WHERE comicId = ?').get(req.params.id);
  db.prepare('UPDATE comics SET rating = ? WHERE id = ?').run(Math.round(avg * 10) / 10, req.params.id);
  res.json({ rating: avg });
});

module.exports = router;
