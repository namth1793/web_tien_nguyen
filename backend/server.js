require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./database');

const app = express();
const PORT = process.env.PORT || 5030;

// Parse allowed origins from env (comma-separated)
const rawOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:3030,http://localhost:3000';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/comics',  require('./routes/comics'));
app.use('/api/chapters',require('./routes/chapters'));
app.use('/api/users',   require('./routes/users'));
app.use('/api/reading', require('./routes/reading'));

app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Manga Backend → http://localhost:${PORT}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
});
