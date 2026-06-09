'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Eye, BookOpen, Bookmark, Heart, Flame, Sparkles, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatViews, genreColor, cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import type { Comic } from '@/lib/types';

/* ─── Favorites helpers ─── */
export function getFavs(): Comic[] {
  try { return JSON.parse(localStorage.getItem('nepchu_favorites') || '[]'); } catch { return []; }
}
export function setFavs(favs: Comic[]) {
  localStorage.setItem('nepchu_favorites', JSON.stringify(favs));
  window.dispatchEvent(new CustomEvent('nepchu-favorites-update'));
}
export function toggleFavorite(comic: Comic): boolean {
  const favs = getFavs();
  const exists = favs.some(f => f.slug === comic.slug);
  setFavs(exists ? favs.filter(f => f.slug !== comic.slug) : [...favs, comic]);
  return !exists;
}

interface ComicCardProps {
  comic: Comic;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  rank?: number;
}

const rankColors = [
  'from-yellow-400 to-amber-500 shadow-yellow-500/40',
  'from-gray-300 to-gray-400 shadow-gray-400/40',
  'from-orange-400 to-rose-500 shadow-orange-500/40',
];

export default function ComicCard({ comic, size = 'md', className, rank }: ComicCardProps) {
  const widths = { sm: 'w-32', md: 'w-44', lg: 'w-52' };
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!user) { setIsFav(false); return; }
    setIsFav(getFavs().some(f => f.slug === comic.slug));
    const onUpdate = () => setIsFav(getFavs().some(f => f.slug === comic.slug));
    window.addEventListener('nepchu-favorites-update', onUpdate);
    return () => window.removeEventListener('nepchu-favorites-update', onUpdate);
  }, [comic.slug, user]);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.dispatchEvent(new CustomEvent('nepchu-open-auth'));
      return;
    }
    const next = toggleFavorite(comic);
    setIsFav(next);
    if (next) { setPulse(true); setTimeout(() => setPulse(false), 600); }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className={cn('group relative flex flex-col cursor-pointer', widths[size], className)}
    >
      <Link href={`/comic/${comic.slug}`} className="block">
        {/* Cover container */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-lg shadow-black/20 group-hover:shadow-2xl group-hover:shadow-purple-600/20 transition-shadow duration-300">

          <Image
            src={comic.cover}
            alt={comic.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 45vw, 200px"
            unoptimized
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
            >
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </motion.div>
          </div>

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {comic.isHot === 1 && (
              <span className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-red-500/30">
                <Flame className="w-2.5 h-2.5" /> HOT
              </span>
            )}
            {comic.isNew === 1 && (
              <span className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5" /> MỚI
              </span>
            )}
          </div>

          {/* Rank badge */}
          {rank !== undefined && (
            <div className={cn(
              'absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg',
              rank < 3 ? `bg-gradient-to-br ${rankColors[rank]}` : 'bg-black/70 backdrop-blur-sm border border-white/20'
            )}>
              {rank + 1}
            </div>
          )}

          {/* Rating */}
          {rank === undefined && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 bg-black/60 backdrop-blur-md text-yellow-400 text-[11px] font-bold px-2 py-1 rounded-full border border-yellow-500/20">
              <Star className="w-2.5 h-2.5 fill-current" />
              {comic.rating}
            </div>
          )}

          {/* Heart button — always visible when favorited, else shows on hover */}
          <AnimatePresence>
            {isFav && (
              <motion.div
                key="fav-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 2px rgba(244,63,94,0.5)', borderRadius: '1rem' }}
              />
            )}
          </AnimatePresence>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/80 text-xs">
                <Eye className="w-3 h-3" />
                {formatViews(comic.views)}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                  className="w-7 h-7 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-colors"
                >
                  <Bookmark className="w-3 h-3 text-white" />
                </button>
                <motion.button
                  onClick={handleFav}
                  animate={pulse ? { scale: [1, 1.5, 0.9, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    'w-7 h-7 backdrop-blur-sm rounded-full flex items-center justify-center border transition-all duration-200',
                    isFav
                      ? 'bg-rose-500/90 border-rose-400/60 shadow-lg shadow-rose-500/40'
                      : 'bg-white/15 hover:bg-rose-500/70 border-white/20'
                  )}
                >
                  <Heart className={cn('w-3 h-3 transition-all', isFav ? 'text-white fill-white' : 'text-white')} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Text info */}
        <div className="mt-3 px-0.5 space-y-1.5">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-200">
            {comic.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="w-3 h-3 flex-none" />
            <span className="truncate">{comic.author}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {comic.genres.slice(0, 2).map(g => (
              <span key={g} className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', genreColor(g))}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* Persistent heart badge khi đã yêu thích */}
      <AnimatePresence>
        {isFav && (
          <motion.button
            key="fav-badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleFav}
            className="absolute top-2 left-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50 z-10 pointer-events-auto"
            title="Bỏ yêu thích"
          >
            <Heart className="w-3 h-3 text-white fill-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
