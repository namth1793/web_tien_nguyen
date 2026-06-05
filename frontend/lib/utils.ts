import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

export function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

export function genreColor(genre: string): string {
  const map: Record<string, string> = {
    Action: 'bg-red-500/20 text-red-400',
    Fantasy: 'bg-purple-500/20 text-purple-400',
    Romance: 'bg-pink-500/20 text-pink-400',
    Drama: 'bg-yellow-500/20 text-yellow-400',
    Comedy: 'bg-green-500/20 text-green-400',
    Horror: 'bg-gray-500/20 text-gray-400',
    'Sci-Fi': 'bg-blue-500/20 text-blue-400',
    Cultivation: 'bg-orange-500/20 text-orange-400',
    Wuxia: 'bg-indigo-500/20 text-indigo-400',
    Mystery: 'bg-teal-500/20 text-teal-400',
    Adventure: 'bg-amber-500/20 text-amber-400',
    School: 'bg-lime-500/20 text-lime-400',
    Medical: 'bg-cyan-500/20 text-cyan-400',
    System: 'bg-violet-500/20 text-violet-400',
    Reincarnation: 'bg-rose-500/20 text-rose-400',
  };
  return map[genre] || 'bg-gray-500/20 text-gray-400';
}

export function statusLabel(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    ongoing: { label: 'Đang tiến hành', color: 'bg-green-500/20 text-green-400' },
    completed: { label: 'Hoàn thành', color: 'bg-blue-500/20 text-blue-400' },
    hiatus: { label: 'Tạm dừng', color: 'bg-yellow-500/20 text-yellow-400' },
  };
  return map[status] || { label: status, color: 'bg-gray-500/20 text-gray-400' };
}

export function xpToNextLevel(level: number): number {
  return level * 500;
}
