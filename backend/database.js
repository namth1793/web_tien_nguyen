const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'manga.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    coin INTEGER DEFAULT 0,
    bio TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS comics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover TEXT NOT NULL,
    description TEXT,
    author TEXT NOT NULL,
    genres TEXT NOT NULL,
    rating REAL DEFAULT 0,
    views INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ongoing',
    isHot INTEGER DEFAULT 0,
    isNew INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comicId INTEGER NOT NULL,
    title TEXT,
    chapterNumber REAL NOT NULL,
    views INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comicId) REFERENCES comics(id)
  );

  CREATE TABLE IF NOT EXISTS reading_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    comicId INTEGER NOT NULL,
    chapterId INTEGER,
    progress REAL DEFAULT 0,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (comicId) REFERENCES comics(id)
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    comicId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, comicId)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    comicId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, comicId)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    comicId INTEGER NOT NULL,
    chapterId INTEGER,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    comicId INTEGER NOT NULL,
    score INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, comicId)
  );
`);

function seed() {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (count > 0) return;

  const hash = bcrypt.hashSync('password123', 10);
  const insUser = db.prepare(`
    INSERT INTO users (username, email, password, avatar, coin, bio, level, xp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insUser.run('MangaFan', 'fan@manga.vn', hash, 'https://api.dicebear.com/7.x/avataaars/svg?seed=MangaFan', 500, 'Yêu thích manga Nhật Bản và manhwa Hàn Quốc', 15, 4500);
  insUser.run('DragonReader', 'dragon@manga.vn', hash, 'https://api.dicebear.com/7.x/avataaars/svg?seed=DragonReader', 250, 'Chuyên đọc truyện hành động và fantasy', 8, 2100);
  insUser.run('admin', 'admin@manga.vn', hash, 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', 9999, 'Quản trị viên hệ thống', 99, 99999);

  const comicsData = [
    { title: 'Đấu La Đại Lục', slug: 'dau-la-dai-luc', cover: 'https://picsum.photos/seed/manga1/300/420', description: 'Tang San rời khỏi thế giới bí ẩn của mình với kiến thức về võ thuật tối thượng. Trong thế giới mới, anh gia nhập học viện Sử Hồn và bắt đầu hành trình trở thành Thần.', author: 'Đường Gia Tam Thiếu', genres: '["Action","Fantasy","Adventure"]', rating: 9.2, views: 1250000, status: 'ongoing', isHot: 1, isNew: 0 },
    { title: 'Ma Đạo Tổ Sư', slug: 'ma-dao-to-su', cover: 'https://picsum.photos/seed/manga2/300/420', description: 'Ngụy Vô Tiện, người từng được mệnh danh là Tà Thần Ma Tổ, bị truy sát và chết. Khi tái sinh, anh phải đối mặt với những bí ẩn từ kiếp trước.', author: 'Mo Xiang Tong Xiu', genres: '["Romance","Fantasy","Drama"]', rating: 9.5, views: 980000, status: 'completed', isHot: 1, isNew: 0 },
    { title: 'Vạn Cổ Chí Tôn', slug: 'van-co-chi-ton', cover: 'https://picsum.photos/seed/manga3/300/420', description: 'Thanh niên tầm thường nhận được hệ thống tu tiên siêu cường, từng bước vươn lên đỉnh cao của thế giới tu luyện.', author: 'Tiêu Tiêu', genres: '["Action","Cultivation","Comedy"]', rating: 8.7, views: 756000, status: 'ongoing', isHot: 0, isNew: 1 },
    { title: 'Toàn Chức Pháp Sư', slug: 'toan-chuc-phap-su', cover: 'https://picsum.photos/seed/manga4/300/420', description: 'Mo Fan sống trong thế giới nơi mọi người đều có thể học ma pháp. Nhưng anh lại thức tỉnh hai hệ ma pháp - điều chưa từng có trong lịch sử.', author: 'Loạn', genres: '["Action","Magic","School"]', rating: 9.0, views: 890000, status: 'ongoing', isHot: 1, isNew: 0 },
    { title: 'Cô Đơn Trong Vũ Trụ', slug: 'co-don-trong-vu-tru', cover: 'https://picsum.photos/seed/manga5/300/420', description: 'Câu chuyện về người cuối cùng trên trái đất và hành trình khám phá vũ trụ bí ẩn, đối mặt với sự cô đơn tuyệt đối.', author: 'Liu Cixin', genres: '["Sci-Fi","Drama","Mystery"]', rating: 9.3, views: 654000, status: 'completed', isHot: 0, isNew: 0 },
    { title: 'Vô Hạn Tiến Hóa', slug: 'vo-han-tien-hoa', cover: 'https://picsum.photos/seed/manga6/300/420', description: 'Hệ thống tiến hóa kỳ lạ giúp nhân vật chính không ngừng mạnh lên, chinh phục mọi thế giới song song.', author: 'Thánh Tổ', genres: '["Action","Fantasy","System"]', rating: 8.5, views: 543000, status: 'ongoing', isHot: 0, isNew: 1 },
    { title: 'Tu Tiên Giới', slug: 'tu-tien-gioi', cover: 'https://picsum.photos/seed/manga7/300/420', description: 'Thế giới nơi tu tiên là con đường duy nhất để thoát khỏi số phận thường dân. Hành trình từ phàm nhân lên tiên cảnh.', author: 'Nhĩ Căn', genres: '["Cultivation","Fantasy","Action"]', rating: 8.9, views: 789000, status: 'ongoing', isHot: 1, isNew: 0 },
    { title: 'Hoàn Mỹ Thế Giới', slug: 'hoan-my-the-gioi', cover: 'https://picsum.photos/seed/manga8/300/420', description: 'Một đứa trẻ sơ sinh mang ký ức từ kiếp trước, thức tỉnh trong một thế giới huyền bí đầy nguy hiểm và cơ hội.', author: 'Chen Dong', genres: '["Fantasy","Adventure","Cultivation"]', rating: 9.1, views: 934000, status: 'ongoing', isHot: 0, isNew: 0 },
    { title: 'Thần Y Hạ Sơn', slug: 'than-y-ha-son', cover: 'https://picsum.photos/seed/manga9/300/420', description: 'Thần y xuống núi hành tẩu giang hồ, cứu người và tìm kiếm sự thật đằng sau cái chết của sư phụ.', author: 'Vũ Tiên', genres: '["Romance","Medical","Slice of Life"]', rating: 8.3, views: 423000, status: 'ongoing', isHot: 0, isNew: 1 },
    { title: 'Kiếm Lai', slug: 'kiem-lai', cover: 'https://picsum.photos/seed/manga10/300/420', description: 'Chần Bình An, đứa bé nghèo từ xóm bần hàn, bước ra thế giới tu tiên với hành trang chỉ là thanh kiếm gỗ.', author: 'Phong Hỏa Hí Chư Hầu', genres: '["Cultivation","Action","Drama"]', rating: 9.4, views: 1100000, status: 'ongoing', isHot: 1, isNew: 0 },
    { title: 'Lược Thiên Ký', slug: 'luoc-thien-ky', cover: 'https://picsum.photos/seed/manga11/300/420', description: 'Trương Nhược Trần mang ký ức từ kiếp trước để viết lại vận mệnh, xây dựng đế chế từ đầu.', author: 'Mặc Bảo Phi Bảo', genres: '["Fantasy","Reincarnation","Action"]', rating: 8.8, views: 678000, status: 'ongoing', isHot: 0, isNew: 1 },
    { title: 'Hoa Sơn Nghịch Khách', slug: 'hoa-son-nghich-khach', cover: 'https://picsum.photos/seed/manga12/300/420', description: 'Thanh Tuyên, đệ tử kém cỏi của phái Hoa Sơn, quyết tâm phục hưng tông môn và vươn lên đỉnh cao võ lâm.', author: 'Từ Khách', genres: '["Wuxia","Comedy","Action"]', rating: 9.0, views: 856000, status: 'ongoing', isHot: 1, isNew: 0 },
  ];

  const insComic = db.prepare(`
    INSERT INTO comics (title, slug, cover, description, author, genres, rating, views, status, isHot, isNew)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of comicsData) {
    insComic.run(c.title, c.slug, c.cover, c.description, c.author, c.genres, c.rating, c.views, c.status, c.isHot, c.isNew);
  }

  const insChapter = db.prepare(`INSERT INTO chapters (comicId, title, chapterNumber, views) VALUES (?, ?, ?, ?)`);
  for (let comicId = 1; comicId <= comicsData.length; comicId++) {
    const numCh = 10 + (comicId * 7) % 50;
    for (let i = 1; i <= numCh; i++) {
      insChapter.run(comicId, `Chương ${i}: ${['Khởi Đầu', 'Bước Ngoặt', 'Đại Chiến', 'Bí Mật', 'Hành Trình'][i % 5]}`, i, 1000 + Math.floor(Math.random() * 9000));
    }
  }

  const insComment = db.prepare(`INSERT INTO comments (userId, comicId, content, likes) VALUES (?, ?, ?, ?)`);
  const sampleComments = [
    'Truyện này quá hay! Mình đã đọc không ngừng được.',
    'Tác giả vẽ đẹp lắm, cốt truyện cũng rất cuốn hút.',
    'Chờ chap mới mà sốt ruột quá đi thôi!',
    'Nhân vật chính siêu ngầu, yêu nhân vật này luôn!',
    'Plot twist ở chap cuối làm mình há hốc mồm.',
  ];
  for (let comicId = 1; comicId <= 6; comicId++) {
    for (let u = 1; u <= 2; u++) {
      insComment.run(u, comicId, sampleComments[comicId % sampleComments.length], Math.floor(Math.random() * 100));
    }
  }

  const insHistory = db.prepare(`INSERT INTO reading_history (userId, comicId, chapterId, progress) VALUES (?, ?, ?, ?)`);
  insHistory.run(1, 1, 5, 75);
  insHistory.run(1, 2, 10, 100);
  insHistory.run(1, 4, 3, 30);

  console.log('✅ Database seeded!');
}

seed();
module.exports = db;
