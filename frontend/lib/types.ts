export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  coin: number;
  bio: string;
  level: number;
  xp: number;
  role: 'admin' | 'author' | 'user';
  status: 'active' | 'banned';
  createdAt: string;
}

export interface Comic {
  id: number;
  title: string;
  slug: string;
  cover: string;
  description: string;
  author: string;
  genres: string[];
  rating: number;
  views: number;
  status: 'ongoing' | 'completed' | 'hiatus';
  isHot: number;
  isNew: number;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: number;
  comicId: number;
  title: string;
  chapterNumber: number;
  views: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  userId: number;
  comicId: number;
  chapterId: number | null;
  content: string;
  likes: number;
  username: string;
  avatar: string;
  createdAt: string;
}

export interface ReadingHistory {
  id: number;
  userId: number;
  comicId: number;
  chapterId: number;
  progress: number;
  title: string;
  cover: string;
  slug: string;
  author: string;
  chapterNumber: number;
  chapterTitle: string;
  updatedAt: string;
}

export interface ComicDetail extends Comic {
  chapters: Chapter[];
  comments: Comment[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export type SortOption = 'views' | 'rating' | 'new' | 'updated';
export type GenreOption = 'Action' | 'Fantasy' | 'Romance' | 'Drama' | 'Comedy' | 'Horror' | 'Sci-Fi' | 'Cultivation' | 'Wuxia' | 'Mystery';
