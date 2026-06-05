'use client';
import { motion } from 'framer-motion';
import { Sparkles, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatViews, formatDate, genreColor, cn } from '@/lib/utils';
import type { Comic } from '@/lib/types';

interface NewReleasesSectionProps {
  comics: Comic[];
  loading?: boolean;
}

export default function NewReleasesSection({ comics, loading }: NewReleasesSectionProps) {
  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-[1.1rem] h-[1.1rem] text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Mới Cập Nhật</h2>
          <p className="text-xs text-muted-foreground">Truyện được cập nhật gần đây</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-3.5 rounded-2xl bg-muted/30 animate-pulse">
                <div className="w-16 h-20 rounded-xl bg-muted/50 flex-none" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3.5 bg-muted/50 rounded w-4/5" />
                  <div className="h-2.5 bg-muted/50 rounded w-2/3" />
                  <div className="h-2.5 bg-muted/50 rounded w-1/2" />
                  <div className="flex gap-1.5 mt-1">
                    <div className="h-4 bg-muted/50 rounded-full w-14" />
                    <div className="h-4 bg-muted/50 rounded-full w-14" />
                  </div>
                </div>
              </div>
            ))
          : comics.map((comic, i) => (
              <motion.div
                key={comic.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
              >
                <Link href={`/comic/${comic.slug}`}>
                  <div className="group flex gap-3 p-3.5 rounded-2xl border border-border/50 hover:border-purple-500/40 hover:bg-purple-500/[0.03] bg-card/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/5">
                    {/* Cover */}
                    <div className="relative w-16 h-22 flex-none shadow-md rounded-xl overflow-hidden" style={{ height: '88px' }}>
                      <Image
                        src={comic.cover}
                        alt={comic.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-400"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2 leading-snug group-hover:text-purple-400 dark:group-hover:text-purple-400 transition-colors">
                        {comic.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{comic.author}</p>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {comic.genres.slice(0, 2).map(g => (
                          <span key={g} className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', genreColor(g))}>
                            {g}
                          </span>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-2.5 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5 text-yellow-500">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          {comic.rating}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDate(comic.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
        }
      </div>
    </section>
  );
}
