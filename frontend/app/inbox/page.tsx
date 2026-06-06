'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BookOpen, Star, MessageSquare, Heart, Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDate, cn } from '@/lib/utils';

interface Notification {
  id: number;
  type: 'chapter' | 'like' | 'comment' | 'follow';
  title: string;
  body: string;
  avatar?: string;
  read: boolean;
  createdAt: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'chapter', title: 'Chương mới: Kiếm Lai', body: 'Chương 156: Kiếm Đạo Tột Đỉnh đã được cập nhật!', read: false, createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 2, type: 'chapter', title: 'Chương mới: Đấu La Đại Lục', body: 'Chương 300: Thiên Đấu Đài vừa ra mắt!', read: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 3, type: 'like', title: 'TruyenFan đã thích bình luận của bạn', body: '"Truyện này quá hay!" — trong Toàn Chức Pháp Sư', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TruyenFan', read: false, createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: 4, type: 'comment', title: 'DragonReader đã trả lời bình luận của bạn', body: 'Đồng ý với bạn, chap đó cực hay!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DragonReader', read: true, createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: 5, type: 'follow', title: 'SakuraReader đã theo dõi bạn', body: 'Bây giờ bạn có 12 người theo dõi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SakuraReader', read: true, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 6, type: 'chapter', title: 'Chương mới: Ma Đạo Tổ Sư', body: 'Chương 200: Ngoại Truyện Kết Thúc — phần cuối đã cập nhật', read: true, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
];

const icons = { chapter: BookOpen, like: Heart, comment: MessageSquare, follow: Star };
const iconColors = { chapter: 'text-purple-500 bg-purple-500/10', like: 'text-rose-500 bg-rose-500/10', comment: 'text-blue-500 bg-blue-500/10', follow: 'text-yellow-500 bg-yellow-500/10' };

export default function InboxPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="p-4 lg:p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-600/10 rounded-xl relative">
            <Bell className="w-6 h-6 text-orange-600" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unread}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Thông Báo</h1>
            <p className="text-sm text-muted-foreground">{unread} chưa đọc</p>
          </div>
        </div>
        {unread > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-2 text-sm">
            <CheckCheck className="w-4 h-4" />
            Đọc tất cả
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n, i) => {
          const Icon = icons[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => markRead(n.id)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-2xl cursor-pointer transition-all border',
                n.read ? 'border-border bg-transparent hover:bg-muted/30' : 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10'
              )}
            >
              <div className={cn('p-2 rounded-xl flex-none', iconColors[n.type])}>
                <Icon className="w-4 h-4" />
              </div>
              {n.avatar && (
                <Avatar className="w-8 h-8 flex-none">
                  <AvatarImage src={n.avatar} />
                  <AvatarFallback>{n.title[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn('text-sm font-medium', n.read ? '' : 'text-foreground')}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-purple-500 rounded-full flex-none mt-1" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">{formatDate(n.createdAt)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
