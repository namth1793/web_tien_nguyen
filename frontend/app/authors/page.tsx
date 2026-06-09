'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Feather, BookOpen, Star, Eye, Plus, Edit3, Trash2,
  Trophy, Users, TrendingUp, LogIn, CheckCircle,
  Upload, PenLine, Sparkles, ChevronRight, Clock, BarChart2,
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatViews } from '@/lib/utils';

const ALL_GENRES = ['Tiên Hiệp', 'Kiếm Hiệp', 'Huyền Huyễn', 'Đô Thị', 'Ngôn Tình', 'Khoa Huyễn', 'Dị Giới', 'Hệ Thống', 'Trinh Thám', 'Lịch Sử'];

const AUTHOR_BENEFITS = [
  { icon: BookOpen, title: 'Đăng truyện miễn phí', desc: 'Xuất bản tác phẩm không giới hạn chương' },
  { icon: Users, title: 'Tiếp cận độc giả', desc: 'Hàng trăm nghìn độc giả đang chờ đọc truyện của bạn' },
  { icon: TrendingUp, title: 'Theo dõi thống kê', desc: 'Dashboard lượt đọc, đánh giá, bookmark theo thời gian thực' },
  { icon: Trophy, title: 'Hệ thống phần thưởng', desc: 'Nhận coin khi truyện được yêu thích và ủng hộ' },
];

interface AuthorProfile {
  penName: string;
  bio: string;
  genres: string[];
  registeredAt: string;
}

interface MyWork {
  id: string;
  title: string;
  cover: string;
  genre: string;
  chapters: number;
  views: number;
  rating: number;
  status: 'ongoing' | 'completed' | 'draft';
  updatedAt: string;
}

/* ─── Shared localStorage key with /dashboard ─── */
const STORIES_KEY = 'nepchu_my_stories';

function loadWorks(): MyWork[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    if (!raw) return [];
    const stories = JSON.parse(raw) as Array<{
      id: string; title: string; cover: string; genres: string[];
      status: string; views: number; rating: number;
      chapters: unknown[]; updatedAt: string; createdAt: string;
    }>;
    return stories.map(s => ({
      id: s.id,
      title: s.title,
      cover: s.cover || `https://picsum.photos/seed/${s.id}/200/280`,
      genre: s.genres?.[0] || '—',
      chapters: Array.isArray(s.chapters) ? s.chapters.length : 0,
      views: s.views || 0,
      rating: s.rating || 0,
      status: (['ongoing','completed','draft'].includes(s.status) ? s.status : 'draft') as MyWork['status'],
      updatedAt: s.updatedAt || s.createdAt || '',
    }));
  } catch { return []; }
}

function persistAddWork(w: MyWork): void {
  try {
    const stories = JSON.parse(localStorage.getItem(STORIES_KEY) || '[]') as object[];
    const now = w.updatedAt || new Date().toISOString().split('T')[0];
    stories.unshift({
      id: w.id, title: w.title, slug: w.title.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
      cover: w.cover, description: '', genres: [w.genre],
      status: w.status, views: 0, rating: 0, chapters: [],
      createdAt: now, updatedAt: now,
    });
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
  } catch { /* ignore */ }
}

