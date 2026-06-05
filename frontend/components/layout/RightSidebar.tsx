'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Coins, BookOpen, Star, Bookmark, Heart, MessageCircle,
  Clock, StickyNote, Share2, Zap, Trophy, LogIn, TrendingUp,
  ChevronRight, Target
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { api } from '@/lib/api';
import { xpToNextLevel, cn } from '@/lib/utils';
import type { ReadingHistory } from '@/lib/types';

const BENEFITS = [
  { icon: BookOpen, text: 'Đọc không giới hạn', color: 'bg-blue-500/10 text-blue-400' },
  { icon: Bookmark, text: 'Bookmark & theo dõi', color: 'bg-purple-500/10 text-purple-400' },
  { icon: Heart, text: 'Yêu thích truyện', color: 'bg-rose-500/10 text-rose-400' },
  { icon: MessageCircle, text: 'Bình luận & thảo luận', color: 'bg-green-500/10 text-green-400' },
  { icon: Zap, text: 'Nhận thông báo sớm nhất', color: 'bg-yellow-500/10 text-yellow-400' },
];

export default function RightSidebar() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [history, setHistory] = useState<ReadingHistory[]>([]);
  const [stats, setStats] = useState({ totalRead: 0, totalBookmarks: 0, totalFavorites: 0, totalComments: 0 });
  const [note, setNote] = useState('');

  useEffect(() => {
    if (user) {
      api.getHistory().then(setHistory).catch(() => {});
      api.getUserStats(user.id).then(setStats).catch(() => {});
    }
  }, [user]);

  const xpPercent = user ? Math.min((user.xp / xpToNextLevel(user.level)) * 100, 100) : 0;

  if (loading) {
    return (
      <aside className="hidden xl:flex flex-col w-72 h-screen sticky top-0 border-l border-border/60 bg-card/60 glass-card overflow-y-auto p-4 space-y-4">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </aside>
    );
  }

  return (
    <>
      <aside className="hidden xl:flex flex-col w-72 h-screen sticky top-0 border-l border-border/60 bg-card/60 glass-card overflow-y-auto no-scrollbar">
        <div className="p-4 space-y-4">

          {user ? (
            <>
              {/* Profile card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl border border-purple-500/20"
              >
                {/* BG gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-pink-600/10 to-transparent" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

                <div className="relative p-4">
                  {/* Avatar + info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative flex-none">
                      <Avatar className="w-12 h-12 ring-2 ring-purple-500/50 ring-offset-2 ring-offset-card">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-card flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{user.username}</p>
                      {user.bio && <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{user.bio}</p>}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400">
                          <Trophy className="w-2.5 h-2.5" /> Lv.{user.level}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">
                          <Coins className="w-2.5 h-2.5" /> {user.coin}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* XP Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {user.xp} XP</span>
                      <span>Lv.{user.level + 1} — {xpToNextLevel(user.level)} XP</span>
                    </div>
                    <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${xpPercent}%` }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 relative"
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-lg shadow-purple-500/50" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { icon: BookOpen, label: 'Đọc', value: stats.totalRead, color: 'text-blue-400' },
                      { icon: Bookmark, label: 'Lưu', value: stats.totalBookmarks, color: 'text-purple-400' },
                      { icon: Heart, label: 'Thích', value: stats.totalFavorites, color: 'text-rose-400' },
                      { icon: MessageCircle, label: 'CM', value: stats.totalComments, color: 'text-green-400' },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div key={label} className="bg-background/40 backdrop-blur-sm rounded-xl p-2 text-center">
                        <Icon className={cn('w-3.5 h-3.5 mx-auto mb-1', color)} />
                        <p className="text-sm font-bold">{value}</p>
                        <p className="text-[9px] text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Continue reading */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-border/60 bg-card/40 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-500/15 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <span className="text-sm font-semibold">Đọc tiếp</span>
                    </div>
                    <Link href="/library" className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5 transition-colors">
                      Tất cả <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {history.slice(0, 3).map(h => (
                      <Link key={h.id} href={`/comic/${h.slug}`}>
                        <div className="group flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted/60 transition-colors">
                          <div className="relative w-10 h-12 rounded-lg overflow-hidden flex-none shadow-md">
                            <Image src={h.cover} alt={h.title} fill className="object-cover group-hover:scale-110 transition-transform duration-300" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold truncate group-hover:text-purple-400 transition-colors">{h.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {h.chapterNumber ? `Ch.${h.chapterNumber}` : 'Chưa đọc'}
                            </p>
                            {h.progress > 0 && (
                              <div className="mt-1.5 h-0.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${h.progress}%` }} />
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick note */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border/60 bg-card/40 p-4"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-yellow-500/15 flex items-center justify-center">
                      <StickyNote className="w-3.5 h-3.5 text-yellow-500" />
                    </div>
                    <span className="text-sm font-semibold">Ghi chú</span>
                  </div>
                  <button className="w-6 h-6 rounded-lg hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Ghi chú truyện muốn đọc..."
                  className="w-full h-16 text-xs bg-muted/40 border-0 rounded-xl p-2.5 resize-none outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-muted-foreground/60 transition-all"
                />
              </motion.div>
            </>
          ) : (
            <>
              {/* Login CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-2xl border border-purple-500/20 p-5 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-transparent" />
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-pink-500/10 rounded-full blur-xl" />

                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-600/30 animate-float">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-1">Tham gia MangaVN</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">Đăng nhập để theo dõi truyện, lưu bookmark và nhiều tính năng hơn</p>
                  <div className="space-y-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setAuthTab('login'); setShowAuth(true); }}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-shadow flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Đăng nhập ngay
                    </motion.button>
                    <button
                      onClick={() => { setAuthTab('register'); setShowAuth(true); }}
                      className="w-full py-2 px-4 text-sm text-muted-foreground hover:text-foreground border border-border/60 rounded-xl hover:bg-muted/50 transition-all"
                    >
                      Tạo tài khoản miễn phí
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-border/60 bg-card/40 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-yellow-500/15 flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                  </div>
                  <span className="text-sm font-semibold">Quyền lợi thành viên</span>
                </div>
                <div className="space-y-2">
                  {BENEFITS.map(({ icon: Icon, text, color }) => (
                    <div key={text} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted/40 transition-colors">
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-none', color.split(' ')[0])}>
                        <Icon className={cn('w-3.5 h-3.5', color.split(' ')[1])} />
                      </div>
                      <span className="text-xs text-muted-foreground">{text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Trending mini */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-border/60 bg-card/40 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/15 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <span className="text-sm font-semibold">Hot hôm nay</span>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-2.5 p-1.5">
                      <span className={cn(
                        'text-xs font-black w-5 text-center',
                        i === 1 ? 'text-yellow-400' : i === 2 ? 'text-gray-400' : 'text-orange-400'
                      )}>#{i}</span>
                      <Skeleton className="w-8 h-10 rounded-lg flex-none" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-2.5 w-3/4 rounded" />
                        <Skeleton className="h-2 w-1/2 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </aside>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} defaultTab={authTab} />
    </>
  );
}
