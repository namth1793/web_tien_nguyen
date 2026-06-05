'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, Star, Play, ChevronRight, BookOpen, Users, Zap, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';
import ComicCarousel from '@/components/comics/ComicCarousel';
import NewReleasesSection from '@/components/comics/NewReleasesSection';
import TrendingSection from '@/components/comics/TrendingSection';
import { api } from '@/lib/api';
import { MOCK_COMICS } from '@/lib/data';
import { formatViews } from '@/lib/utils';
import type { Comic } from '@/lib/types';

const GENRE_TILES = [
  { name: 'Action', emoji: '⚔️', gradient: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', hover: 'hover:from-red-500/30 hover:to-orange-500/30' },
  { name: 'Fantasy', emoji: '🔮', gradient: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', hover: 'hover:from-purple-500/30 hover:to-violet-500/30' },
  { name: 'Romance', emoji: '💕', gradient: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', hover: 'hover:from-pink-500/30 hover:to-rose-500/30' },
  { name: 'Cultivation', emoji: '🌟', gradient: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', hover: 'hover:from-yellow-500/30 hover:to-amber-500/30' },
  { name: 'Sci-Fi', emoji: '🚀', gradient: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', hover: 'hover:from-blue-500/30 hover:to-cyan-500/30' },
  { name: 'Wuxia', emoji: '🗡️', gradient: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/30', hover: 'hover:from-indigo-500/30 hover:to-blue-500/30' },
  { name: 'Mystery', emoji: '🔍', gradient: 'from-teal-500/20 to-emerald-500/20', border: 'border-teal-500/30', hover: 'hover:from-teal-500/30 hover:to-emerald-500/30' },
  { name: 'Comedy', emoji: '😄', gradient: 'from-green-500/20 to-lime-500/20', border: 'border-green-500/30', hover: 'hover:from-green-500/30 hover:to-lime-500/30' },
  { name: 'Drama', emoji: '🎭', gradient: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/30', hover: 'hover:from-orange-500/30 hover:to-amber-500/30' },
  { name: 'Horror', emoji: '👻', gradient: 'from-gray-500/20 to-slate-500/20', border: 'border-gray-500/30', hover: 'hover:from-gray-500/30 hover:to-slate-500/30' },
];

const STATS = [
  { icon: BookOpen, label: 'Tổng truyện', value: '10,000+', gradient: 'from-purple-600 to-violet-600', glow: 'shadow-purple-500/20' },
  { icon: Users, label: 'Thành viên', value: '500K+', gradient: 'from-pink-600 to-rose-600', glow: 'shadow-pink-500/20' },
  { icon: Zap, label: 'Chương/ngày', value: '200+', gradient: 'from-orange-600 to-amber-600', glow: 'shadow-orange-500/20' },
  { icon: TrendingUp, label: 'Thể loại', value: '50+', gradient: 'from-blue-600 to-cyan-600', glow: 'shadow-blue-500/20' },
];

export default function HomePage() {
  const [hotComics, setHotComics] = useState<Comic[]>([]);
  const [newComics, setNewComics] = useState<Comic[]>([]);
  const [trending, setTrending] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [featIdx, setFeatIdx] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const [hot, fresh, trend] = await Promise.all([api.getHotComics(), api.getNewComics(), api.getTrending()]);
        setHotComics(hot);
        setNewComics(fresh);
        setTrending(trend);
      } catch {
        setHotComics(MOCK_COMICS.filter(c => c.isHot));
        setNewComics(MOCK_COMICS.filter(c => c.isNew));
        setTrending([...MOCK_COMICS].sort((a, b) => b.views - a.views));
      } finally { setLoading(false); }
    }
    load();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFeatIdx(i => (i + 1) % Math.min((hotComics.length || MOCK_COMICS.length), 5)), 5000);
    return () => clearInterval(t);
  }, [hotComics.length]);

  const pool = hotComics.length > 0 ? hotComics : MOCK_COMICS;
  const featured = pool[featIdx % pool.length];
  const displayNew = newComics.length > 0 ? newComics : MOCK_COMICS.filter(c => c.isNew);
  const displayTrending = trending.length > 0 ? trending : MOCK_COMICS;

  return (
    <div className="min-h-screen">
      {/* ───── HERO ───── */}
      <section className="relative h-[480px] md:h-[540px] overflow-hidden">
        {/* Blurred BG */}
        {featured && (
          <AnimatePresence mode="wait">
            <motion.div
              key={featIdx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image src={featured.cover} alt="" fill className="object-cover scale-110 blur-2xl opacity-20" unoptimized />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Ambient orbs */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 pl-16 lg:pl-8">
            <div className="flex items-center justify-between gap-8">
              {/* Left: text */}
              <div className="flex-1 max-w-lg">
                {featured && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={featIdx}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/20">
                          <Flame className="w-3 h-3" /> ĐANG HOT
                        </span>
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${featured.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                          {featured.status === 'completed' ? '✓ Hoàn thành' : '● Đang tiến hành'}
                        </span>
                      </div>

                      <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3 tracking-tight">
                        {featured.title}
                      </h1>
                      <p className="text-sm text-muted-foreground mb-1">
                        bởi <span className="text-foreground font-semibold">{featured.author}</span>
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                        {featured.description}
                      </p>

                      <div className="flex items-center gap-5 mb-6 text-sm">
                        <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
                          <Star className="w-4 h-4 fill-current" />
                          {featured.rating}/10
                        </span>
                        <span className="text-muted-foreground">{formatViews(featured.views)} lượt đọc</span>
                        <div className="flex gap-1.5">
                          {featured.genres.slice(0, 2).map(g => (
                            <span key={g} className="px-2 py-0.5 bg-muted/80 text-muted-foreground rounded-full text-xs font-medium">{g}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={`/comic/${featured.slug}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-2xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-shadow text-sm"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            Đọc ngay
                          </motion.button>
                        </Link>
                        <Link href={`/comic/${featured.slug}`}>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-5 py-3 border border-border/60 hover:border-purple-500/50 bg-card/50 backdrop-blur-sm text-foreground rounded-2xl font-semibold text-sm transition-all"
                          >
                            Chi tiết
                            <ChevronRight className="w-4 h-4" />
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Right: cover thumbnails */}
              <div className="hidden md:flex items-center gap-3">
                {pool.slice(0, 3).map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex-none cursor-pointer"
                    style={{ marginTop: i === 1 ? -32 : i === 2 ? 16 : 0 }}
                    onClick={() => setFeatIdx(i)}
                  >
                    <div className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${i === featIdx ? 'ring-2 ring-purple-500 scale-105 shadow-purple-500/30' : 'opacity-60 hover:opacity-80 scale-95'}`}
                      style={{ width: i === 1 ? 160 : 124, height: i === 1 ? 224 : 174 }}
                    >
                      <Image src={c.cover} alt={c.title} fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {i === featIdx && (
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-[10px] font-bold line-clamp-1">{c.title}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex gap-2 mt-8">
              {pool.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFeatIdx(i)}
                  className="group relative h-1 rounded-full overflow-hidden bg-white/20 transition-all duration-300"
                  style={{ width: i === featIdx ? 32 : 8 }}
                >
                  {i === featIdx && (
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      key={featIdx}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── MAIN ───── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Search */}
        <div className="flex justify-center mb-10">
          <SearchBar />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
        >
          {STATS.map(({ icon: Icon, label, value, gradient, glow }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className={`relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-4 hover:shadow-xl ${glow} hover:-translate-y-0.5 transition-all duration-300`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10 blur-xl">
                <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full`} />
              </div>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} shadow-lg flex items-center justify-center mb-3`}>
                <Icon className="w-4.5 h-4.5 text-white" style={{ width: '1.1rem', height: '1.1rem' }} />
              </div>
              <p className="text-2xl font-black tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recommended */}
        <ComicCarousel
          title="Được Đề Xuất"
          subtitle="Những bộ manga hot nhất đang trending"
          comics={pool}
          loading={loading && pool.length === 0}
          icon={<Flame className="w-4.5 h-4.5" style={{ width: '1.1rem', height: '1.1rem' }} />}
          gradient="from-orange-500 to-red-500"
        />

        {/* Two columns */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
          <div>
            <NewReleasesSection
              comics={displayNew.length > 0 ? displayNew : MOCK_COMICS}
              loading={loading && displayNew.length === 0}
            />
          </div>
          <div>
            <TrendingSection
              comics={displayTrending}
              loading={loading && displayTrending.length === 0}
            />
          </div>
        </div>

        {/* Genre tiles */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-[1.1rem] h-[1.1rem] text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Khám Phá Thể Loại</h2>
              <p className="text-xs text-muted-foreground">Tìm truyện theo sở thích của bạn</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {GENRE_TILES.map(({ name, emoji, gradient, border, hover }, i) => (
              <Link key={name} href={`/library?genre=${name}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative bg-gradient-to-br ${gradient} ${hover} border ${border} rounded-2xl p-4 text-center transition-all duration-200 cursor-pointer group overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-br from-white/5 to-transparent" />
                  <div className="text-2xl mb-2">{emoji}</div>
                  <p className="text-sm font-semibold">{name}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-10 text-white mb-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 animate-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full blur-xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-300 font-bold text-sm">Mới · Miễn phí</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-2">Đọc không giới hạn</h3>
              <p className="text-white/80 text-sm max-w-md">
                Hơn 10,000 bộ truyện chờ bạn khám phá. Cập nhật liên tục, không quảng cáo.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-none">
              <Link href="/library">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 bg-white text-purple-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-shadow text-sm"
                >
                  Khám phá ngay →
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
