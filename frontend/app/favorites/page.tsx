'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, SortAsc, BookOpen, Star, Eye, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getFavs, setFavs } from '@/components/comics/ComicCard';
import { formatViews, genreColor, statusLabel, cn } from '@/lib/utils';
import type { Comic } from '@/lib/types';

type SortKey = 'added' | 'title' | 'rating' | 'views';

export default function FavoritesPage() {
  const [favs, setFavsState] = useState<Comic[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('added');

  useEffect(() => {
    setFavsState(getFavs());
    const onUpdate = () => setFavsState(getFavs());
    window.addEventListener('nepchu-favorites-update', onUpdate);
    return () => window.removeEventListener('nepchu-favorites-update', onUpdate);
  }, []);

  const remove = (slug: string) => {
    const next = getFavs().filter(f => f.slug !== slug);
    setFavs(next);
    setFavsState(next);
  };

  const removeAll = () => {
    setFavs([]);
    setFavsState([]);
  };

  const filtered = favs
    .filter(f => !search || f.title.toLowerCase().includes(search.toLowerCase()) || f.author.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'title')  return a.title.localeCompare(b.title);
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'views')  return b.views - a.views;
      return 0; // 'added' = giữ nguyên thứ tự lưu
    });

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Truyện yêu thích</h1>
            <p className="text-sm text-muted-foreground">
              {favs.length > 0 ? `${favs.length} truyện đã lưu` : 'Chưa có truyện nào được lưu'}
            </p>
          </div>
        </div>
      </div>

      {favs.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-5">
            <Heart className="w-10 h-10 text-rose-400/40" />
          </div>
          <h2 className="text-lg font-bold mb-2">Chưa có truyện yêu thích</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Nhấn nút ❤️ trên bất kỳ truyện nào để lưu vào đây
          </p>
          <Link href="/">
            <Button variant="gradient">Khám phá truyện ngay</Button>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm trong danh sách yêu thích..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 rounded-xl text-sm h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground"
              >
                <option value="added">Mới lưu nhất</option>
                <option value="title">Tên A-Z</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="views">Nhiều lượt đọc nhất</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={removeAll}
              className="text-rose-500 border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500/60"
            >
              <Trash2 className="w-3.5 h-3.5" /> Xóa tất cả
            </Button>
          </div>

          {/* Grid */}
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.p key="no-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-12 text-sm">
                Không tìm thấy truyện nào khớp với &quot;{search}&quot;
              </motion.p>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((comic, i) => {
                  const st = statusLabel(comic.status);
                  return (
                    <motion.div
                      key={comic.slug}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ delay: i * 0.04 }}
                      className="group bg-card border border-border hover:border-rose-500/30 rounded-2xl overflow-hidden transition-all"
                    >
                      {/* Cover */}
                      <Link href={`/comic/${comic.slug}`}>
                        <div className="relative h-44 overflow-hidden">
                          <Image src={comic.cover} alt={comic.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          {/* Status */}
                          <span className={cn('absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full', st.color)}>
                            {st.label}
                          </span>
                          {/* Rating */}
                          <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-md text-yellow-400 text-[11px] font-bold px-2 py-1 rounded-full">
                            <Star className="w-2.5 h-2.5 fill-current" />{comic.rating}
                          </span>
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="p-3 space-y-2">
                        <Link href={`/comic/${comic.slug}`}>
                          <h3 className="font-bold text-sm leading-tight line-clamp-2 hover:text-rose-500 transition-colors">{comic.title}</h3>
                        </Link>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <BookOpen className="w-3 h-3 flex-none" />
                          <span className="truncate">{comic.author}</span>
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {comic.genres.slice(0, 2).map(g => (
                              <span key={g} className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', genreColor(g))}>{g}</span>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <Eye className="w-3 h-3" />{formatViews(comic.views)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex border-t border-border/60">
                        <Link href={`/comic/${comic.slug}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-purple-500 hover:bg-purple-500/5 transition-all">
                          <BookOpen className="w-3.5 h-3.5" /> Đọc ngay
                        </Link>
                        <div className="w-px bg-border/60" />
                        <button
                          onClick={() => remove(comic.slug)}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current text-rose-500" /> Bỏ lưu
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
