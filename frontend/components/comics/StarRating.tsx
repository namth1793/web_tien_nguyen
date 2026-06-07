'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;        // 0–5
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SIZE = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

export default function StarRating({ value, onChange, readonly = false, size = 'md', showLabel = true }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => !readonly && setHover(0)}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const idx = i + 1;
          const filled = idx <= active;
          return (
            <motion.button
              key={i}
              type="button"
              disabled={readonly}
              whileHover={!readonly ? { scale: 1.2 } : undefined}
              whileTap={!readonly ? { scale: 0.9 } : undefined}
              onMouseEnter={() => !readonly && setHover(idx)}
              onClick={() => !readonly && onChange?.(idx)}
              className={cn(
                'transition-colors duration-100',
                readonly ? 'cursor-default' : 'cursor-pointer',
              )}
            >
              <Star
                className={cn(
                  SIZE[size],
                  filled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-transparent text-muted-foreground/40',
                  !readonly && !filled && 'hover:text-yellow-300',
                )}
              />
            </motion.button>
          );
        })}
      </div>

      {showLabel && (
        <span className={cn(
          'text-sm font-semibold tabular-nums',
          value > 0 ? 'text-yellow-500' : 'text-muted-foreground/60',
        )}>
          {value > 0 ? `${value * 2}/10` : 'Chưa đánh giá'}
        </span>
      )}
    </div>
  );
}
