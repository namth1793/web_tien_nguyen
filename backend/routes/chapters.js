const router = require('express').Router();
const db = require('../database');

router.get('/comic/:comicId', (req, res) => {
  const chapters = db.prepare('SELECT * FROM chapters WHERE comicId = ? ORDER BY chapterNumber ASC').all(req.params.comicId);
  res.json(chapters);
});

router.get('/:id', (req, res) => {
  const chapter = db.prepare('SELECT ch.*, c.title as comicTitle, c.slug as comicSlug FROM chapters ch JOIN comics c ON ch.comicId = c.id WHERE ch.id = ?').get(req.params.id);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
  db.prepare('UPDATE chapters SET views = views + 1 WHERE id = ?').run(chapter.id);
  const prev = db.prepare('SELECT id, chapterNumber FROM chapters WHERE comicId = ? AND chapterNumber < ? ORDER BY chapterNumber DESC LIMIT 1').get(chapter.comicId, chapter.chapterNumber);
  const next = db.prepare('SELECT id, chapterNumber FROM chapters WHERE comicId = ? AND chapterNumber > ? ORDER BY chapterNumber ASC LIMIT 1').get(chapter.comicId, chapter.chapterNumber);
  // Generate dummy pages
  const pages = Array.from({ length: 20 }, (_, i) => `https://picsum.photos/seed/ch${chapter.id}p${i + 1}/800/1200`);
  res.json({ ...chapter, pages, prev, next });
});

module.exports = router;