function persistRemoveWork(id: string): void {
  try {
    const stories = (JSON.parse(localStorage.getItem(STORIES_KEY) || '[]') as Array<{ id: string }>)
      .filter(s => s.id !== id);
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
  } catch { /* ignore */ }
}

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  ongoing:   { label: 'Đang viết',   cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  completed: { label: 'Hoàn thành',  cls: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
  draft:     { label: 'Bản nháp',    cls: 'bg-yellow-500/15 text-yellow-500 border border-yellow-500/30' },
};

/* ─── KHÔNG ĐĂNG NHẬP ─── */
function NotLoggedIn({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-float">
          <Feather className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-black mb-3">Trở thành Tác Giả</h1>
        <p className="text-muted-foreground mb-10 text-base leading-relaxed max-w-md mx-auto">
          Chia sẻ câu chuyện của bạn với hàng trăm nghìn độc giả. Đăng nhập để bắt đầu hành trình sáng tác.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
          {AUTHOR_BENEFITS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="flex items-start gap-4 p-4 bg-card border border-border rounded-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-none">
                <Icon className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogin}
          className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-2xl shadow-purple-600/30 text-base"
        >
          <LogIn className="w-5 h-5" />
          Đăng nhập để bắt đầu
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ─── ĐĂNG KÝ TÁC GIẢ ─── */
function RegisterAuthor({ username, onDone }: { username: string; onDone: (p: AuthorProfile) => void }) {
  const [penName, setPenName] = useState(username);
  const [bio, setBio] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [step, setStep] = useState<'form' | 'success'>('form');

  const toggleGenre = (g: string) =>
    setSelectedGenres(s => s.includes(g) ? s.filter(x => x !== g) : s.length < 3 ? [...s, g] : s);

  const handleSubmit = () => {
    if (!penName.trim() || selectedGenres.length === 0) return;
    const profile: AuthorProfile = {
      penName: penName.trim(),
      bio: bio.trim(),
      genres: selectedGenres,
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem('nepchu_author_profile', JSON.stringify(profile));
    setStep('success');
    setTimeout(() => onDone(profile), 1800);
  };

  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-2xl font-black mb-2">Chào mừng tác giả!</h2>
          <p className="text-muted-foreground">
            Tài khoản tác giả <span className="font-semibold text-foreground">{penName}</span> đã được kích hoạt
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 flex-none">
            <Feather className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Đăng ký Tác Giả</h1>
            <p className="text-sm text-muted-foreground">Thiết lập hồ sơ sáng tác của bạn</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Bút danh <span className="text-red-400">*</span>
            </label>
            <Input
              value={penName}
              onChange={e => setPenName(e.target.value)}
              placeholder="Tên bút danh của bạn..."
              className="h-11 rounded-xl"
            />
            <p className="text-xs text-muted-foreground mt-1.5">Tên này sẽ hiển thị trên tất cả tác phẩm của bạn</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Giới thiệu bản thân</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Chia sẻ đôi điều về bản thân và phong cách viết của bạn..."
              rows={4}
              className="w-full bg-muted/50 border border-border rounded-xl p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-muted-foreground/60 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Thể loại sở trường <span className="text-red-400">*</span>
              <span className="text-muted-foreground font-normal ml-2">(chọn tối đa 3)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ALL_GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    selectedGenres.includes(g)
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                      : 'bg-muted text-muted-foreground border-transparent hover:border-purple-500/40 hover:text-foreground'
                  }`}
                >
                  {selectedGenres.includes(g) && <span className="mr-1">✓</span>}{g}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!penName.trim() || selectedGenres.length === 0}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Xác nhận đăng ký
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── DASHBOARD TÁC GIẢ ─── */
function AuthorDashboard({ profile, user }: {
  profile: AuthorProfile;
  user: { username: string; avatar: string; level: number; coin: number };
}) {
  const [works, setWorks] = useState<MyWork[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState(ALL_GENRES[0]);

  useEffect(() => { setWorks(loadWorks()); }, []);

  const totalViews = works.reduce((s, w) => s + w.views, 0);
  const totalChapters = works.reduce((s, w) => s + w.chapters, 0);
  const avgRating = works.length
    ? (works.reduce((s, w) => s + w.rating, 0) / works.length).toFixed(1)
    : '—';

  const addWork = () => {
    if (!newTitle.trim()) return;
    const now = new Date().toISOString().split('T')[0];
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const w: MyWork = {
      id,
      title: newTitle.trim(),
      cover: `https://picsum.photos/seed/${id}/200/280`,
      genre: newGenre,
      chapters: 0,
      views: 0,
      rating: 0,
      status: 'draft',
      updatedAt: now,
    };
    persistAddWork(w);
    setWorks(prev => [w, ...prev]);
    setNewTitle('');
    setShowAdd(false);
  };

  const removeWork = (id: string) => {
    persistRemoveWork(id);
    setWorks(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-purple-500/20 mb-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-pink-600/8 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
            <div className="relative flex-none">
              <Avatar className="w-20 h-20 ring-4 ring-purple-500/30 ring-offset-2 ring-offset-card shadow-xl">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xl font-black bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  {profile.penName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Feather className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl font-black">{profile.penName}</h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold border border-purple-500/30">
                  ✦ Tác Giả
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{user.username}</p>
              {profile.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.genres.map(g => (
                  <span key={g} className="px-2.5 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: BookOpen, label: 'Tác phẩm',    value: works.length,           color: 'text-purple-400 bg-purple-500/10' },
              { icon: Eye,      label: 'Lượt đọc',    value: formatViews(totalViews), color: 'text-blue-400 bg-blue-500/10'   },
              { icon: PenLine,  label: 'Tổng chương', value: totalChapters,           color: 'text-emerald-400 bg-emerald-500/10' },
              { icon: Star,     label: 'Đánh giá TB', value: avgRating,               color: 'text-yellow-400 bg-yellow-500/10' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-background/50 backdrop-blur-sm rounded-2xl p-4 text-center">
                <div className={`w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center ${color}`}>
                  <Icon className="w-[1.1rem] h-[1.1rem]" />
                </div>
                <p className="text-xl font-black">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Works header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-purple-500" />
            Tác phẩm của tôi
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{works.length} truyện · {totalChapters} chương</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          Đăng truyện mới
        </motion.button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5"
          >
            <div className="bg-card border border-purple-500/20 rounded-2xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-500" /> Thêm tác phẩm mới
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Tên truyện..."
                  className="h-10 rounded-xl flex-1"
                  onKeyDown={e => e.key === 'Enter' && addWork()}
                />
                <select
                  value={newGenre}
                  onChange={e => setNewGenre(e.target.value)}
                  className="h-10 rounded-xl px-3 bg-muted border border-border text-sm outline-none focus:ring-2 focus:ring-purple-500/30"
                >
                  {ALL_GENRES.map(g => <option key={g}>{g}</option>)}
                </select>
                <div className="flex gap-2">
                  <Button onClick={addWork} disabled={!newTitle.trim()} className="rounded-xl h-10">Thêm</Button>
                  <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl h-10">Hủy</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Works grid */}
      {works.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">Bạn chưa có tác phẩm nào</p>
          <p className="text-sm mt-1">Nhấn &quot;Đăng truyện mới&quot; để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {works.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                layout
                className="group bg-card border border-border hover:border-purple-500/40 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="flex gap-3 p-4">
                  <div className="relative w-16 rounded-xl overflow-hidden flex-none shadow-md" style={{ height: '88px' }}>
                    <Image src={w.cover} alt={w.title} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-purple-500 transition-colors">
                        {w.title}
                      </h3>
                      <button
                        onClick={() => removeWork(w.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-muted-foreground flex-none ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${STATUS_STYLE[w.status].cls}`}>
                      {STATUS_STYLE[w.status].label}
                    </span>

                    <div className="space-y-0.5 text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1"><PenLine className="w-3 h-3" /> {w.chapters} chương</div>
                      <div className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatViews(w.views)} lượt đọc</div>
                      {w.rating > 0 && (
                        <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> {w.rating}/10</div>
                      )}
                      <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {w.updatedAt}</div>
                    </div>
                  </div>
                </div>

                <div className="flex border-t border-border/60">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-purple-500 hover:bg-purple-500/5 transition-all">
                    <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
                  </button>
                  <div className="w-px bg-border/60" />
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-blue-500 hover:bg-blue-500/5 transition-all">
                    <ChevronRight className="w-3.5 h-3.5" /> Xem chi tiết
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ─── PAGE CHÍNH ─── */
export default function AuthorsPage() {
  const { user } = useAuth();
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [AuthModal, setAuthModal] = useState<React.ComponentType<{ open: boolean; onClose: () => void }> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('nepchu_author_profile');
    if (stored) {
      try { setAuthorProfile(JSON.parse(stored)); } catch { /* ignore */ }
    }
    import('@/components/auth/AuthModal').then(m => setAuthModal(() => m.default));
  }, []);

  if (!user) {
    return (
      <>
        <NotLoggedIn onLogin={() => setShowAuth(true)} />
        {AuthModal && <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />}
      </>
    );
  }

  if (!authorProfile) {
    return <RegisterAuthor username={user.username} onDone={p => setAuthorProfile(p)} />;
  }

  return (
    <AuthorDashboard
      profile={authorProfile}
      user={{ username: user.username, avatar: user.avatar, level: user.level, coin: user.coin }}
    />
  );
}
