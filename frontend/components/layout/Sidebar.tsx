'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Home, Library, Users, MessageSquare, Inbox,
  LogIn, LogOut, Menu, X, ChevronLeft, ChevronRight,
  Sparkles, Sun, Moon, Shield, LayoutDashboard,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { getSidebarConfig } from '@/lib/sidebar-config';
import { cn } from '@/lib/utils';

/* ─── Static nav item definitions ─── */
const NAV_DEFS = [
  { href: '/',          icon: Home,         color: 'from-blue-500 to-cyan-500',      badge: 0 },
  { href: '/library',   icon: Library,      color: 'from-purple-500 to-violet-500',  badge: 0 },
  { href: '/authors',   icon: Users,        color: 'from-pink-500 to-rose-500',      badge: 0 },
  { href: '/community', icon: MessageSquare,color: 'from-green-500 to-emerald-500',  badge: 0 },
  { href: '/inbox',     icon: Inbox,        color: 'from-orange-500 to-amber-500',   badge: 3 },
] as const;

interface SidebarContentProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onClose?: () => void;
  showCollapse?: boolean;
}

function SidebarContent({ collapsed, setCollapsed, onClose, showCollapse = true }: SidebarContentProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [showAuth, setShowAuth] = useState(false);
  const [navConfig, setNavConfig] = useState(getSidebarConfig);

  /* Re-read config when admin saves changes */
  useEffect(() => {
    const refresh = () => setNavConfig(getSidebarConfig());
    window.addEventListener('nepchu-sidebar-update', refresh);
    return () => window.removeEventListener('nepchu-sidebar-update', refresh);
  }, []);

  /* Build visible + ordered nav items */
  const navItems = navConfig
    .filter(c => c.visible)
    .map(c => {
      const def = NAV_DEFS.find(d => d.href === c.key);
      return def ? { href: c.key, icon: def.icon, label: c.label, color: def.color, badge: def.badge } : null;
    })
    .filter(Boolean) as typeof NAV_DEFS[number] & { label: string }[];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center p-4 pb-3">
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
                <p className="font-black text-lg leading-none bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Nếp Chữ</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5 whitespace-nowrap">Đọc Tiểu Thuyết Miễn Phí</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
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

                {badge > 0 && !collapsed && (
                  <span className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                    active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                  )}>
                    {badge}
                  </span>
                )}

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

        {/* Management link — role-based */}
        {user && (
          <>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 pt-4 pb-2">
                {user.role === 'admin' ? 'Hệ thống' : 'Quản lí'}
              </p>
            )}
            {user.role === 'admin' ? (
              <Link href="/dashboard/admin" onClick={onClose}>
                <div className={cn(
                  'relative group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer',
                  pathname.startsWith('/dashboard/admin')
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                )}>
                  <div className={cn(
                    'flex-none flex items-center justify-center w-8 h-8 rounded-lg transition-all',
                    pathname.startsWith('/dashboard/admin')
                      ? 'bg-white/15'
                      : 'group-hover:bg-gradient-to-br group-hover:from-red-600 group-hover:to-orange-600 group-hover:text-white group-hover:shadow-md'
                  )}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium flex-1 truncate">
                        Admin Dashboard
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {pathname.startsWith('/dashboard/admin') && (
                    <motion.div layoutId="activeIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                  )}
                </div>
              </Link>
            ) : (
              <Link href="/dashboard" onClick={onClose}>
                <div className={cn(
                  'relative group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer',
                  pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                )}>
                  <div className={cn(
                    'flex-none flex items-center justify-center w-8 h-8 rounded-lg transition-all',
                    pathname === '/dashboard'
                      ? 'bg-white/15'
                      : 'group-hover:bg-gradient-to-br group-hover:from-violet-600 group-hover:to-purple-600 group-hover:text-white group-hover:shadow-md'
                  )}>
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium flex-1 truncate">
                        Quản lí của tôi
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {pathname === '/dashboard' && (
                    <motion.div layoutId="activeIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                  )}
                </div>
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Bottom divider */}
      <div className="mx-3 my-2 h-px bg-border/60" />

      {/* User section */}
      <div className="px-2 pb-1 space-y-1">
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

      {/* Bottom toolbar: theme + collapse */}
      <div className={cn('px-2 pb-3 flex items-center gap-1', collapsed ? 'flex-col' : 'flex-row')}>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all text-sm',
            collapsed ? 'w-10 h-10 justify-center px-0' : 'flex-1'
          )}
          title={resolvedTheme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
        >
          <AnimatePresence mode="wait">
            {resolvedTheme === 'dark' ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="w-4 h-4 flex-none text-yellow-400" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="w-4 h-4 flex-none text-indigo-400" />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                {resolvedTheme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {showCollapse && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all flex-none"
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
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
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-card/80 glass-card rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      <motion.aside
        animate={{ width: collapsed ? 68 : 256 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-card/80 glass-card border-r border-border/60 overflow-hidden"
      >
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} showCollapse />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}
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
