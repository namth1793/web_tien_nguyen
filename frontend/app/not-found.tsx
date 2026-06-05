import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="text-8xl mb-6">📚</div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-3">Trang không tồn tại</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Trang bạn đang tìm kiếm có thể đã bị xóa hoặc chưa từng tồn tại.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="gradient" className="gap-2">
            <Home className="w-4 h-4" />
            Về trang chủ
          </Button>
        </Link>
        <Link href="/library">
          <Button variant="outline" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Thư viện
          </Button>
        </Link>
      </div>
    </div>
  );
}
