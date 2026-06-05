'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, List, Settings, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ReaderPage() {
  const { slug, chapterId } = useParams<{ slug: string; chapterId: string }>();
  const [pages] = useState(Array.from({ length: 20 }, (_, i) => `https://picsum.photos/seed/ch${chapterId}p${i + 1}/800/1200`));
  const [zoom, setZoom] = useState(100);
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const hide = () => { timeout = setTimeout(() => setShowNav(false), 3000); };
    const show = () => { setShowNav(true); clearTimeout(timeout); hide(); };
    hide();
    window.addEventListener('mousemove', show);
    window.addEventListener('click', show);
    return () => { clearTimeout(timeout); window.removeEventListener('mousemove', show); window.removeEventListener('click', show); };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top nav */}
      <motion.div
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -60 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <Link href={`/comic/${slug}`}>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white gap-2">
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Chương {chapterId}</p>
            <p className="text-xs text-gray-400">{slug.replace(/-/g, ' ')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-300 min-w-[3rem] text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(100)} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <Link href={`/comic/${slug}`}>
            <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Pages */}
      <div className="flex-1 pt-14 pb-20 flex flex-col items-center gap-1">
        {pages.map((page, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
            style={{ width: `min(${zoom}%, 900px)`, maxWidth: '100%' }}
          >
            <Image
              src={page}
              alt={`Trang ${i + 1}`}
              width={800}
              height={1200}
              className="w-full h-auto"
              style={{ display: 'block' }}
              unoptimized
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom nav */}
      <motion.div
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : 60 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 flex items-center justify-between px-4 py-3"
      >
        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 gap-2">
          <ChevronLeft className="w-4 h-4" />
          Chương trước
        </Button>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>20 trang</span>
        </div>

        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 gap-2">
          Chương tiếp
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
}
