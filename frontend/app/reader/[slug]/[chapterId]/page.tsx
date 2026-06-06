'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, List, Minus, Plus, Sun, Moon, Feather, AlignCenter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MOCK_PARAGRAPHS = [
  'Bầu trời đêm trải dài như tấm lụa đen thêu ngàn sao, gió lạnh se sắt thổi qua những kẽ lá khô. Tống Minh đứng trên đỉnh Huyền Phong Sơn, hai tay khoanh trước ngực, mắt nhìn xa xăm vào cõi hư vô.',
  'Đã mười năm rồi. Mười năm kể từ ngày hắn bước chân vào Thiên Tôn Các với thân phận một đứa trẻ mồ côi không cha không mẹ. Mười năm sống trong bóng tối, chịu đựng sự khinh thường của bao kẻ, và cuối cùng hắn đã đứng được ở đây — đỉnh cao của cả một thế hệ.',
  '"Ngươi đến rồi," một giọng nói trầm và uy nghiêm vang lên từ phía sau. Không cần quay đầu lại, Tống Minh cũng biết đó là ai. Thiên Cơ Lão Nhân — người có thể nói là sư phụ thứ hai của hắn, cũng là người duy nhất từng đặt kỳ vọng vào hắn trong những ngày đen tối nhất.',
  '"Sư phụ." Hắn cúi đầu thi lễ, giọng điềm tĩnh không chút giao động.',
  'Thiên Cơ Lão Nhân bước đến bên cạnh, đôi mắt như sao nhìn vào xa xăm. Chòm râu bạc trắng phất phơ theo gió, trông ông như một tiên nhân thoát tục. "Ngươi đã quyết định rồi?"',
  '"Đã quyết." Tống Minh gật đầu. "Con đường của đệ tử chỉ có một — tiến lên phía trước."',
  'Lão nhân thở dài, rồi từ trong tay áo rút ra một chiếc hộp nhỏ bằng gỗ hắc đàn, trên mặt khắc hoa văn kỳ bí. "Đây là Thiên Địa Phù — vật ta giữ suốt bốn trăm năm. Hôm nay trao cho ngươi, mong ngươi dùng nó mở ra con đường mà ta không đi được."',
  'Tống Minh nhận lấy chiếc hộp, ngón tay run nhẹ. Bốn trăm năm — đó là cả một cuộc đời của bậc tiên nhân. Ông đã chờ đợi điều này bao lâu rồi?',
  '"Đa tạ sư phụ." Hắn không nói thêm gì. Đôi khi, lời nói nhiều chỉ làm nhẹ đi sức nặng của ân tình.',
  'Đêm xuống sâu hơn. Tinh tú trên bầu trời lấp lánh như ngàn ngọn nến, và đâu đó trong gió có tiếng sáo vi vút — không rõ là thực hay là mộng.',
  'Sáng hôm sau, khi ánh bình minh vừa hé rạng, Tống Minh xuống núi. Trên lưng hắn khoác một chiếc túi vải đơn giản, bên trong chỉ có vài bộ quần áo và cuốn sách tu luyện mà hắn đã đọc thuộc lòng từ lâu. Nhưng trong lòng hắn, có cả một đại lục đang chờ hắn chinh phục.',
  'Làng Vân Thủy nằm dưới chân Huyền Phong Sơn như một viên ngọc bích nhỏ bị người ta bỏ quên bên đường. Khói bếp buổi sáng bay lên lưng trời, tiếng gà gáy te te xua đi màn sương lạnh. Những đứa trẻ đã bắt đầu chạy nhảy trong những con ngõ nhỏ.',
  'Tống Minh dừng lại trước quán trà cũ quen thuộc. Bao nhiêu năm trôi qua, quán vẫn thế này — mái ngói rêu phong, cánh cửa gỗ cũ kỹ, và ông lão Vương Tứ ngồi gà gật sau quầy hàng.',
  '"Tiểu Minh?" Ông lão mở choàng mắt, rồi vội vàng đứng dậy. "Ngươi... ngươi trở về rồi à?"',
  'Hắn mỉm cười — một nụ cười ấm áp, chân thật hơn bất kỳ nụ cười nào hắn dành cho người ngoài. "Con về rồi, ông Vương. Cho con một chén trà nóng được không?"',
  'Ông lão Vương Tứ run run rót trà, hai hàng lệ lăn dài trên khuôn mặt nhăn nheo. "Mười năm rồi... mười năm... Ta cứ tưởng ngươi quên mất nơi này rồi."',
  '"Làm sao quên được," Tống Minh đỡ chén trà, lòng nhói lên một nỗi gì đó khó tả. "Đây là nơi đầu tiên cho đệ tử một bữa cơm no khi đệ tử mới xuống núi."',
  'Họ ngồi im lặng một lúc lâu, uống trà nhìn ra con đường làng buổi sáng. Không cần lời, đôi khi sự có mặt đã là đủ.',
  'Nhưng bình yên không kéo dài được lâu. Tiếng vó ngựa đập loạn xạ từ đầu làng vọng đến, rồi tiếng la hét của đám lính. Tống Minh đặt chén trà xuống, ánh mắt lạnh lại.',
  '"Họ tìm ngươi đấy," ông lão Vương Tứ thì thào, mặt tái mét.',
  '"Con biết." Hắn đứng dậy, nhẹ nhàng đặt một nắm tiền đồng lên bàn — nhiều hơn mức cần thiết rất nhiều. "Ông hãy đóng cửa quán hôm nay. Đừng ra ngoài."',
  'Rồi hắn bước ra ngoài, đối mặt với năm kỵ sĩ mặc giáp đen đang cưỡi ngựa chặn ngang đường làng. Trên ngực họ thêu huy hiệu của Diệt Thiên Bang — thế lực đã từng truy sát hắn suốt ba năm trời.',
  '"Tống Minh!" Tên đầu đội lên tiếng, giọng kiêu ngạo. "Đại ca ngươi đang chờ ngươi. Đi ngoan thì còn sống, cứng đầu thì..."',
  '"Thì sao?" Tống Minh cắt ngang, bước đi thong thả về phía họ. Không vội vàng, không sợ hãi. Đôi tay thả lỏng bên hông.',
  'Tên kỵ sĩ chưa kịp trả lời, một luồng khí tức vô hình đã tỏa ra từ người Tống Minh — mỏng manh nhưng sắc bén như lưỡi đao. Năm con ngựa đồng thời hí dài, lùi lại.',
  '"Ngươi... ngươi dám—" Tên đầu đội chưa nói xong câu, đã thấy thân hình hắn bay ngược về phía sau, đập vào bức tường đất bên đường.',
  'Bốn tên còn lại nhìn nhau, rồi đồng loạt tháo chạy. Chỉ trong nháy mắt, tiếng vó ngựa đã xa dần, hòa vào tiếng gió buổi sáng.',
  'Tống Minh đứng yên ở giữa đường, tay áo phất nhẹ. Không một giọt mồ hôi, không một nhịp thở dồn. Đây mới chỉ là bước đi đầu tiên trong chuyến hành trình dài.',
  'Phía trước, con đường dẫn đến kinh thành vẫn còn xa. Nhưng với hắn, khoảng cách chưa bao giờ là vấn đề.',
  'Hắn nhìn lên bầu trời, nơi mặt trời đang từ từ dâng cao. Một ngày mới bắt đầu. Và với Tống Minh, mỗi ngày mới là một trang truyện mới — chưa được viết, và chỉ hắn mới có thể quyết định sẽ viết gì.',
];

