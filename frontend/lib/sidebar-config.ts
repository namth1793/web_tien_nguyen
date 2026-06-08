export interface SidebarItemConfig {
  key: string;       // href dùng làm key
  label: string;
  visible: boolean;
  order: number;
}

const DEFAULT: SidebarItemConfig[] = [
  { key: '/',          label: 'Trang Chủ',  visible: true, order: 0 },
  { key: '/library',   label: 'Thư Viện',   visible: true, order: 1 },
  { key: '/authors',   label: 'Tác Giả',    visible: true, order: 2 },
  { key: '/community', label: 'Cộng Đồng',  visible: true, order: 3 },
  { key: '/inbox',     label: 'Thông Báo',  visible: true, order: 4 },
];

const KEY = 'nepchu_sidebar_config';

export function getSidebarConfig(): SidebarItemConfig[] {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const saved: SidebarItemConfig[] = JSON.parse(raw);
    // merge: keep defaults for any missing key
    return DEFAULT.map(d => {
      const found = saved.find(s => s.key === d.key);
      return found ? { ...d, ...found } : d;
    }).sort((a, b) => a.order - b.order);
  } catch { return DEFAULT; }
}

export function setSidebarConfig(items: SidebarItemConfig[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('nepchu-sidebar-update'));
}

export function resetSidebarConfig() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent('nepchu-sidebar-update'));
}
