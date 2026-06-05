'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Home, Library, Users, MessageSquare, Inbox,
  LogIn, LogOut, Menu, X, ChevronLeft, ChevronRight,
  Sparkles, Settings, Bell
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Trang Chủ', color: 'from-blue-500 to-cyan-500' },
  { href: '/library', icon: Library, label: 'Thư Viện', color: 'from-purple-500 to-violet-500' },
  { href: '/authors', icon: Users, label: 'Tác Giả', color: 'from-pink-500 to-rose-500' },
  { href: '/community', icon: MessageSquare, label: 'Cộng Đồng', color: 'from-green-500 to-emerald-500' },
  { href: '/inbox', icon: Inbox, label: 'Thông Báo', color: 'from-orange-500 to-amber-500', badge: 3 },
];

interface SidebarContentProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onClose?: () => void;
  showCollapse?: boolean;
}

function SidebarContent({ collapsed, setCollapsed, onClose, showCollapse = true }: SidebarContentProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 pb-3">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 min-w-0">
          <div className="relative flex-none">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BookOpen className="w-4.5 h-4.5 text-white" style={{ width: '1.1rem', height: '1.1rem' }} />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-card animate-pulse-glow" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="font-black text-lg leading-none bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">MangaVN</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5 whitespace-nowrap">Đọc Manga Miễn Phí</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        {showCollapse && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Promo banner */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mb-3"
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20 p-3">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 animate-gradient" />
              <div className="relative flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 flex-none" />
                <p className="text-xs font-medium text-purple-300">1000+ truyện cập nhật/tuần!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 py-2">Menu chính</p>
        )}
        {navItems.map(({ href, icon: Icon, label, color, badge }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={onClose}>
              <div className={cn(
                'relative group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer',
                active
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              )}>
                {/* Icon with gradient when active */}
                <div className={cn(
                  'flex-none flex items-center justify-center w-8 h-8 rounded-lg transition-all',
                  active
                    ? 'bg-white/15'
                    : `group-hover:bg-gradient-to-br group-hover:${color} group-hover:text-white group-hover:shadow-md`
                )}>
                  <Icon className="w-4 h-4" />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium flex-1 truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {badge && !collapsed && (
                  <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                    active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                  )}>
                    {badge}
                  </span>
                )}

                {/* Active indicator line */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom divider */}
      <div className="mx-3 my-2 h-px bg-border/60" />

      {/* User section */}
      <div className="px-2 pb-4 space-y-1">
        {user ? (
          <>
            <div className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/70 transition-colors',
              collapsed && 'justify-center'
            )}>
              <Avatar className="w-8 h-8 flex-none ring-2 ring-purple-500/30">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user.username}</p>
                    <p className="text-[10px] text-muted-foreground">Lv.{user.level} · {user.coin}🪙</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={logout}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all text-sm',
                collapsed && 'justify-center'
              )}
            >
              <LogOut className="w-4 h-4 flex-none" />
              <AnimatePresence>
                {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Đăng xuất</motion.span>}
              </AnimatePresence>
            </button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAuth(true)}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-semibold text-white transition-all',
              'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-600/20',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogIn className="w-4 h-4 flex-none" />
            <AnimatePresence>
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Đăng nhập</motion.span>}
            </AnimatePresence>
          </motion.button>
        )}
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-card/80 glass-card rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 256 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-card/80 glass-card border-r border-border/60 overflow-hidden"
      >
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} showCollapse />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-card border-r border-border z-50 flex flex-col shadow-2xl shadow-black/40"
            >
              <div className="flex justify-end p-3">
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent collapsed={false} setCollapsed={() => {}} onClose={() => setMobileOpen(false)} showCollapse={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
