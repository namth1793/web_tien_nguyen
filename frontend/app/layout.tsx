import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'MangaVN — Đọc Manga Online Miễn Phí', template: '%s | MangaVN' },
  description: 'Website đọc manga, manhwa, manhua online miễn phí. Cập nhật nhanh nhất, nhiều thể loại nhất tại Việt Nam.',
  keywords: ['manga', 'manhwa', 'manhua', 'đọc truyện online', 'truyện tranh', 'MangaVN'],
  authors: [{ name: 'MangaVN' }],
  metadataBase: new URL('http://localhost:3030'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'MangaVN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <Providers>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-x-hidden">
              {children}
            </main>
            <RightSidebar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