type BgMode = 'light' | 'sepia' | 'dark';

const BG_STYLES: Record<BgMode, { bg: string; text: string; label: string }> = {
  light: { bg: 'bg-white', text: 'text-gray-900', label: 'Sáng' },
  sepia: { bg: 'bg-[#f4ecd8]', text: 'text-[#5c4a32]', label: 'Sepia' },
  dark: { bg: 'bg-gray-950', text: 'text-gray-200', label: 'Tối' },
};

export default function ReaderPage() {
  const { slug, chapterId } = useParams<{ slug: string; chapterId: string }>();
  const router = useRouter();
  const [fontSize, setFontSize] = useState(18);
  const [bgMode, setBgMode] = useState<BgMode>('light');
  const [showNav, setShowNav] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const navTimeout = useRef<NodeJS.Timeout | null>(null);

  const chapterNum = parseInt(chapterId as string, 10);
  const titleSlug = (slug as string).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const resetNavTimer = useCallback(() => {
    setShowNav(true);
    if (navTimeout.current) clearTimeout(navTimeout.current);
    navTimeout.current = setTimeout(() => {
      if (!showSettings) setShowNav(false);
    }, 3500);
  }, [showSettings]);

  useEffect(() => {
    resetNavTimer();
    window.addEventListener('mousemove', resetNavTimer);
    window.addEventListener('touchstart', resetNavTimer);
    return () => {
      if (navTimeout.current) clearTimeout(navTimeout.current);
      window.removeEventListener('mousemove', resetNavTimer);
      window.removeEventListener('touchstart', resetNavTimer);
    };
  }, [resetNavTimer]);

  useEffect(() => {
    if (showSettings) {
      if (navTimeout.current) clearTimeout(navTimeout.current);
      setShowNav(true);
    }
  }, [showSettings]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { bg, text } = BG_STYLES[bgMode];

  return (
    <div className={cn('min-h-screen transition-colors duration-300', bg)}>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top nav */}
      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ opacity: 0, y: -56 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -56 }}
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
                <p className="text-sm font-semibold text-white">Chương {chapterNum}</p>
                <p className="text-xs text-gray-400 truncate max-w-[200px]">{titleSlug}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(s => !s)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  showSettings ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                )}
              >
                <AlignCenter className="w-4 h-4" />
                <span className="hidden sm:inline">Tùy chỉnh</span>
              </button>
              <Link href="/">
                <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                  <Home className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-gray-900/98 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-4 w-[320px]"
          >
            {/* Font size */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Cỡ chữ</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(s => Math.max(14, s - 1))}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm text-white font-bold w-8 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(s => Math.min(28, s + 1))}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Background mode */}
            <div>
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2">Nền trang</span>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(BG_STYLES) as [BgMode, typeof BG_STYLES[BgMode]][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setBgMode(key)}
                    className={cn(
                      'px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
                      val.bg, val.text,
                      bgMode === key ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-gray-700 hover:border-gray-500'
                    )}
                  >
                    {key === 'light' && <Sun className="w-3.5 h-3.5 mx-auto mb-0.5" />}
                    {key === 'sepia' && <Feather className="w-3.5 h-3.5 mx-auto mb-0.5" />}
                    {key === 'dark' && <Moon className="w-3.5 h-3.5 mx-auto mb-0.5" />}
                    {val.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div ref={contentRef} className="max-w-2xl mx-auto px-5 pt-20 pb-28">
        {/* Chapter header */}
        <div className={cn('text-center mb-10 pb-8 border-b', bgMode === 'dark' ? 'border-gray-800' : bgMode === 'sepia' ? 'border-[#c8a882]' : 'border-gray-200')}>
          <p className={cn('text-xs font-bold uppercase tracking-widest mb-2', bgMode === 'dark' ? 'text-purple-400' : 'text-purple-600')}>
            {titleSlug}
          </p>
          <h1 className={cn('text-2xl font-bold mb-1', text)}>Chương {chapterNum}</h1>
          <p className={cn('text-sm', bgMode === 'dark' ? 'text-gray-500' : 'text-gray-500')}>
            {['Khởi Đầu', 'Bước Ngoặt', 'Đại Chiến', 'Bí Mật', 'Hành Trình', 'Giác Ngộ', 'Trở Về', 'Quyết Định'][((chapterNum - 1) % 8)]}
          </p>
        </div>

        {/* Novel text */}
        <div className="space-y-5">
          {MOCK_PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025, ease: 'easeOut' }}
              className={cn('leading-relaxed text-justify', text)}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* End of chapter marker */}
        <div className={cn('text-center mt-12 mb-4', bgMode === 'dark' ? 'text-gray-600' : 'text-gray-400')}>
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className={cn('h-px flex-1', bgMode === 'dark' ? 'bg-gray-800' : bgMode === 'sepia' ? 'bg-[#c8a882]' : 'bg-gray-200')} />
            <span className="text-xs font-medium">❦ Hết chương {chapterNum} ❦</span>
            <div className={cn('h-px flex-1', bgMode === 'dark' ? 'bg-gray-800' : bgMode === 'sepia' ? 'bg-[#c8a882]' : 'bg-gray-200')} />
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <AnimatePresence>
        {showNav && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 flex items-center justify-between px-4 py-3"
          >
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 gap-2"
              onClick={() => chapterNum > 1 && router.push(`/reader/${slug}/${chapterNum - 1}`)}
              disabled={chapterNum <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Chương trước
            </Button>

            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs text-gray-500">Chương {chapterNum}</span>
              <div className="flex items-center gap-1">
                <div className="w-20 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-600">{Math.round(progress)}%</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 gap-2"
              onClick={() => router.push(`/reader/${slug}/${chapterNum + 1}`)}
            >
              Chương tiếp
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
