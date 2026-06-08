'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, LayoutDashboard, Settings2,
  Search, ChevronUp, ChevronDown, Eye, EyeOff,
  RefreshCw, Trash2, Ban, CheckCircle, UserCog,
  Crown, Feather, Star, TrendingUp, BookOpen, Activity,
  RotateCcw, GripVertical, Lock,
} from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getSidebarConfig, setSidebarConfig, resetSidebarConfig } from '@/lib/sidebar-config';
import type { SidebarItemConfig } from '@/lib/sidebar-config';
import { cn } from '@/lib/utils';

/* ─── Types ─── */
type UserRole   = 'admin' | 'author' | 'user';
type UserStatus = 'active' | 'banned';
type AdminTab   = 'overview' | 'users' | 'sidebar';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  level: number;
  coin: number;
  createdAt: string;
  totalRead: number;
}

/* ─── Mock data ─── */
const MOCK_USERS: AdminUser[] = [
  { id: 1,  username: 'admin',       email: 'admin@nepchu.vn',        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',       role: 'admin',  status: 'active', level: 99, coin: 9999, createdAt: '2024-01-01', totalRead: 512 },
  { id: 2,  username: 'KiemKhach',   email: 'kiemkhach@gmail.com',    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KiemKhach',   role: 'author', status: 'active', level: 28, coin: 1450, createdAt: '2024-01-15', totalRead: 340 },
  { id: 3,  username: 'TieuNhi',     email: 'tieunhi@gmail.com',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TieuNhi',     role: 'user',   status: 'active', level: 12, coin: 320,  createdAt: '2024-02-05', totalRead: 89  },
  { id: 4,  username: 'DragonRead',  email: 'dragon@outlook.com',     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DragonRead',  role: 'user',   status: 'active', level: 35, coin: 2100, createdAt: '2024-02-20', totalRead: 423 },
  { id: 5,  username: 'LinhKhi99',   email: 'linhkhi@yahoo.com',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LinhKhi99',   role: 'author', status: 'active', level: 41, coin: 3300, createdAt: '2024-03-01', totalRead: 201 },
  { id: 6,  username: 'SpamUser',    email: 'spam@temp.com',          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SpamUser',    role: 'user',   status: 'banned', level: 2,  coin: 0,    createdAt: '2024-03-10', totalRead: 5   },
  { id: 7,  username: 'HoaPhong',    email: 'hoaphong@gmail.com',     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoaPhong',    role: 'user',   status: 'active', level: 19, coin: 780,  createdAt: '2024-03-15', totalRead: 156 },
  { id: 8,  username: 'VanChau',     email: 'vanchau@nepchu.vn',      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VanChau',     role: 'author', status: 'active', level: 55, coin: 5500, createdAt: '2024-04-01', totalRead: 680 },
  { id: 9,  username: 'NoobReader',  email: 'noob@gmail.com',         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NoobReader',  role: 'user',   status: 'active', level: 3,  coin: 50,   createdAt: '2024-04-20', totalRead: 12  },
  { id: 10, username: 'ToxicXX',     email: 'toxic@temp.net',         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ToxicXX',    role: 'user',   status: 'banned', level: 8,  coin: 0,    createdAt: '2024-05-01', totalRead: 44  },
  { id: 11, username: 'SakuraFan',   email: 'sakura@gmail.com',       avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SakuraFan',   role: 'user',   status: 'active', level: 22, coin: 960,  createdAt: '2024-05-10', totalRead: 198 },
  { id: 12, username: 'TienHiepPro', email: 'tienhiep@hotmail.com',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TienHiepPro', role: 'author', status: 'active', level: 67, coin: 7800, createdAt: '2024-05-25', totalRead: 901 },
];

const ROLE_STYLE: Record<UserRole, { label: string; cls: string; icon: React.ReactNode }> = {
  admin:  { label: 'Admin',  cls: 'bg-red-500/15 text-red-400 border border-red-500/30',       icon: <Crown className="w-3 h-3" /> },
  author: { label: 'Tác giả', cls: 'bg-purple-500/15 text-purple-400 border border-purple-500/30', icon: <Feather className="w-3 h-3" /> },
  user:   { label: 'Thành viên', cls: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',   icon: <Users className="w-3 h-3" /> },
};

const STATUS_STYLE: Record<UserStatus, { label: string; cls: string }> = {
  active: { label: 'Hoạt động', cls: 'bg-emerald-500/15 text-emerald-400' },
  banned: { label: 'Bị cấm',   cls: 'bg-red-500/15 text-red-400' },
};

/* ─── Overview tab ─── */
function OverviewTab({ users }: { users: AdminUser[] }) {
  const totalUsers   = users.length;
  const activeUsers  = users.filter(u => u.status === 'active').length;
  const bannedUsers  = users.filter(u => u.status === 'banned').length;
  const totalAuthors = users.filter(u => u.role === 'author').length;

  const stats = [
    { label: 'Tổng người dùng', value: totalUsers,   icon: Users,       gradient: 'from-blue-600 to-cyan-600',      glow: 'shadow-blue-500/20'   },
    { label: 'Đang hoạt động',  value: activeUsers,  icon: Activity,    gradient: 'from-emerald-600 to-teal-600',   glow: 'shadow-emerald-500/20'},
    { label: 'Bị cấm',          value: bannedUsers,  icon: Ban,         gradient: 'from-red-600 to-rose-600',       glow: 'shadow-red-500/20'    },
    { label: 'Tác giả',         value: totalAuthors, icon: Feather,     gradient: 'from-purple-600 to-violet-600',  glow: 'shadow-purple-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, gradient, glow }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 hover:shadow-xl ${glow} transition-all`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10 blur-xl">
              <div className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full`} />
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} shadow-lg flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-black">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent users */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-500" /> Thành viên gần đây
        </h3>
        <div className="space-y-3">
          {users.slice(-5).reverse().map(u => (
            <div key={u.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
              <Avatar className="w-8 h-8 flex-none">
                <AvatarImage src={u.avatar} />
                <AvatarFallback className="text-xs">{u.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{u.username}</p>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
              <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLE[u.role].cls}`}>
                {ROLE_STYLE[u.role].icon}{ROLE_STYLE[u.role].label}
              </span>
              <span className="text-xs text-muted-foreground">{u.createdAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Users tab ─── */
function UsersTab({ users, setUsers }: { users: AdminUser[]; setUsers: (u: AdminUser[]) => void }) {
  const [search, setSearch]       = useState('');
  const [filterRole, setFilterRole]     = useState<UserRole | ''>('');
  const [filterStatus, setFilterStatus] = useState<UserStatus | ''>('');
  const [editId, setEditId] = useState<number | null>(null);

  const filtered = users.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = !filterRole   || u.role === filterRole;
    const matchStatus = !filterStatus || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleBan  = (id: number) => setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u));
  const deleteUser = (id: number) => setUsers(users.filter(u => u.id !== id));
  const setRole    = (id: number, role: UserRole) => { setUsers(users.map(u => u.id === id ? { ...u, role } : u)); setEditId(null); };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9 rounded-xl" placeholder="Tìm tên hoặc email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(['', 'admin', 'author', 'user'] as const).map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={cn('px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap', filterRole === r ? 'bg-purple-600 text-white' : 'bg-muted hover:bg-muted/80')}
            >
              {r === '' ? 'Tất cả' : ROLE_STYLE[r].label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['', 'active', 'banned'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn('px-3 py-2 rounded-xl text-xs font-medium transition-all', filterStatus === s ? 'bg-purple-600 text-white' : 'bg-muted hover:bg-muted/80')}
            >
              {s === '' ? 'Tất cả' : STATUS_STYLE[s].label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">{filtered.length} / {users.length} người dùng</p>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Người dùng</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Vai trò</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Trạng thái</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Cấp / Coin</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Ngày tạo</th>
                <th className="text-right px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <AnimatePresence>
                {filtered.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      'hover:bg-muted/30 transition-colors',
                      u.status === 'banned' && 'opacity-60'
                    )}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 flex-none">
                          <AvatarImage src={u.avatar} />
                          <AvatarFallback className="text-xs">{u.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{u.username}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <div className="relative">
                        <button
                          onClick={() => setEditId(editId === u.id ? null : u.id)}
                          className={cn('flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:opacity-80', ROLE_STYLE[u.role].cls)}
                        >
                          {ROLE_STYLE[u.role].icon}
                          {ROLE_STYLE[u.role].label}
                          <UserCog className="w-3 h-3 ml-0.5" />
                        </button>
                        <AnimatePresence>
                          {editId === u.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 4, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute left-0 top-full mt-1 z-20 bg-card border border-border rounded-xl shadow-2xl shadow-black/20 p-1.5 min-w-[130px]"
                            >
                              {(['admin', 'author', 'user'] as UserRole[]).map(r => (
                                <button
                                  key={r}
                                  onClick={() => setRole(u.id, r)}
                                  className={cn(
                                    'flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                                    u.role === r ? 'bg-purple-600 text-white' : 'hover:bg-muted'
                                  )}
                                >
                                  {ROLE_STYLE[r].icon} {ROLE_STYLE[r].label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', STATUS_STYLE[u.status].cls)}>
                        {STATUS_STYLE[u.status].label}
                      </span>
                    </td>

                    {/* Level / Coin */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="text-purple-400 font-bold">Lv.{u.level}</span>
                        <span>·</span>
                        <span className="text-yellow-400 font-bold">{u.coin}🪙</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.createdAt}</td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleBan(u.id)}
                          disabled={u.role === 'admin'}
                          className={cn(
                            'p-2 rounded-lg transition-all text-muted-foreground',
                            u.role !== 'admin' && (u.status === 'banned'
                              ? 'hover:bg-emerald-500/10 hover:text-emerald-500'
                              : 'hover:bg-yellow-500/10 hover:text-yellow-500'),
                            u.role === 'admin' && 'opacity-30 cursor-not-allowed'
                          )}
                          title={u.status === 'banned' ? 'Bỏ cấm' : 'Cấm tài khoản'}
                        >
                          {u.status === 'banned' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          disabled={u.role === 'admin'}
                          className={cn(
                            'p-2 rounded-lg transition-all text-muted-foreground',
                            u.role !== 'admin' && 'hover:bg-red-500/10 hover:text-red-500',
                            u.role === 'admin' && 'opacity-30 cursor-not-allowed'
                          )}
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar tab ─── */
function SidebarTab() {
  const [items, setItems] = useState<SidebarItemConfig[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setItems(getSidebarConfig()); }, []);

  const toggle = (key: string) =>
    setItems(prev => prev.map(it => it.key === key ? { ...it, visible: !it.visible } : it));

  const move = (key: string, dir: 'up' | 'down') => {
    setItems(prev => {
      const idx = prev.findIndex(it => it.key === key);
      if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === prev.length - 1)) return prev;
      const next = [...prev];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next.map((it, i) => ({ ...it, order: i }));
    });
  };

  const save = () => {
    setSidebarConfig(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reset = () => {
    resetSidebarConfig();
    setItems(getSidebarConfig());
  };

  const ICONS: Record<string, string> = {
    '/': '🏠',
    '/library': '📚',
    '/authors': '✍️',
    '/community': '💬',
    '/inbox': '🔔',
  };

  return (
    <div className="max-w-lg">
      <p className="text-sm text-muted-foreground mb-5">
        Bật/tắt và sắp xếp lại các mục điều hướng trong sidebar. Thay đổi có hiệu lực ngay sau khi lưu.
      </p>

      <div className="space-y-2 mb-6">
        {items.map((item, i) => (
          <motion.div
            key={item.key}
            layout
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'flex items-center gap-3 p-3.5 bg-card border rounded-2xl transition-all',
              item.visible ? 'border-border hover:border-purple-500/40' : 'border-dashed border-border/50 opacity-50'
            )}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-none" />

            <span className="text-xl flex-none">{ICONS[item.key] || '📄'}</span>

            <div className="flex-1 min-w-0">
              <p className={cn('font-semibold text-sm', !item.visible && 'line-through text-muted-foreground')}>
                {item.label}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">{item.key}</p>
            </div>

            {/* Reorder */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => move(item.key, 'up')}
                disabled={i === 0}
                className="p-1 rounded-lg hover:bg-muted transition-colors disabled:opacity-20"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => move(item.key, 'down')}
                disabled={i === items.length - 1}
                className="p-1 rounded-lg hover:bg-muted transition-colors disabled:opacity-20"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggle(item.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                item.visible
                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {item.visible ? <><Eye className="w-3.5 h-3.5" />Hiện</> : <><EyeOff className="w-3.5 h-3.5" />Ẩn</>}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={save}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/20 text-sm"
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Đã lưu!</> : <><Settings2 className="w-4 h-4" /> Lưu cấu hình</>}
        </motion.button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2.5 border border-border hover:bg-muted rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Khôi phục mặc định
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);

  const TABS: { key: AdminTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Tổng quan',       icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'users',    label: 'Người dùng',       icon: <Users className="w-4 h-4" /> },
    { key: 'sidebar',  label: 'Cấu hình Sidebar', icon: <Settings2 className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-4 mb-8 flex-col sm:flex-row">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30 flex-none">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Quản trị hệ thống Nếp Chữ</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl text-sm">
            <Avatar className="w-7 h-7">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs">{user.username[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.username}</span>
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1', ROLE_STYLE['admin'].cls)}>
              Admin
            </span>
          </div>
        )}
      </div>

      {/* Warning if not logged in */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl mb-6 text-sm"
        >
          <Lock className="w-5 h-5 text-yellow-500 flex-none" />
          <p className="text-yellow-600 dark:text-yellow-400">
            Bạn chưa đăng nhập. Trong môi trường thực, trang này yêu cầu quyền Admin.
          </p>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted/50 rounded-2xl p-1 w-fit flex-wrap">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
              tab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {tab === 'overview' && <OverviewTab users={users} />}
          {tab === 'users'    && <UsersTab users={users} setUsers={setUsers} />}
          {tab === 'sidebar'  && <SidebarTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
