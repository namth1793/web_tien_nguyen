'use client';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ComicCard from './ComicCard';
import { ComicCardSkeleton } from '@/components/ui/skeleton';
import type { Comic } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ComicCarouselProps {
  title: string;
  subtitle?: string;
  comics: Comic[];
  loading?: boolean;
  icon?: React.ReactNode;
  gradient?: string;
}

export default function ComicCarousel({ title, subtitle, comics, loading, icon, gradient = 'from-purple-500 to-pink-500' }: ComicCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) { el.addEventListener('scroll', update); update(); }
    return () => el?.removeEventListener('scroll', update);
  }, [comics]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg text-white', gradient)}>
              <span className="[&_svg]:w-4.5 [&_svg]:h-4.5" style={{ fontSize: '1.1rem' }}>{icon}</span>
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            disabled={!canLeft}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 border',
              canLeft
                ? 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:scale-110'
                : 'border-border/40 text-muted-foreground/40 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canRight}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 border',
              canRight
                ? 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:scale-110'
                : 'border-border/40 text-muted-foreground/40 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-none w-44"><ComicCardSkeleton /></div>
            ))
          : comics.map((comic, i) => (
              <motion.div
                key={comic.id}
                className="flex-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
              >
                <ComicCard comic={comic} size="md" />
              </motion.div>
            ))
        }
      </div>
    </section>
  );
}
