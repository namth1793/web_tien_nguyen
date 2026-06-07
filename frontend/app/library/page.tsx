'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Library, Search, SlidersHorizontal, LayoutGrid, LayoutList,
  Filter, X, Bookmark, Heart, BookOpen,
} from 'lucide-react';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ComicCard from '@/components/comics/ComicCard';
import StarRating from '@/components/comics/StarRating';
import { ComicCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { MOCK_COMICS, ALL_GENRES } from '@/lib/data';
import { cn, formatViews } from '@/lib/utils';
import type { Comic } from '@/lib/types';

type Sort = 'views' | 'rating' | 'new' | 'updated';
type Status = '' | 'ongoing' | 'completed' | 'hiatus';
type Tab = 'all' | 'favorites';

/* ─── helpers ─── */
function getFavs(): Comic[] {
  try { return JSON.parse(localStorage.getItem('nepchu_favorites') || '[]'); } catch { return []; }
}
function getRatings(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem('nepchu_ratings') || '{}'); } catch { return {}; }
}

/* ─── TAB YÊU THÍCH ─── */
function FavoritesTab() {
  const [favs, setFavs] = useState<Comic[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    setFavs(getFavs());
    setRatings(getRatings());
  }, []);

  const removeFav = (slug: string) => {
    const next = favs.filter(f => f.slug !== slug);
    setFavs(next);
    localStorage.setItem('nepchu_favorites', JSON.stringify(next));
  };

  if (favs.length === 0) {
    return (
      <div className="text-center py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center">
            <Bookmark className="w-9 h-9 text-purple-400 opacity-50" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Chưa có truyện yêu thích</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Nhấn vào biểu tượng <Bookmark className="w-3.5 h-3.5 inline" /> trên trang chi tiết truyện để lưu vào đây
            </p>
          </div>
          <Link href="/library">
            <Button variant="outline" className="mt-2">Khám phá truyện</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5">{favs.length} truyện đã lưu</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {favs.map((comic, i) => (
            <motion.div
              key={comic.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              layout
              className="group bg-card border border-border hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="flex gap-3 p-4">
                {/* Cover */}
                <Link href={`/comic/${comic.slug}`} className="relative w-16 rounded-xl overflow-hidden flex-none shadow-md" style={{ height: '88px' }}>
                  <Image src={comic.cover} alt={comic.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <Link href={`/comic/${comic.slug}`}>
                      <h3 className="font-bold text-sm leading-tight line-clamp-2 hover:text-purple-500 transition-colors">
                        {comic.title}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeFav(comic.slug)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-muted-foreground flex-none ml-1"
                      title="Bỏ lưu"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-muted-foreground mb-1.5 truncate">{comic.author}</p>

                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                    <span className="flex items-center gap-0.5">
                      <BookOpen className="w-3 h-3" /> {formatViews(comic.views)}
                    </span>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                      comic.status === 'completed'
                        ? 'bg-blue-500/15 text-blue-400'
                        : 'bg-emerald-500/15 text-emerald-400'
                    )}>
                      {comic.status === 'completed' ? 'Hoàn thành' : 'Đang viết'}
                    </span>
                  </div>

                  {/* User's rating */}
                  {ratings[comic.slug] ? (
                    <StarRating value={ratings[comic.slug]} readonly size="sm" showLabel />
                  ) : (
                    <p className="text-[10px] text-muted-foreground/60">Chưa đánh giá</p>
                  )}
                </div>
              </div>

              <div className="px-4 pb-3">
                <Link href={`/comic/${comic.slug}`} className="w-full">
                  <button className="w-full py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 text-xs font-semibold transition-colors">
                    Đọc ngay →
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── TAB TẤT CẢ ─── */
function AllComicsTab() {
  const params = useSearchParams();
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');
  const [sort, setSort] = useState<Sort>('views');
  const [status, setStatus] = useState<Status>('');
  const [genre, setGenre] = useState(params.get('genre') || '');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p: Record<string, string> = { sort, page: String(page), limit: '24' };
      if (search) p.search = search;
      if (status) p.status = status;
      if (genre) p.genre = genre;
      const { comics: data, total: t } = await api.getComics(p);
      setComics(data);
      setTotal(t);
    } catch {
      setComics(MOCK_COMICS);
      setTotal(MOCK_COMICS.length);
    } finally { setLoading(false); }
  }, [search, sort, status, genre, page]);

  useEffect(() => { load(); }, [load]);

  const clearFilters = () => { setSearch(''); setStatus(''); setGenre(''); setSort('views'); setPage(1); };
  const hasFilters = search || status || genre || sort !== 'views';

  return (
    <>
      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Tìm kiếm truyện..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['views', 'rating', 'new', 'updated'] as Sort[]).map(s => (
              <button
                key={s}
                onClick={() => { setSort(s); setPage(1); }}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap',
                  sort === s ? 'bg-purple-600 text-white' : 'bg-muted hover:bg-muted/80'
                )}
              >
                {{ views: 'Lượt đọc', rating: 'Đánh giá', new: 'Mới nhất', updated: 'Cập nhật' }[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Thể loại:
          </span>
          <button
            onClick={() => { setGenre(''); setPage(1); }}
            className={cn('px-3 py-1 rounded-full text-xs font-medium transition-all', !genre ? 'bg-purple-600 text-white' : 'bg-muted hover:bg-muted/80')}
          >Tất cả</button>
          {ALL_GENRES.slice(0, 10).map(g => (
            <button
              key={g}
              onClick={() => { setGenre(g === genre ? '' : g); setPage(1); }}
              className={cn('px-3 py-1 rounded-full text-xs font-medium transition-all', genre === g ? 'bg-purple-600 text-white' : 'bg-muted hover:bg-muted/80')}
            >{g}</button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(['', 'ongoing', 'completed', 'hiatus'] as Status[]).map(s => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all',
                  status === s ? 'bg-purple-600 text-white' : 'bg-muted hover:bg-muted/80'
                )}
              >
                {{ '': 'Tất cả', ongoing: 'Đang tiến hành', completed: 'Hoàn thành', hiatus: 'Tạm dừng' }[s]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors">
                <X className="w-3.5 h-3.5" /> Xóa bộ lọc
              </button>
            )}
            <div className="flex gap-1 border border-border rounded-xl p-1">
              <button onClick={() => setView('grid')} className={cn('p-1.5 rounded-lg transition-colors', view === 'grid' ? 'bg-purple-600 text-white' : 'hover:bg-muted')}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={cn('p-1.5 rounded-lg transition-colors', view === 'list' ? 'bg-purple-600 text-white' : 'hover:bg-muted')}>
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => <ComicCardSkeleton key={i} />)}
        </div>
      ) : comics.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy truyện</h3>
          <p className="text-muted-foreground text-sm mb-4">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
          <Button onClick={clearFilters} variant="outline">Xóa bộ lọc</Button>
        </div>
      ) : (
        <div className={cn(
          view === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
            : 'space-y-2'
        )}>
          {comics.map((comic, i) => (
            <motion.div key={comic.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
              <ComicCard comic={comic} size={view === 'list' ? 'sm' : 'md'} className={view === 'list' ? 'flex-row w-full' : ''} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 24 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Trước</Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">Trang {page} / {Math.ceil(total / 24)}</span>
          <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 24)}>Tiếp →</Button>
        </div>
      )}
    </>
  );
}

/* ─── PAGE CHÍNH ─── */
function LibraryContent() {
  const [tab, setTab] = useState<Tab>('all');
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    setFavCount(getFavs().length);
    const onStorage = () => setFavCount(getFavs().length);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600/10 rounded-xl">
          <Library className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Thư Viện</h1>
          <p className="text-sm text-muted-foreground">Khám phá và lưu truyện yêu thích</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted/50 rounded-2xl p-1 w-fit">
        {([
          { key: 'all',       label: 'Tất cả truyện', icon: SlidersHorizontal },
          { key: 'favorites', label: 'Yêu thích',      icon: Bookmark          },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
              tab === key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
            {key === 'favorites' && favCount > 0 && (
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                tab === 'favorites' ? 'bg-purple-600 text-white' : 'bg-muted-foreground/20 text-muted-foreground'
              )}>
                {favCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'all' ? (
          <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <AllComicsTab />
          </motion.div>
        ) : (
          <motion.div key="fav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <FavoritesTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Đang tải...</div>}>
      <LibraryContent />
    </Suspense>
  );
}
