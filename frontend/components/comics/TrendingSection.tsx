'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Eye, Crown, Medal, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatViews, cn } from '@/lib/utils';
import type { Comic } from '@/lib/types';

type Period = 'week' | 'month' | 'all';

const RANK_STYLES = [
  { bg: 'bg-gradient-to-br from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/30', icon: Crown, text: 'text-yellow-900' },
  { bg: 'bg-gradient-to-br from-slate-300 to-slate-400', shadow: 'shadow-slate-400/30', icon: Medal, text: 'text-slate-700' },
  { bg: 'bg-gradient-to-br from-orange-400 to-rose-500', shadow: 'shadow-orange-500/30', icon: Award, text: 'text-orange-900' },
];

interface TrendingSectionProps {
  comics: Comic[];
  loading?: boolean;
}

export default function TrendingSection({ comics, loading }: TrendingSectionProps) {
  const [period, setPeriod] = useState<Period>('week');

  const sorted = [...comics].sort((a, b) => {
    if (period === 'week') return b.rating - a.rating;
    if (period === 'month') return b.views - a.views;
    return b.rating * b.views - a.rating * a.views;
  });

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <TrendingUp className="w-[1.1rem] h-[1.1rem] text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Bảng Xếp Hạng</h2>
            <p className="text-xs text-muted-foreground">Top 10 truyện hot nhất</p>
          </div>
        </div>

        {/* Period tabs */}
        <div className="flex items-center gap-0.5 p-1 bg-muted/60 rounded-xl">
          {(['week', 'month', 'all'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                period === p ? 'text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {period === p && (
                <motion.div
                  layoutId="periodBg"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg shadow-md shadow-purple-600/20"
                />
              )}
              <span className="relative z-10">
                {{ week: 'Tuần', month: 'Tháng', all: 'All-time' }[p]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-1.5">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted/60 flex-none" />
                <div className="w-10 h-14 rounded-xl bg-muted/60 flex-none" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-muted/60 rounded w-3/4" />
                  <div className="h-2.5 bg-muted/60 rounded w-1/2" />
                </div>
              </div>
            ))
          : sorted.slice(0, 10).map((comic, i) => {
              const rs = i < 3 ? RANK_STYLES[i] : null;
              const RankIcon = rs?.icon;

              return (
                <motion.div
                  key={comic.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={`/comic/${comic.slug}`}>
                    <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/5 border border-transparent hover:border-purple-500/20 transition-all duration-200">
                      {/* Rank badge */}
                      <div className={cn(
                        'flex-none flex items-center justify-center w-8 h-8 rounded-full text-xs font-black shadow-md',
                        rs ? `${rs.bg} ${rs.shadow} ${rs.text}` : 'bg-muted text-muted-foreground'
                      )}>
                        {rs && RankIcon ? <RankIcon className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                      </div>

                      {/* Cover */}
                      <div className="relative w-10 h-14 rounded-xl overflow-hidden flex-none shadow-md group-hover:shadow-lg transition-shadow">
                        <Image
                          src={comic.cover}
                          alt={comic.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate group-hover:text-purple-400 transition-colors">{comic.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{comic.author}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5 text-yellow-500">
                            <Star className="w-3 h-3 fill-current" />
                            <strong className="text-yellow-400">{comic.rating}</strong>
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-3 h-3" />
                            {formatViews(comic.views)}
                          </span>
                        </div>
                      </div>

                      {/* Status pill */}
                      <div className="hidden sm:block flex-none">
                        <span className={cn(
                          'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                          comic.status === 'completed'
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-emerald-500/15 text-emerald-400'
                        )}>
                          {comic.status === 'completed' ? '✓ Hoàn thành' : '● Đang cập nhật'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
        }
      </div>
    </section>
  );
}
