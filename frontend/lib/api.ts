const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5030';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nepchu_token') : null;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: import('./types').User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (username: string, email: string, password: string) =>
    request<{ token: string; user: import('./types').User }>('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, email, password }) }),
  me: () => request<import('./types').User>('/api/auth/me'),
  updateProfile: (data: { bio?: string; avatar?: string }) =>
    request<import('./types').User>('/api/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Comics
  getComics: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ comics: import('./types').Comic[]; total: number }>(`/api/comics${q}`);
  },
  getHotComics: () => request<import('./types').Comic[]>('/api/comics/hot'),
  getNewComics: () => request<import('./types').Comic[]>('/api/comics/new'),
  getTrending: () => request<import('./types').Comic[]>('/api/comics/trending'),
  getRecommended: () => request<import('./types').Comic[]>('/api/comics/recommended'),
  getComic: (slug: string) => request<import('./types').ComicDetail>(`/api/comics/${slug}`),
  bookmarkComic: (id: number) => request<{ bookmarked: boolean }>(`/api/comics/${id}/bookmark`, { method: 'POST' }),
  favoriteComic: (id: number) => request<{ favorited: boolean }>(`/api/comics/${id}/favorite`, { method: 'POST' }),
  commentComic: (id: number, content: string, chapterId?: number) =>
    request<import('./types').Comment>(`/api/comics/${id}/comment`, { method: 'POST', body: JSON.stringify({ content, chapterId }) }),
  rateComic: (id: number, score: number) => request<{ rating: number }>(`/api/comics/${id}/rate`, { method: 'POST', body: JSON.stringify({ score }) }),

  // Chapters
  getChapters: (comicId: number) => request<import('./types').Chapter[]>(`/api/chapters/comic/${comicId}`),
  getChapter: (id: number) => request<import('./types').Chapter & { pages: string[]; prev: import('./types').Chapter | null; next: import('./types').Chapter | null }>(`/api/chapters/${id}`),

  // Reading
  updateProgress: (comicId: number, chapterId: number, progress: number) =>
    request('/api/reading/update', { method: 'POST', body: JSON.stringify({ comicId, chapterId, progress }) }),
  getHistory: () => request<import('./types').ReadingHistory[]>('/api/reading/history'),

  // Users
  getUserStats: (id: number) => request<{ totalRead: number; totalBookmarks: number; totalFavorites: number; totalComments: number }>(`/api/users/${id}/stats`),
  getUserBookmarks: (id: number) => request<import('./types').Comic[]>(`/api/users/${id}/bookmarks`),
};
