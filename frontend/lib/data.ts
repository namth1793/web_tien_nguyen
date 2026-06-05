import type { Comic, Chapter } from './types';

export const MOCK_COMICS: Comic[] = [
  { id: 1, title: 'Đấu La Đại Lục', slug: 'dau-la-dai-luc', cover: 'https://picsum.photos/seed/manga1/300/420', description: 'Tang San rời khỏi thế giới bí ẩn của mình với kiến thức về võ thuật tối thượng.', author: 'Đường Gia Tam Thiếu', genres: ['Action', 'Fantasy', 'Adventure'], rating: 9.2, views: 1250000, status: 'ongoing', isHot: 1, isNew: 0, createdAt: '2024-01-15', updatedAt: '2024-06-01' },
  { id: 2, title: 'Ma Đạo Tổ Sư', slug: 'ma-dao-to-su', cover: 'https://picsum.photos/seed/manga2/300/420', description: 'Ngụy Vô Tiện, người từng được mệnh danh là Tà Thần Ma Tổ.', author: 'Mo Xiang Tong Xiu', genres: ['Romance', 'Fantasy', 'Drama'], rating: 9.5, views: 980000, status: 'completed', isHot: 1, isNew: 0, createdAt: '2023-06-10', updatedAt: '2024-05-20' },
  { id: 3, title: 'Vạn Cổ Chí Tôn', slug: 'van-co-chi-ton', cover: 'https://picsum.photos/seed/manga3/300/420', description: 'Thanh niên tầm thường nhận được hệ thống tu tiên siêu cường.', author: 'Tiêu Tiêu', genres: ['Action', 'Cultivation', 'Comedy'], rating: 8.7, views: 756000, status: 'ongoing', isHot: 0, isNew: 1, createdAt: '2024-05-01', updatedAt: '2024-06-03' },
  { id: 4, title: 'Toàn Chức Pháp Sư', slug: 'toan-chuc-phap-su', cover: 'https://picsum.photos/seed/manga4/300/420', description: 'Mo Fan sống trong thế giới nơi mọi người đều có thể học ma pháp.', author: 'Loạn', genres: ['Action', 'Magic', 'School'], rating: 9.0, views: 890000, status: 'ongoing', isHot: 1, isNew: 0, createdAt: '2023-08-20', updatedAt: '2024-06-02' },
  { id: 5, title: 'Cô Đơn Trong Vũ Trụ', slug: 'co-don-trong-vu-tru', cover: 'https://picsum.photos/seed/manga5/300/420', description: 'Câu chuyện về người cuối cùng trên trái đất.', author: 'Liu Cixin', genres: ['Sci-Fi', 'Drama', 'Mystery'], rating: 9.3, views: 654000, status: 'completed', isHot: 0, isNew: 0, createdAt: '2023-03-15', updatedAt: '2024-03-10' },
  { id: 6, title: 'Vô Hạn Tiến Hóa', slug: 'vo-han-tien-hoa', cover: 'https://picsum.photos/seed/manga6/300/420', description: 'Hệ thống tiến hóa kỳ lạ giúp nhân vật chính không ngừng mạnh lên.', author: 'Thánh Tổ', genres: ['Action', 'Fantasy', 'System'], rating: 8.5, views: 543000, status: 'ongoing', isHot: 0, isNew: 1, createdAt: '2024-04-20', updatedAt: '2024-06-01' },
  { id: 7, title: 'Tu Tiên Giới', slug: 'tu-tien-gioi', cover: 'https://picsum.photos/seed/manga7/300/420', description: 'Thế giới nơi tu tiên là con đường duy nhất.', author: 'Nhĩ Căn', genres: ['Cultivation', 'Fantasy', 'Action'], rating: 8.9, views: 789000, status: 'ongoing', isHot: 1, isNew: 0, createdAt: '2023-09-01', updatedAt: '2024-06-02' },
  { id: 8, title: 'Hoàn Mỹ Thế Giới', slug: 'hoan-my-the-gioi', cover: 'https://picsum.photos/seed/manga8/300/420', description: 'Một đứa trẻ sơ sinh mang ký ức từ kiếp trước.', author: 'Chen Dong', genres: ['Fantasy', 'Adventure', 'Cultivation'], rating: 9.1, views: 934000, status: 'ongoing', isHot: 0, isNew: 0, createdAt: '2023-07-15', updatedAt: '2024-06-01' },
  { id: 9, title: 'Thần Y Hạ Sơn', slug: 'than-y-ha-son', cover: 'https://picsum.photos/seed/manga9/300/420', description: 'Thần y xuống núi hành tẩu giang hồ.', author: 'Vũ Tiên', genres: ['Romance', 'Medical', 'Slice of Life'], rating: 8.3, views: 423000, status: 'ongoing', isHot: 0, isNew: 1, createdAt: '2024-05-10', updatedAt: '2024-06-03' },
  { id: 10, title: 'Kiếm Lai', slug: 'kiem-lai', cover: 'https://picsum.photos/seed/manga10/300/420', description: 'Chần Bình An, đứa bé nghèo từ xóm bần hàn.', author: 'Phong Hỏa Hí Chư Hầu', genres: ['Cultivation', 'Action', 'Drama'], rating: 9.4, views: 1100000, status: 'ongoing', isHot: 1, isNew: 0, createdAt: '2023-04-01', updatedAt: '2024-06-02' },
  { id: 11, title: 'Lược Thiên Ký', slug: 'luoc-thien-ky', cover: 'https://picsum.photos/seed/manga11/300/420', description: 'Trương Nhược Trần mang ký ức từ kiếp trước.', author: 'Mặc Bảo Phi Bảo', genres: ['Fantasy', 'Reincarnation', 'Action'], rating: 8.8, views: 678000, status: 'ongoing', isHot: 0, isNew: 1, createdAt: '2024-04-01', updatedAt: '2024-06-03' },
  { id: 12, title: 'Hoa Sơn Nghịch Khách', slug: 'hoa-son-nghich-khach', cover: 'https://picsum.photos/seed/manga12/300/420', description: 'Thanh Tuyên, đệ tử kém cỏi của phái Hoa Sơn.', author: 'Từ Khách', genres: ['Wuxia', 'Comedy', 'Action'], rating: 9.0, views: 856000, status: 'ongoing', isHot: 1, isNew: 0, createdAt: '2023-11-01', updatedAt: '2024-06-01' },
];

export const MOCK_CHAPTERS: Chapter[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  comicId: 1,
  title: `Chương ${i + 1}: ${['Khởi Đầu', 'Bước Ngoặt', 'Đại Chiến', 'Bí Mật', 'Hành Trình', 'Giác Ngộ', 'Trở Về', 'Quyết Định'][i % 8]}`,
  chapterNumber: i + 1,
  views: 1000 + i * 234,
  createdAt: new Date(Date.now() - (60 - i) * 86400000 * 3).toISOString(),
}));

export const ALL_GENRES = ['Action', 'Fantasy', 'Romance', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Cultivation', 'Wuxia', 'Mystery', 'Adventure', 'Medical', 'System', 'Reincarnation', 'School'];

export const RECENT_SEARCHES = ['Đấu La Đại Lục', 'Kiếm Lai', 'Ma Đạo Tổ Sư', 'Tu tiên'];
