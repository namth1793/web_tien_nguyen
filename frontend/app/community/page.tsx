'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Reply, ThumbsUp, Flame, Star, TrendingUp, MessageCircle, Award, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MOCK_COMICS } from '@/lib/data';
import { formatDate, cn } from '@/lib/utils';

interface Post {
  id: number;
  author: { name: string; avatar: string; level: number };
  comic: { title: string; slug: string; cover: string };
  content: string;
  likes: number;
  replies: number;
  createdAt: string;
  type: 'review' | 'discussion' | 'recommendation';
}

const POSTS: Post[] = [
  { id: 1, author: { name: 'TruyenFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TruyenFan', level: 15 }, comic: { title: MOCK_COMICS[0].title, slug: MOCK_COMICS[0].slug, cover: MOCK_COMICS[0].cover }, content: 'Truyện này quá xuất sắc! Cốt truyện chặt chẽ, nhân vật được xây dựng rất sâu sắc. Chap mới nhất thực sự làm tôi ngạc nhiên hoàn toàn. Ai chưa đọc thì phải đọc ngay đi!', likes: 142, replies: 28, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), type: 'review' },
  { id: 2, author: { name: 'DragonReader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DragonReader', level: 8 }, comic: { title: MOCK_COMICS[1].title, slug: MOCK_COMICS[1].slug, cover: MOCK_COMICS[1].cover }, content: 'Ai đang follow truyện này không? Plot twist ở chap 85 làm tôi sốc thật sự. Cực kỳ khuyến khích mọi người đọc thể loại này. Tác giả thật tài năng!', likes: 89, replies: 15, createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), type: 'discussion' },
  { id: 3, author: { name: 'SakuraReader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SakuraReader', level: 22 }, comic: { title: MOCK_COMICS[9].title, slug: MOCK_COMICS[9].slug, cover: MOCK_COMICS[9].cover }, content: 'Đây là một trong những bộ hay nhất tôi từng đọc. Thế giới quan rộng lớn, hệ thống tu tiên rất độc đáo. Rating 9.4 hoàn toàn xứng đáng. Cảm ơn tác giả đã cho ra đời kiệt tác này!', likes: 234, replies: 47, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), type: 'review' },
  { id: 4, author: { name: 'NightOwl', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NightOwl', level: 5 }, comic: { title: MOCK_COMICS[3].title, slug: MOCK_COMICS[3].slug, cover: MOCK_COMICS[3].cover }, content: 'Gợi ý mọi người thể loại magic system cực kỳ hay. Nếu bạn thích fantasy có hệ thống phép thuật rõ ràng và logic thì đây là cái bạn cần tìm!', likes: 67, replies: 12, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'recommendation' },
];

const TOP_USERS = [
  { name: 'SakuraReader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SakuraReader', posts: 234, level: 22 },
  { name: 'TruyenFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TruyenFan', posts: 187, level: 15 },
  { name: 'DragonReader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DragonReader', posts: 143, level: 8 },
  { name: 'NightOwl', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NightOwl', posts: 98, level: 5 },
];

const typeBadge = { review: { label: 'Review', color: 'bg-yellow-500/20 text-yellow-500', icon: Star }, discussion: { label: 'Thảo luận', color: 'bg-blue-500/20 text-blue-500', icon: MessageCircle }, recommendation: { label: 'Gợi ý', color: 'bg-green-500/20 text-green-500', icon: ThumbsUp } };

export default function CommunityPage() {
  const [filter, setFilter] = useState<'all' | 'review' | 'discussion' | 'recommendation'>('all');
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const displayed = filter === 'all' ? POSTS : POSTS.filter(p => p.type === filter);

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-600/10 rounded-xl">
          <MessageSquare className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Cộng Đồng</h1>
          <p className="text-sm text-muted-foreground">Chia sẻ cảm nhận, thảo luận về tiểu thuyết yêu thích</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        <div>
          {/* Post composer */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-6">
            <div className="flex gap-3">
              <Avatar className="w-9 h-9 flex-none">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder="Chia sẻ cảm nhận về bộ truyện bạn đang đọc..."
                  className="w-full h-20 bg-muted/50 rounded-xl p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-muted-foreground"
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="gradient" disabled={!newPost.trim()}>
                    <Send className="w-3.5 h-3.5" />
                    Đăng
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {(['all', 'review', 'discussion', 'recommendation'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-1.5 rounded-xl text-sm font-medium transition-all',
                  filter === f ? 'bg-purple-600 text-white' : 'bg-muted hover:bg-muted/80'
                )}
              >
                {{ all: 'Tất cả', review: 'Review', discussion: 'Thảo luận', recommendation: 'Gợi ý' }[f]}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {displayed.map((post, i) => {
              const badge = typeBadge[post.type];
              const Icon = badge.icon;
              return (
                <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-purple-500/30 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{post.author.name}</span>
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full">Lv.{post.author.level}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                    <span className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full', badge.color)}>
                      <Icon className="w-3 h-3" /> {badge.label}
                    </span>
                  </div>

                  {/* Comic reference */}
                  <Link href={`/comic/${post.comic.slug}`}>
                    <div className="flex items-center gap-2.5 p-2.5 bg-muted/50 rounded-xl mb-3 hover:bg-muted transition-colors">
                      <div className="relative w-10 h-12 rounded-lg overflow-hidden flex-none">
                        <Image src={post.comic.cover} alt={post.comic.title} fill className="object-cover" unoptimized />
                      </div>
                      <span className="text-sm font-medium text-purple-500">{post.comic.title}</span>
                    </div>
                  </Link>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={cn('flex items-center gap-1.5 text-sm transition-colors', likedPosts.has(post.id) ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500')}
                    >
                      <Heart className={cn('w-4 h-4', likedPosts.has(post.id) && 'fill-current')} />
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-purple-500 transition-colors">
                      <Reply className="w-4 h-4" />
                      {post.replies} trả lời
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Community stats */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Thống kê hôm nay
            </h3>
            {[
              { label: 'Bài viết mới', value: '127', color: 'text-purple-500' },
              { label: 'Thành viên online', value: '1,234', color: 'text-green-500' },
              { label: 'Bình luận mới', value: '3,456', color: 'text-blue-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className={cn('font-bold text-sm', color)}>{value}</span>
              </div>
            ))}
          </div>

          {/* Top contributors */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              Top thành viên
            </h3>
            <div className="space-y-2">
              {TOP_USERS.map((u, i) => (
                <div key={u.name} className="flex items-center gap-2.5">
                  <span className={cn('text-xs font-bold w-5 text-center', i === 0 && 'text-yellow-500', i === 1 && 'text-gray-400', i === 2 && 'text-orange-500')}>
                    #{i + 1}
                  </span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback>{u.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-xs font-medium">{u.name}</div>
                    <div className="text-[10px] text-muted-foreground">{u.posts} bài · Lv.{u.level}</div>
                  </div>
                  {i < 3 && <Award className={cn('w-4 h-4', i === 0 && 'text-yellow-500', i === 1 && 'text-gray-400', i === 2 && 'text-orange-500')} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
