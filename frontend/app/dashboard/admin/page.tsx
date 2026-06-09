'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, BookOpen, BarChart2, TrendingUp, Activity,
  Search, ChevronUp, ChevronDown, Trash2, Ban, CheckCircle,
  Crown, Feather, Star, RotateCcw, Eye, EyeOff, Flame,
  Sparkles, Settings2, UserCog, Lock, GripVertical,
  Edit3, PlusCircle, FileText,
} from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getSidebarConfig, setSidebarConfig, resetSidebarConfig } from '@/lib/sidebar-config';
import type { SidebarItemConfig } from '@/lib/sidebar-config';
import { cn } from '@/lib/utils';

/* ─── Types ─── */
type UserRole   = 'admin' | 'author' | 'user';
type UserStatus = 'active' | 'banned';
type AdminTab   = 'overview' | 'users' | 'content' | 'config';

interface AdminUser {
  id: number; username: string; email: string; avatar: string;
  role: UserRole; status: UserStatus; level: number; coin: number;
  createdAt: string; totalRead: number;
}
interface AdminStory {
  id: number; title: string; slug: string; cover: string; author: string;
  genres: string[]; rating: number; views: number; chapters: number;
  status: 'ongoing' | 'completed' | 'hiatus'; isHot: boolean; isNew: boolean;
  createdAt: string;
}

