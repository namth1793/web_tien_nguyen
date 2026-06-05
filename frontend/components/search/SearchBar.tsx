'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Filter, ChevronDown, Command } from 'lucide-react';
import { RECENT_SEARCHES, ALL_GENRES } from '@/lib/data';
import { cn } from '@/lib/utils';

const TRENDING = ['Đấu La Đại Lục', 'Kiếm Lai', 'Toàn Chức Pháp Sư', 'Ma Đạo Tổ Sư'];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setFocused(false);
        setShowFilter(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (q?: string) => {
    const s = q || query;
    if (!s.trim()) return;
    router.push(`/library?search=${encodeURIComponent(s)}`);
    setFocused(false);
    setQuery(s);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Main search input */}
      <div className={cn(
        'flex items-center gap-2 rounded-2xl border transition-all duration-300 overflow-hidden bg-card',
        focused
          ? 'border-purple-500/70 shadow-xl shadow-purple-500/10 ring-4 ring-purple-500/10'
          : 'border-border/60 hover:border-purple-400/40 shadow-sm hover:shadow-md'
      )}>
        <div className={cn('ml-4 transition-colors', focused ? 'text-purple-500' : 'text-muted-foreground')}>
          <Search className="w-4.5 h-4.5" style={{ width: '1.1rem', height: '1.1rem' }} />
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Tìm tên truyện, tác giả..."
          className="flex-1 py-3.5 pr-2 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />

        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="p-1.5 mr-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="h-5 w-px bg-border/60" />

        <button
          onClick={() => { setShowFilter(!showFilter); setFocused(false); }}
          className={cn(
            'flex items-center gap-1.5 px-3 py-3.5 text-xs font-medium transition-colors whitespace-nowrap',
            showFilter ? 'text-purple-500' : 'text-muted-foreground hover:text-foreground',
            selectedGenre && 'text-purple-500'
          )}
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{selectedGenre || 'Thể loại'}</span>
          <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', showFilter && 'rotate-180')} />
        </button>

        <button
          onClick={() => handleSearch()}
          className="mr-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-600/20 transition-all hover:scale-105 active:scale-95"
        >
          Tìm
        </button>
      </div>

      <AnimatePresence>
        {/* Search suggestions dropdown */}
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full mt-2 w-full bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50"
          >
            {query ? (
              <div className="p-3">
                <button
                  onClick={() => handleSearch()}
                  className="flex items-center gap-3 w-full p-3 hover:bg-purple-500/10 rounded-xl transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-none">
                    <Search className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tìm kiếm "<span className="text-purple-500">{query}</span>"</p>
                    <p className="text-xs text-muted-foreground">Nhấn Enter để tìm</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="p-3 space-y-4">
                {/* Recent */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 mb-2">Tìm kiếm gần đây</p>
                  {RECENT_SEARCHES.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSearch(s)}
                      className="flex items-center gap-2.5 w-full px-2 py-2 hover:bg-muted/60 rounded-xl transition-colors text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-none">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-sm group-hover:text-foreground text-muted-foreground">{s}</span>
                    </button>
                  ))}
                </div>

                {/* Trending */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 mb-2">Đang trending 🔥</p>
                  <div className="flex flex-wrap gap-2 px-1">
                    {TRENDING.map((s, i) => (
                      <button
                        key={s}
                        onClick={() => handleSearch(s)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-500 dark:text-orange-400 rounded-full text-xs font-semibold hover:from-orange-500/20 hover:to-amber-500/20 transition-all"
                      >
                        <span className="font-black">{i + 1}</span> {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-2 pb-1">
                  <p className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                    <Command className="w-3 h-3" /> Enter để tìm kiếm
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Genre filter */}
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute top-full mt-2 right-0 w-72 bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/20 p-4 z-50"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">Lọc theo thể loại</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => { setSelectedGenre(''); setShowFilter(false); }}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  !selectedGenre ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                )}
              >Tất cả</button>
              {ALL_GENRES.map(g => (
                <button
                  key={g}
                  onClick={() => { setSelectedGenre(g); setShowFilter(false); router.push(`/library?genre=${g}`); }}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                    selectedGenre === g ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  )}
                >{g}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
