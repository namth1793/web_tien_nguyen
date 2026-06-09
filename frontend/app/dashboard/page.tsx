'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, PlusCircle, Edit3, Trash2,
  Eye, Star, ChevronRight, ChevronDown, ChevronUp,
  FileText, Clock, CheckCircle, AlertCircle, X,
  BarChart2, Feather, TrendingUp, Users,
} from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

/* ─── Types ─── */
type StoryStatus = 'ongoing' | 'completed' | 'draft' | 'hiatus';

interface MyChapter {
  id: string; title: string; chapterNumber: number;
  views: number; createdAt: string;
}
interface MyStory {
  id: string; title: string; slug: string; cover: string;
  description: string; genres: string[]; status: StoryStatus;
  views: number; rating: number; chapters: MyChapter[];
  createdAt: string; updatedAt: string;
}

/* ─── localStorage helpers ─── */
const LS_KEY = 'nepchu_my_stories';
function loadStories(): MyStory[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function saveStories(s: MyStory[]) { localStorage.setItem(LS_KEY, JSON.stringify(s)); }

/* ─── Default covers for new stories ─── */
const COVERS = [
  'https://picsum.photos/seed/story1/300/420','https://picsum.photos/seed/story2/300/420',
  'https://picsum.photos/seed/story3/300/420','https://picsum.photos/seed/story4/300/420',
  'https://picsum.photos/seed/story5/300/420','https://picsum.photos/seed/story6/300/420',
];

const STATUS_META: Record<StoryStatus, { label: string; icon: React.ReactNode; cls: string }> = {
  ongoing:   { label:'Đang ra',      icon:<Clock       className="w-3 h-3"/>, cls:'bg-green-500/15 text-green-400 border border-green-500/30' },
  completed: { label:'Hoàn thành',   icon:<CheckCircle className="w-3 h-3"/>, cls:'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
  draft:     { label:'Nháp',         icon:<FileText    className="w-3 h-3"/>, cls:'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  hiatus:    { label:'Tạm dừng',     icon:<AlertCircle className="w-3 h-3"/>, cls:'bg-orange-500/15 text-orange-400 border border-orange-500/30' },
};

function fmtViews(n: number) {
  if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
  if (n >= 1000) return Math.round(n/1000)+'K';
  return String(n);
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

/* ─── Add/Edit Story Modal ─── */
interface StoryFormProps {
  initial?: MyStory;
  onSave: (s: MyStory) => void;
  onClose: () => void;
}
function StoryForm({ initial, onSave, onClose }: StoryFormProps) {
  const [form, setForm] = useState({
    title:       initial?.title       ?? '',
    description: initial?.description ?? '',
    genres:      initial?.genres.join(', ') ?? '',
    status:      initial?.status      ?? 'draft' as StoryStatus,
    cover:       initial?.cover       ?? COVERS[Math.floor(Math.random()*COVERS.length)],
  });

  const handleSave = () => {
    if (!form.title.trim()) return;
    const now = new Date().toISOString().split('T')[0];
    const story: MyStory = initial
      ? { ...initial, ...form, genres: form.genres.split(',').map(g=>g.trim()).filter(Boolean), updatedAt: now }
      : {
          id: uid(), slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),
          ...form, genres: form.genres.split(',').map(g=>g.trim()).filter(Boolean),
          views: 0, rating: 0, chapters: [], createdAt: now, updatedAt: now,
        };
    onSave(story);
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.92, opacity:0 }}
        className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg">{initial ? 'Sửa truyện' : 'Thêm truyện mới'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tên truyện *</label>
          <Input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}
            placeholder="Nhập tên truyện..." className="rounded-xl" />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Mô tả</label>
          <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}
            placeholder="Giới thiệu ngắn về truyện..."
            className="w-full h-20 bg-muted/50 border border-border rounded-xl p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-purple-500/30" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Thể loại</label>
            <Input value={form.genres} onChange={e=>setForm(p=>({...p,genres:e.target.value}))}
              placeholder="Ví dụ: Action, Fantasy" className="rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Trạng thái</label>
            <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value as StoryStatus}))}
              className="w-full h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground">
              <option value="draft">Nháp</option>
              <option value="ongoing">Đang ra</option>
              <option value="hiatus">Tạm dừng</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">URL ảnh bìa</label>
          <Input value={form.cover} onChange={e=>setForm(p=>({...p,cover:e.target.value}))}
            placeholder="https://..." className="rounded-xl text-sm" />
        </div>

        {form.cover && (
          <div className="flex justify-center">
            <div className="w-20 h-28 rounded-xl overflow-hidden border border-border">
              <Image src={form.cover} alt="preview" width={80} height={112} className="object-cover w-full h-full" unoptimized />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="gradient" onClick={handleSave} disabled={!form.title.trim()} className="flex-1">
            {initial ? 'Cập nhật' : 'Tạo truyện'}
          </Button>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Chapter Form Modal ─── */
interface ChapterFormProps {
  storyId: string;
  initial?: MyChapter;
  nextNum: number;
  onSave: (ch: MyChapter) => void;
  onClose: () => void;
}
function ChapterForm({ storyId, initial, nextNum, onSave, onClose }: ChapterFormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    chapterNumber: initial?.chapterNumber ?? nextNum,
  });

  const handleSave = () => {
    const now = new Date().toISOString().split('T')[0];
    const ch: MyChapter = initial
      ? { ...initial, ...form }
      : { id: uid(), ...form, views: 0, createdAt: now };
    onSave(ch);
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={e => e.target===e.currentTarget && onClose()}>
      <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.92, opacity:0 }}
        className="bg-card border border-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg">{initial ? 'Sửa chương' : 'Thêm chương mới'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Số chương</label>
            <Input type="number" value={form.chapterNumber}
              onChange={e=>setForm(p=>({...p,chapterNumber:Number(e.target.value)}))}
              className="rounded-xl" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Tiêu đề chương</label>
            <Input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}
              placeholder="Ví dụ: Khởi đầu mới..." className="rounded-xl text-sm" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="gradient" onClick={handleSave} className="flex-1">
            {initial ? 'Cập nhật' : 'Thêm chương'}
          </Button>
          <Button variant="outline" onClick={onClose}>Hủy</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Story Card ─── */
