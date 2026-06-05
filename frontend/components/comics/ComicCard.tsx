'use client';
import { motion } from 'framer-motion';
import { Star, Eye, BookOpen, Bookmark, Heart, Flame, Sparkles, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatViews, genreColor, cn } from '@/lib/utils';
import type { Comic } from '@/lib/types';

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

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className={cn('group relative flex flex-col cursor-pointer', widths[size], className)}
    >
      <Link href={`/comic/${comic.slug}`} className="block">
        {/* Cover container */}
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-lg shadow-black/20 group-hover:shadow-2xl group-hover:shadow-purple-600/20 transition-shadow duration-300">

          {/* Cover image */}
          <Image
            src={comic.cover}
            alt={comic.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 45vw, 200px"
            unoptimized
          />

          {/* Permanent subtle gradient */}
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

          {/* Bottom info on hover */}
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
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                  className="w-7 h-7 bg-white/15 hover:bg-rose-500/70 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-colors"
                >
                  <Heart className="w-3 h-3 text-white" />
                </button>
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
    </motion.div>
  );
}
