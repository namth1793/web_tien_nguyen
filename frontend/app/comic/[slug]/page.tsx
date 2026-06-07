'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Eye, BookOpen, Bookmark, Heart, Share2,
  ChevronRight, Play, Clock, MessageCircle, Send, ThumbsUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import StarRating from '@/components/comics/StarRating';
import { api } from '@/lib/api';
import { MOCK_COMICS, MOCK_CHAPTERS } from '@/lib/data';
import { formatViews, formatDate, genreColor, statusLabel, cn } from '@/lib/utils';
import type { ComicDetail, Comic } from '@/lib/types';

/* ─── helpers ─── */
function getFavs(): Comic[] {
  try { return JSON.parse(localStorage.getItem('nepchu_favorites') || '[]'); } catch { return []; }
}
function setFavs(favs: Comic[]) {
  localStorage.setItem('nepchu_favorites', JSON.stringify(favs));
}
function getRatings(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem('nepchu_ratings') || '{}'); } catch { return {}; }
}

export default function ComicDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [comic, setComic] = useState<ComicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [comment, setComment] = useState('');
  const [isFav, setIsFav] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getComic(slug);
        setComic(data);
      } catch {
        const mock = MOCK_COMICS.find(c => c.slug === slug) || MOCK_COMICS[0];
        setComic({ ...mock, chapters: MOCK_CHAPTERS, comments: [] });
      } finally { setLoading(false); }
    }
    load();
    // Load localStorage state
    const favs = getFavs();
    setIsFav(favs.some(f => f.slug === slug));
    const ratings = getRatings();
    if (ratings[slug]) setUserRating(ratings[slug]);
  }, [slug]);

  const toggleFav = () => {
    if (!comic) return;
    const favs = getFavs();
    const exists = favs.some(f => f.slug === slug);
    const next = exists ? favs.filter(f => f.slug !== slug) : [...favs, comic as Comic];
    setFavs(next);
    setIsFav(!exists);
  };

  const submitRating = (stars: number) => {
    setUserRating(stars);
    const ratings = getRatings();
    ratings[slug] = stars;
    localStorage.setItem('nepchu_ratings', JSON.stringify(ratings));
    setRatingSubmitted(true);
    setTimeout(() => setRatingSubmitted(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-64 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!comic) return <div className="p-8 text-center text-muted-foreground">Không tìm thấy truyện</div>;

  const status = statusLabel(comic.status);
  const chapters = showAllChapters ? comic.chapters : comic.chapters.slice(-20).reverse();

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="relative h-64 overflow-hidden">
        <Image src={comic.cover} alt={comic.title} fill className="object-cover blur-md opacity-20 scale-110" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative -mt-40 px-4 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          {/* Cover */}
          <div className="relative w-40 h-56 sm:w-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-purple-600/20 ring-2 ring-border flex-none mx-auto sm:mx-0">
            <Image src={comic.cover} alt={comic.title} fill className="object-cover" unoptimized />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={cn('text-xs font-medium px-2 py-1 rounded-full', status.color)}>{status.label}</span>
              {comic.isHot === 1 && <Badge variant="hot">🔥 HOT</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{comic.title}</h1>
            <p className="text-muted-foreground mb-3">bởi <span className="text-foreground font-medium">{comic.author}</span></p>

            <div className="flex flex-wrap gap-2 mb-3">
              {comic.genres.map(g => (
                <span key={g} className={cn('text-xs font-medium px-2.5 py-1 rounded-full', genreColor(g))}>{g}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <strong className="text-foreground">{comic.rating}</strong>/10
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {formatViews(comic.views)} lượt đọc
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {comic.chapters.length} chương
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {comic.chapters.length > 0 && (
                <Link href={`/reader/${comic.slug}/${comic.chapters[0].id}`}>
                  <Button variant="gradient">
                    <Play className="w-4 h-4 fill-current" />
                    Đọc từ đầu
                  </Button>
                </Link>
              )}
              {comic.chapters.length > 0 && (
                <Link href={`/reader/${comic.slug}/${comic.chapters[comic.chapters.length - 1].id}`}>
                  <Button variant="outline">
                    <Clock className="w-4 h-4" />
                    Chương mới nhất
                  </Button>
                </Link>
              )}

              {/* Bookmark */}
              <motion.div whileTap={{ scale: 0.88 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFav}
                  className={cn(
                    'transition-all duration-200',
                    isFav && 'border-purple-500/60 bg-purple-500/10 text-purple-500',
                  )}
                  title={isFav ? 'Bỏ lưu' : 'Lưu truyện'}
                >
                  <Bookmark className={cn('w-4 h-4 transition-all', isFav && 'fill-current')} />
                </Button>
              </motion.div>

              {/* Share */}
              <div className="relative">
                <Button variant="outline" size="icon" onClick={handleShare} title="Sao chép link">
                  <Share2 className="w-4 h-4" />
                </Button>
                <AnimatePresence>
                  {shareToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.9 }}
                      className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none"
                    >
                      ✓ Đã sao chép link
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Fav toast */}
            <AnimatePresence>
              {isFav && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-xs text-purple-400 flex items-center gap-1"
                >
                  <Bookmark className="w-3 h-3 fill-current" /> Đã lưu vào Yêu thích
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <h2 className="font-bold mb-2">Giới thiệu</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{comic.description}</p>
        </div>

        {/* ─── ĐÁNH GIÁ SAO ─── */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <h2 className="font-bold mb-1 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            Đánh giá của bạn
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Điểm cộng đồng: <span className="font-semibold text-foreground">{comic.rating}/10</span>
            {' · '}Chọn số sao để đánh giá truyện này
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <StarRating value={userRating} onChange={submitRating} size="lg" showLabel />

            <AnimatePresence>
              {ratingSubmitted && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-emerald-500 font-semibold flex items-center gap-1"
                >
                  ✓ Đã ghi nhận đánh giá!
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {userRating > 0 && !ratingSubmitted && (
            <p className="text-xs text-muted-foreground mt-2">
              Bạn đã đánh giá <span className="font-semibold text-yellow-500">{userRating * 2}/10</span>. Nhấn sao khác để thay đổi.
            </p>
          )}

          {/* Rating distribution (decorative) */}
          <div className="mt-5 space-y-1.5">
            {[5, 4, 3, 2, 1].map(star => {
              const pct = [62, 22, 9, 5, 2][5 - star];
              return (
                <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-3 text-right">{star}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current flex-none" />
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: (5 - star) * 0.07, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
                    />
                  </div>
                  <span className="w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chapters */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-500" />
              Danh sách chương ({comic.chapters.length})
            </h2>
            <button onClick={() => setShowAllChapters(!showAllChapters)} className="text-sm text-purple-500 hover:underline">
              {showAllChapters ? 'Rút gọn' : 'Xem tất cả'}
            </button>
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
            {chapters.map(ch => (
              <Link key={ch.id} href={`/reader/${comic.slug}/${ch.id}`}>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group">
                  <span className="text-sm font-medium group-hover:text-purple-500 transition-colors">
                    {ch.title || `Chương ${ch.chapterNumber}`}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatViews(ch.views)} lượt đọc</span>
                    <span>{formatDate(ch.createdAt)}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4 text-purple-500" />
            Bình luận ({comic.comments.length})
          </h2>

          <div className="flex gap-3 mb-4">
            <Avatar className="w-8 h-8 flex-none">
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="w-full h-16 bg-muted/50 rounded-xl p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-purple-500/30"
              />
              <div className="flex justify-end mt-1.5">
                <Button size="sm" variant="gradient" disabled={!comment.trim()}>
                  <Send className="w-3.5 h-3.5" /> Gửi
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {comic.comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Chưa có bình luận. Hãy là người đầu tiên!</p>
              </div>
            ) : (
              comic.comments.map(c => (
                <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <Avatar className="w-8 h-8 flex-none">
                    <AvatarImage src={c.avatar} />
                    <AvatarFallback>{c.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{c.username}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.content}</p>
                    <button className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground hover:text-rose-500 transition-colors">
                      <ThumbsUp className="w-3 h-3" /> {c.likes}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
