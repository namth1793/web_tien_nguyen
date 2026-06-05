'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Library, Search, SlidersHorizontal, LayoutGrid, LayoutList, Filter, X } from 'lucide-react';
import { Suspense } from 'react';
import ComicCard from '@/components/comics/ComicCard';
import { ComicCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { MOCK_COMICS, ALL_GENRES } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { Comic } from '@/lib/types';

type Sort = 'views' | 'rating' | 'new' | 'updated';
type Status = '' | 'ongoing' | 'completed' | 'hiatus';

function LibraryContent() {
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
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-600/10 rounded-xl">
          <Library className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Thư Viện</h1>
          <p className="text-sm text-muted-foreground">{total.toLocaleString()} truyện</p>
        </div>
      </div>

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
          <div className="flex gap-2">
            {['views', 'rating', 'new', 'updated'].map(s => (
              <button
                key={s}
                onClick={() => { setSort(s as Sort); setPage(1); }}
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
          <div className="flex gap-2">
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

      {/* Comics grid */}
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
