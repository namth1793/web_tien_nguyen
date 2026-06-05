'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, BookOpen, Star, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { MOCK_COMICS } from '@/lib/data';
import { formatViews } from '@/lib/utils';

interface Author {
  name: string;
  avatar: string;
  comics: number;
  totalViews: number;
  avgRating: number;
  genres: string[];
  topComic: string;
}

interface AuthorAccum {
  name: string;
  comics: number;
  totalViews: number;
  ratings: number[];
  genres: Set<string>;
  topComic: string;
}

const authorsData: Author[] = Array.from(
  MOCK_COMICS.reduce((map, c) => {
    const existing: AuthorAccum = map.get(c.author) || { name: c.author, comics: 0, totalViews: 0, ratings: [] as number[], genres: new Set<string>(), topComic: c.title };
    existing.comics++;
    existing.totalViews += c.views;
    existing.ratings.push(c.rating);
    c.genres.forEach(g => existing.genres.add(g));
    if (c.views > (MOCK_COMICS.find(x => x.title === existing.topComic)?.views || 0)) existing.topComic = c.title;
    map.set(c.author, existing);
    return map;
  }, new Map<string, AuthorAccum>())
).map(([_, a]) => ({
  name: a.name,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.name}`,
  comics: a.comics,
  totalViews: a.totalViews,
  avgRating: Math.round((a.ratings.reduce((s: number, r: number) => s + r, 0) / a.ratings.length) * 10) / 10,
  genres: Array.from(a.genres).slice(0, 3),
  topComic: a.topComic,
})).sort((a, b) => b.totalViews - a.totalViews);

export default function AuthorsPage() {
  const [search, setSearch] = useState('');
  const filtered = authorsData.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600/10 rounded-xl">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Tác Giả</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} tác giả</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Tìm tác giả..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Authors grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((author, i) => (
          <motion.div
            key={author.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="group bg-card border border-border hover:border-purple-500/50 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-none ring-2 ring-border group-hover:ring-purple-500/50 transition-all">
                  <Image src={author.avatar} alt={author.name} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <h3 className="font-bold group-hover:text-purple-500 transition-colors">{author.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {author.genres.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-muted/50 rounded-xl">
                  <BookOpen className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                  <div className="text-sm font-bold">{author.comics}</div>
                  <div className="text-[10px] text-muted-foreground">Truyện</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-xl">
                  <Eye className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                  <div className="text-sm font-bold">{formatViews(author.totalViews)}</div>
                  <div className="text-[10px] text-muted-foreground">Lượt đọc</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-xl">
                  <Star className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
                  <div className="text-sm font-bold">{author.avgRating}</div>
                  <div className="text-[10px] text-muted-foreground">Đánh giá</div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Nổi bật:</span> {author.topComic}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