function StoryCard({
  story, onEdit, onDelete, onManageChapters,
}: {
  story: MyStory;
  onEdit: () => void;
  onDelete: () => void;
  onManageChapters: () => void;
}) {
  const sm = STATUS_META[story.status];
  return (
    <motion.div layout initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all group">
      <div className="relative h-40 overflow-hidden">
        <Image src={story.cover} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span className={cn('absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1', sm.cls)}>
          {sm.icon} {sm.label}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-sm leading-tight line-clamp-2">{story.title}</h3>
          {story.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{story.description}</p>}
        </div>
        <div className="flex flex-wrap gap-1">
          {story.genres.slice(0,3).map(g => (
            <span key={g} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">{g}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>{fmtViews(story.views)}</span>
          <span className="flex items-center gap-1"><FileText className="w-3 h-3"/>{story.chapters.length} chương</span>
          {story.rating > 0 && <span className="flex items-center gap-1 text-yellow-500"><Star className="w-3 h-3 fill-current"/>{story.rating}</span>}
        </div>
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" onClick={onManageChapters} className="flex-1 text-xs h-8">
            <FileText className="w-3 h-3"/> Chương ({story.chapters.length})
          </Button>
          <button onClick={onEdit} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Edit3 className="w-3.5 h-3.5"/>
          </button>
          <button onClick={onDelete} className="p-2 rounded-xl hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
            <Trash2 className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Chapters Panel ─── */
function ChaptersPanel({ story, onBack, onUpdate }: { story: MyStory; onBack: () => void; onUpdate: (s: MyStory) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editCh, setEditCh] = useState<MyChapter | undefined>();

  const saveChapter = (ch: MyChapter) => {
    const exists = story.chapters.find(c => c.id === ch.id);
    const chapters = exists
      ? story.chapters.map(c => c.id === ch.id ? ch : c)
      : [...story.chapters, ch].sort((a,b) => a.chapterNumber - b.chapterNumber);
    onUpdate({ ...story, chapters });
    setShowForm(false);
    setEditCh(undefined);
  };

  const deleteChapter = (id: string) => {
    onUpdate({ ...story, chapters: story.chapters.filter(c => c.id !== id) });
  };

  const nextNum = story.chapters.length > 0 ? Math.max(...story.chapters.map(c => c.chapterNumber)) + 1 : 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-8 h-10 rounded overflow-hidden flex-none">
            <Image src={story.cover} alt={story.title} width={32} height={40} className="object-cover w-full h-full" unoptimized />
          </div>
          <div>
            <h2 className="font-bold truncate">{story.title}</h2>
            <p className="text-xs text-muted-foreground">{story.chapters.length} chương</p>
          </div>
        </div>
        <Button variant="gradient" size="sm" onClick={() => { setEditCh(undefined); setShowForm(true); }}>
          <PlusCircle className="w-3.5 h-3.5" /> Thêm chương
        </Button>
      </div>

      {story.chapters.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground mb-3">Chưa có chương nào</p>
          <Button variant="gradient" size="sm" onClick={() => { setEditCh(undefined); setShowForm(true); }}>
            <PlusCircle className="w-3.5 h-3.5" /> Thêm chương đầu tiên
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl divide-y divide-border/50">
          {[...story.chapters].sort((a,b) => b.chapterNumber - a.chapterNumber).map(ch => (
            <div key={ch.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
              <span className="text-sm font-bold text-purple-500 w-8 flex-none">#{ch.chapterNumber}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{ch.title || `Chương ${ch.chapterNumber}`}</p>
                <p className="text-xs text-muted-foreground">{ch.views} lượt đọc · {ch.createdAt}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditCh(ch); setShowForm(true); }}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <Edit3 className="w-3.5 h-3.5"/>
                </button>
                <button onClick={() => deleteChapter(ch.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <ChapterForm storyId={story.id} initial={editCh} nextNum={nextNum}
            onSave={saveChapter} onClose={() => { setShowForm(false); setEditCh(undefined); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main page ─── */
export default function UserDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stories, setStories] = useState<MyStory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editStory, setEditStory] = useState<MyStory | undefined>();
  const [activeStory, setActiveStory] = useState<MyStory | undefined>();

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) setStories(loadStories());
  }, [user]);

  if (loading || !user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const saveStory = (s: MyStory) => {
    const exists = stories.find(x => x.id === s.id);
    const next = exists ? stories.map(x => x.id === s.id ? s : x) : [...stories, s];
    setStories(next);
    saveStories(next);
    setShowForm(false);
    setEditStory(undefined);
  };

  const deleteStory = (id: string) => {
    const next = stories.filter(s => s.id !== id);
    setStories(next);
    saveStories(next);
  };

  const updateStory = (s: MyStory) => {
    const next = stories.map(x => x.id === s.id ? s : x);
    setStories(next);
    saveStories(next);
    setActiveStory(s);
  };

  const totalViews = stories.reduce((sum, s) => sum + s.views, 0);
  const totalChapters = stories.reduce((sum, s) => sum + s.chapters.length, 0);

  const stats = [
    { label:'Truyện của tôi', value: stories.length,  icon: BookOpen,   color:'text-purple-500', bg:'bg-purple-500/10' },
    { label:'Tổng chương',    value: totalChapters,    icon: FileText,   color:'text-blue-500',   bg:'bg-blue-500/10' },
    { label:'Lượt đọc',       value: fmtViews(totalViews), icon: Eye,   color:'text-green-500',  bg:'bg-green-500/10' },
    { label:'Đang ra',        value: stories.filter(s=>s.status==='ongoing').length, icon: TrendingUp, color:'text-orange-500', bg:'bg-orange-500/10' },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-purple-500/30">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-black">Quản lí của tôi</h1>
              <p className="text-sm text-muted-foreground">
                Xin chào, <span className="font-semibold text-foreground">{user.username}</span> · Lv.{user.level}
              </p>
            </div>
          </div>
          <Button variant="gradient" onClick={() => { setEditStory(undefined); setShowForm(true); }}>
            <PlusCircle className="w-4 h-4" /> Thêm truyện
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-none', bg)}>
                <Icon className={cn('w-4 h-4', color)} />
              </div>
              <div>
                <p className="text-lg font-black leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeStory ? (
          <motion.div key="chapters" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
            <ChaptersPanel story={activeStory} onBack={() => setActiveStory(undefined)} onUpdate={updateStory} />
          </motion.div>
        ) : (
          <motion.div key="stories" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            {stories.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
                <Feather className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="font-semibold mb-1">Chưa có truyện nào</p>
                <p className="text-sm text-muted-foreground mb-5">Bắt đầu hành trình sáng tác của bạn ngay hôm nay!</p>
                <Button variant="gradient" onClick={() => { setEditStory(undefined); setShowForm(true); }}>
                  <PlusCircle className="w-4 h-4" /> Tạo truyện đầu tiên
                </Button>
              </div>
            ) : (
              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stories.map(s => (
                  <StoryCard key={s.id} story={s}
                    onEdit={() => { setEditStory(s); setShowForm(true); }}
                    onDelete={() => deleteStory(s.id)}
                    onManageChapters={() => setActiveStory(s)}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <StoryForm initial={editStory} onSave={saveStory} onClose={() => { setShowForm(false); setEditStory(undefined); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
