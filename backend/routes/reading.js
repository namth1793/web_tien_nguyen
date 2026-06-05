const router = require('express').Router();
const db = require('../database');
const auth = require('../middleware/auth');

router.post('/update', auth, (req, res) => {
  const { comicId, chapterId, progress } = req.body;
  const existing = db.prepare('SELECT id FROM reading_history WHERE userId = ? AND comicId = ?').get(req.user.id, comicId);
  if (existing) {
    db.prepare('UPDATE reading_history SET chapterId = ?, progress = ?, updatedAt = CURRENT_TIMESTAMP WHERE userId = ? AND comicId = ?').run(chapterId, progress, req.user.id, comicId);
  } else {
    db.prepare('INSERT INTO reading_history (userId, comicId, chapterId, progress) VALUES (?, ?, ?, ?)').run(req.user.id, comicId, chapterId, progress);
  }
  res.json({ success: true });
});

router.get('/history', auth, (req, res) => {
  const history = db.prepare(`
    SELECT rh.*, c.title, c.cover, c.slug, c.author,
      ch.chapterNumber, ch.title as chapterTitle
    FROM reading_history rh
    JOIN comics c ON rh.comicId = c.id
    LEFT JOIN chapters ch ON rh.chapterId = ch.id
    WHERE rh.userId = ? ORDER BY rh.updatedAt DESC LIMIT 10
  `).all(req.user.id);
  res.json(history);
});

router.delete('/history/:comicId', auth, (req, res) => {
  db.prepare('DELETE FROM reading_history WHERE userId = ? AND comicId = ?').run(req.user.id, req.params.comicId);
  res.json({ success: true });
});

module.exports = router;