/* ─── Mock data ─── */
const MOCK_USERS: AdminUser[] = [
  { id:1,  username:'admin',       email:'admin@manga.vn',       avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',       role:'admin',  status:'active', level:99, coin:9999, createdAt:'2024-01-01', totalRead:512 },
  { id:2,  username:'KiemKhach',   email:'kiemkhach@gmail.com',  avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=KiemKhach',   role:'author', status:'active', level:28, coin:1450, createdAt:'2024-01-15', totalRead:340 },
  { id:3,  username:'TieuNhi',     email:'tieunhi@gmail.com',    avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=TieuNhi',     role:'user',   status:'active', level:12, coin:320,  createdAt:'2024-02-05', totalRead:89  },
  { id:4,  username:'DragonRead',  email:'dragon@outlook.com',   avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=DragonRead',  role:'user',   status:'active', level:35, coin:2100, createdAt:'2024-02-20', totalRead:423 },
  { id:5,  username:'LinhKhi99',   email:'linhkhi@yahoo.com',    avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=LinhKhi99',   role:'author', status:'active', level:41, coin:3300, createdAt:'2024-03-01', totalRead:201 },
  { id:6,  username:'SpamUser',    email:'spam@temp.com',        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=SpamUser',    role:'user',   status:'banned', level:2,  coin:0,    createdAt:'2024-03-10', totalRead:5   },
  { id:7,  username:'HoaPhong',    email:'hoaphong@gmail.com',   avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=HoaPhong',   role:'user',   status:'active', level:19, coin:780,  createdAt:'2024-03-15', totalRead:156 },
  { id:8,  username:'VanChau',     email:'vanchau@nepchu.vn',    avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=VanChau',    role:'author', status:'active', level:55, coin:5500, createdAt:'2024-04-01', totalRead:680 },
  { id:9,  username:'NoobReader',  email:'noob@gmail.com',       avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=NoobReader', role:'user',   status:'active', level:3,  coin:50,   createdAt:'2024-04-20', totalRead:12  },
  { id:10, username:'ToxicXX',     email:'toxic@temp.net',       avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=ToxicXX',   role:'user',   status:'banned', level:8,  coin:0,    createdAt:'2024-05-01', totalRead:44  },
  { id:11, username:'SakuraFan',   email:'sakura@gmail.com',     avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=SakuraFan', role:'user',   status:'active', level:22, coin:960,  createdAt:'2024-05-10', totalRead:198 },
  { id:12, username:'TienHiepPro', email:'tienhiep@hotmail.com', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=TienHiepPro',role:'author', status:'active', level:67, coin:7800, createdAt:'2024-05-25', totalRead:901 },
];

const MOCK_STORIES: AdminStory[] = [
  { id:1,  title:'Kiếm Lai',            slug:'kiem-lai',            cover:'https://picsum.photos/seed/manga10/300/420', author:'Phong Hỏa Hí Chư Hầu', genres:['Cultivation','Action'],  rating:9.4, views:1100000, chapters:248, status:'ongoing',   isHot:true,  isNew:false, createdAt:'2024-01-10' },
  { id:2,  title:'Ma Đạo Tổ Sư',        slug:'ma-dao-to-su',        cover:'https://picsum.photos/seed/manga2/300/420',  author:'Mo Xiang Tong Xiu',     genres:['Romance','Fantasy'],    rating:9.5, views:980000,  chapters:120, status:'completed',  isHot:true,  isNew:false, createdAt:'2024-01-15' },
  { id:3,  title:'Toàn Chức Pháp Sư',   slug:'toan-chuc-phap-su',   cover:'https://picsum.photos/seed/manga4/300/420',  author:'Loạn',                  genres:['Action','Magic'],       rating:9.0, views:890000,  chapters:312, status:'ongoing',   isHot:true,  isNew:false, createdAt:'2024-01-20' },
  { id:4,  title:'Hoàn Mỹ Thế Giới',    slug:'hoan-my-the-gioi',    cover:'https://picsum.photos/seed/manga8/300/420',  author:'Chen Dong',             genres:['Fantasy','Adventure'],  rating:9.1, views:934000,  chapters:190, status:'ongoing',   isHot:false, isNew:false, createdAt:'2024-02-01' },
  { id:5,  title:'Hoa Sơn Nghịch Khách',slug:'hoa-son-nghich-khach',cover:'https://picsum.photos/seed/manga12/300/420', author:'Từ Khách',              genres:['Wuxia','Comedy'],       rating:9.0, views:856000,  chapters:405, status:'ongoing',   isHot:true,  isNew:false, createdAt:'2024-02-10' },
  { id:6,  title:'Tu Tiên Giới',         slug:'tu-tien-gioi',         cover:'https://picsum.photos/seed/manga7/300/420',  author:'Nhĩ Căn',               genres:['Cultivation'],          rating:8.9, views:789000,  chapters:567, status:'ongoing',   isHot:true,  isNew:false, createdAt:'2024-02-15' },
  { id:7,  title:'Vạn Cổ Chí Tôn',      slug:'van-co-chi-ton',      cover:'https://picsum.photos/seed/manga3/300/420',  author:'Tiêu Tiêu',             genres:['Action','System'],      rating:8.7, views:756000,  chapters:89,  status:'ongoing',   isHot:false, isNew:true,  createdAt:'2024-03-01' },
  { id:8,  title:'Lược Thiên Ký',        slug:'luoc-thien-ky',        cover:'https://picsum.photos/seed/manga11/300/420', author:'Mặc Bảo Phi Bảo',      genres:['Fantasy','Action'],     rating:8.8, views:678000,  chapters:234, status:'ongoing',   isHot:false, isNew:true,  createdAt:'2024-03-10' },
  { id:9,  title:'Cô Đơn Trong Vũ Trụ', slug:'co-don-trong-vu-tru', cover:'https://picsum.photos/seed/manga5/300/420',  author:'Liu Cixin',             genres:['Sci-Fi','Drama'],       rating:9.3, views:654000,  chapters:58,  status:'completed',  isHot:false, isNew:false, createdAt:'2024-03-15' },
  { id:10, title:'Thần Y Hạ Sơn',       slug:'than-y-ha-son',       cover:'https://picsum.photos/seed/manga9/300/420',  author:'Vũ Tiên',               genres:['Romance','Medical'],    rating:8.3, views:423000,  chapters:145, status:'ongoing',   isHot:false, isNew:true,  createdAt:'2024-04-01' },
];

const ROLE_STYLE: Record<UserRole, { label: string; cls: string; icon: React.ReactNode }> = {
  admin:  { label:'Admin',    cls:'bg-red-500/15 text-red-400 border border-red-500/30',       icon:<Crown  className="w-3 h-3"/> },
  author: { label:'Tác giả', cls:'bg-purple-500/15 text-purple-400 border border-purple-500/30',icon:<Feather className="w-3 h-3"/> },
  user:   { label:'Thành viên',cls:'bg-blue-500/15 text-blue-400 border border-blue-500/30',   icon:<Users  className="w-3 h-3"/> },
};
const STATUS_STYLE: Record<UserStatus, { label: string; cls: string }> = {
  active: { label:'Hoạt động', cls:'bg-green-500/15 text-green-400 border border-green-500/30' },
  banned: { label:'Bị cấm',    cls:'bg-red-500/15 text-red-400 border border-red-500/30' },
};

function fmtViews(n: number) {
  if (n >= 1000000) return (n/1000000).toFixed(1)+'M';
  if (n >= 1000) return (n/1000).toFixed(0)+'K';
  return String(n);
}

/* ─── Sub-components ─── */

function OverviewTab({ users, stories }: { users: AdminUser[]; stories: AdminStory[] }) {
  const stats = [
    { label:'Tổng người dùng', value: users.length,                    icon: Users,    color:'from-blue-500 to-cyan-500',    bg:'bg-blue-500/10' },
    { label:'Tổng truyện',     value: stories.length,                   icon: BookOpen, color:'from-purple-500 to-violet-500',bg:'bg-purple-500/10' },
    { label:'Lượt đọc hôm nay',value: '24.3K',                          icon: TrendingUp,color:'from-green-500 to-emerald-500',bg:'bg-green-500/10' },
    { label:'Tác giả hoạt động',value: users.filter(u=>u.role==='author'&&u.status==='active').length, icon: Feather, color:'from-pink-500 to-rose-500', bg:'bg-pink-500/10' },
  ];

  const recentUsers  = [...users].sort((a,b)=>b.id-a.id).slice(0,5);
  const topStories   = [...stories].sort((a,b)=>b.views-a.views).slice(0,5);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bg)}>
              <Icon className={cn('w-5 h-5 bg-gradient-to-br bg-clip-text', color)} style={{background:`linear-gradient(135deg, var(--tw-gradient-stops))`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}} />
            </div>
            <div>
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" /> Người dùng mới nhất
          </h3>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <Avatar className="w-8 h-8 flex-none">
                  <AvatarImage src={u.avatar} />
                  <AvatarFallback>{u.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{u.username}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1', ROLE_STYLE[u.role].cls)}>
                  {ROLE_STYLE[u.role].icon} {ROLE_STYLE[u.role].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top stories */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-500" /> Truyện nhiều lượt đọc nhất
          </h3>
          <div className="space-y-3">
            {topStories.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className={cn('text-sm font-black w-5 text-center', i===0?'text-yellow-500':i===1?'text-gray-400':i===2?'text-amber-600':'text-muted-foreground')}>{i+1}</span>
                <div className="w-8 h-10 rounded overflow-hidden flex-none">
                  <Image src={s.cover} alt={s.title} width={32} height={40} className="object-cover w-full h-full" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{fmtViews(s.views)} lượt đọc</p>
                </div>
                {s.isHot && <Flame className="w-4 h-4 text-orange-500 flex-none" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersTab({ users: init }: { users: AdminUser[] }) {
  const [users, setUsers] = useState(init);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchR = roleFilter === 'all' || u.role === roleFilter;
    const matchS = statusFilter === 'all' || u.status === statusFilter;
    return matchQ && matchR && matchS;
  });

  const changeRole = (id: number, role: UserRole) => setUsers(prev => prev.map(u => u.id===id ? {...u, role} : u));
  const toggleBan  = (id: number) => setUsers(prev => prev.map(u => u.id===id ? {...u, status: u.status==='active'?'banned':'active'} : u));
  const deleteUser = (id: number) => setUsers(prev => prev.filter(u => u.id!==id));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm tên, email..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 h-9 rounded-xl text-sm" />
        </div>
        <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value as UserRole|'all')}
          className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground">
          <option value="all">Tất cả role</option>
          <option value="admin">Admin</option>
          <option value="author">Tác giả</option>
          <option value="user">Thành viên</option>
        </select>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as UserStatus|'all')}
          className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground">
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="banned">Bị cấm</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['Người dùng','Email','Role','Trạng thái','Lv','Xu','Ngày tạo','Hành động'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7 flex-none">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback className="text-[10px]">{u.username[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate max-w-[120px]">{u.username}</span>
                      {u.role === 'admin' && <Lock className="w-3 h-3 text-red-400 flex-none" title="Không thể xóa" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs truncate max-w-[160px]">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.role === 'admin' ? (
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 w-fit', ROLE_STYLE.admin.cls)}>
                        {ROLE_STYLE.admin.icon} Admin
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value as UserRole)}
                        className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border bg-transparent cursor-pointer', ROLE_STYLE[u.role].cls)}
                      >
                        <option value="author">Tác giả</option>
                        <option value="user">Thành viên</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', STATUS_STYLE[u.status].cls)}>
                      {STATUS_STYLE[u.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{u.level}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.coin.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{u.createdAt}</td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleBan(u.id)} title={u.status==='active'?'Cấm user':'Bỏ cấm'}
                          className={cn('p-1.5 rounded-lg transition-colors', u.status==='active'?'hover:bg-red-500/10 hover:text-red-400':'hover:bg-green-500/10 hover:text-green-400', 'text-muted-foreground')}>
                          {u.status==='active' ? <Ban className="w-3.5 h-3.5"/> : <CheckCircle className="w-3.5 h-3.5"/>}
                        </button>
                        <button onClick={() => deleteUser(u.id)} title="Xóa user"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-border/50 bg-muted/20 text-xs text-muted-foreground">
          Hiển thị {filtered.length}/{users.length} người dùng
        </div>
      </div>
    </div>
  );
}

function ContentTab({ stories: init }: { stories: AdminStory[] }) {
  const [stories, setStories] = useState(init);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'ongoing'|'completed'|'hiatus'>('all');

  const filtered = stories.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q);
    const matchS = statusFilter === 'all' || s.status === statusFilter;
    return matchQ && matchS;
  });

  const toggleHot  = (id: number) => setStories(prev => prev.map(s => s.id===id ? {...s, isHot: !s.isHot} : s));
  const toggleNew  = (id: number) => setStories(prev => prev.map(s => s.id===id ? {...s, isNew: !s.isNew} : s));
  const deleteStory= (id: number) => setStories(prev => prev.filter(s => s.id!==id));

  const statusLabel = { ongoing:'Đang ra', completed:'Hoàn thành', hiatus:'Tạm dừng' };
  const statusCls   = { ongoing:'bg-green-500/15 text-green-400', completed:'bg-blue-500/15 text-blue-400', hiatus:'bg-yellow-500/15 text-yellow-400' };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm tên truyện, tác giả..." value={search} onChange={e=>setSearch(e.target.value)} className="pl-9 h-9 rounded-xl text-sm" />
        </div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value as typeof statusFilter)}
          className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground">
          <option value="all">Tất cả</option>
          <option value="ongoing">Đang ra</option>
          <option value="completed">Hoàn thành</option>
          <option value="hiatus">Tạm dừng</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['Truyện','Tác giả','Trạng thái','Views','Chương','Rating','Nhãn','Hành động'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-10 rounded overflow-hidden flex-none">
                        <Image src={s.cover} alt={s.title} width={32} height={40} className="object-cover w-full h-full" unoptimized />
                      </div>
                      <span className="font-medium truncate max-w-[140px]">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-[100px]">{s.author}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', statusCls[s.status])}>
                      {statusLabel[s.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{fmtViews(s.views)}</td>
                  <td className="px-4 py-3">{s.chapters}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                      <Star className="w-3 h-3 fill-current" />{s.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleHot(s.id)} title="Toggle Hot"
                        className={cn('p-1 rounded-lg text-xs font-semibold transition-colors', s.isHot ? 'bg-orange-500/15 text-orange-400' : 'text-muted-foreground hover:bg-orange-500/10 hover:text-orange-400')}>
                        <Flame className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleNew(s.id)} title="Toggle New"
                        className={cn('p-1 rounded-lg text-xs font-semibold transition-colors', s.isNew ? 'bg-green-500/15 text-green-400' : 'text-muted-foreground hover:bg-green-500/10 hover:text-green-400')}>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteStory(s.id)} title="Xóa truyện"
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-border/50 bg-muted/20 text-xs text-muted-foreground">
          Hiển thị {filtered.length}/{stories.length} truyện
        </div>
      </div>
    </div>
  );
}

function ConfigTab() {
  const [items, setItems] = useState<SidebarItemConfig[]>(getSidebarConfig);
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) => setItems(prev => prev.map(i => i.key===key ? {...i, visible:!i.visible} : i));
  const move = (idx: number, dir: -1|1) => {
    const next = [...items];
    const to = idx + dir;
    if (to < 0 || to >= next.length) return;
    [next[idx], next[to]] = [next[to], next[idx]];
    setItems(next.map((it, i) => ({...it, order: i})));
  };
  const save = () => {
    setSidebarConfig(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const reset = () => { resetSidebarConfig(); setItems(getSidebarConfig()); };

  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-muted-foreground">Bật/tắt và sắp xếp các mục hiển thị trong sidebar. Thay đổi áp dụng ngay cho tất cả người dùng.</p>
      <div className="bg-card border border-border rounded-2xl divide-y divide-border/50">
        {items.map((item, i) => (
          <div key={item.key} className="flex items-center gap-3 px-4 py-3">
            <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-none" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.key}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => move(i, -1)} disabled={i===0} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i===items.length-1} className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
            <button onClick={() => toggle(item.key)}
              className={cn('p-1.5 rounded-lg transition-colors', item.visible ? 'text-green-400 hover:bg-green-500/10' : 'text-muted-foreground hover:bg-muted')}>
              {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="gradient" onClick={save} className="flex-1">
          {saved ? '✓ Đã lưu!' : 'Lưu thay đổi'}
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="w-4 h-4" /> Đặt lại
        </Button>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('overview');

  useEffect(() => {
    if (!loading && user?.role !== 'admin') router.replace('/');
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (user.role !== 'admin') return null;

  const tabs: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key:'overview', label:'Tổng quan',     icon:<BarChart2 className="w-4 h-4"/> },
    { key:'users',    label:'Người dùng',    icon:<Users className="w-4 h-4"/> },
    { key:'content',  label:'Nội dung',      icon:<BookOpen className="w-4 h-4"/> },
    { key:'config',   label:'Cấu hình',      icon:<Settings2 className="w-4 h-4"/> },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Quản lí nền tảng Nếp Chữ</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-[10px]">{user.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Đang đăng nhập với tư cách <span className="font-semibold text-red-400">{user.username}</span></span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1">
            <Crown className="w-2.5 h-2.5" /> ADMIN
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 bg-muted/50 p-1 rounded-2xl w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              tab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.15 }}>
          {tab === 'overview' && <OverviewTab users={MOCK_USERS} stories={MOCK_STORIES} />}
          {tab === 'users'    && <UsersTab users={MOCK_USERS} />}
          {tab === 'content'  && <ContentTab stories={MOCK_STORIES} />}
          {tab === 'config'   && <ConfigTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
