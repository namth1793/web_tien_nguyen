'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, Loader2, Sparkles, ArrowLeft, Shield } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/toast';

type Tab = 'login' | 'register' | 'forgot';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: Tab;
}

export default function AuthModal({ open, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast({ title: 'Đăng nhập thành công!', variant: 'success' });
      onClose();
    } catch (err: unknown) {
      toast({ title: 'Đăng nhập thất bại', description: err instanceof Error ? err.message : 'Vui lòng thử lại', variant: 'error' });
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirm) { toast({ title: 'Mật khẩu không khớp', variant: 'error' }); return; }
    setLoading(true);
    try {
      await register(regForm.username, regForm.email, regForm.password);
      toast({ title: 'Chào mừng đến Nếp Chữ! 🎉', variant: 'success' });
      onClose();
    } catch (err: unknown) {
      toast({ title: 'Đăng ký thất bại', description: err instanceof Error ? err.message : 'Vui lòng thử lại', variant: 'error' });
    } finally { setLoading(false); }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Email đã được gửi!', description: `Kiểm tra hộp thư ${forgotEmail}`, variant: 'info' });
    setTab('login');
  };

  const inputClass = 'h-11 bg-muted/50 border-muted focus:border-purple-500/50 rounded-xl text-sm placeholder:text-muted-foreground/60';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden bg-card border-border/60">
        {/* Header gradient */}
        <div className="relative overflow-hidden px-6 pt-7 pb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-transparent" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Nếp Chữ</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                <h2 className="text-2xl font-black mb-1">
                  {tab === 'login' ? 'Chào mừng trở lại' : tab === 'register' ? 'Tạo tài khoản' : 'Quên mật khẩu'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {tab === 'login' ? 'Đăng nhập để tiếp tục đọc truyện' : tab === 'register' ? 'Miễn phí · Nhanh chóng · Không quảng cáo' : 'Nhập email để đặt lại mật khẩu'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Tabs */}
        {tab !== 'forgot' && (
          <div className="px-6 mb-5">
            <div className="flex gap-0.5 p-1 bg-muted/60 rounded-2xl">
              {(['login', 'register'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="relative flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all"
                >
                  {tab === t && (
                    <motion.div
                      layoutId="tabBg"
                      className="absolute inset-0 bg-background rounded-xl shadow-sm"
                    />
                  )}
                  <span className={`relative z-10 ${tab === t ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {t === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Forms */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {tab === 'login' && (
              <motion.form key="login" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }} onSubmit={handleLogin} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className={`${inputClass} pl-9`} type="email" placeholder="Email" value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className={`${inputClass} pl-9 pr-10`} type={showPw ? 'text' : 'password'} placeholder="Mật khẩu"
                    value={loginForm.password} onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))} required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => setTab('forgot')} className="text-xs text-purple-500 hover:text-purple-400 transition-colors">
                    Quên mật khẩu?
                  </button>
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Đăng nhập'}
                </motion.button>

                <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                  <p className="text-[11px] text-center text-muted-foreground">
                    <span className="font-semibold text-purple-400">Demo:</span> fan@nepchu.vn · <span className="font-mono">password123</span>
                  </p>
                </div>
              </motion.form>
            )}

            {tab === 'register' && (
              <motion.form key="register" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }} onSubmit={handleRegister} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className={`${inputClass} pl-9`} placeholder="Tên người dùng" value={regForm.username}
                    onChange={e => setRegForm(p => ({ ...p, username: e.target.value }))} required />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className={`${inputClass} pl-9`} type="email" placeholder="Email" value={regForm.email}
                    onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className={`${inputClass} pl-9`} type={showPw ? 'text' : 'password'} placeholder="Mật khẩu (min. 8 ký tự)"
                    value={regForm.password} onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))} required />
                </div>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className={`${inputClass} pl-9`} type="password" placeholder="Xác nhận mật khẩu"
                    value={regForm.confirm} onChange={e => setRegForm(p => ({ ...p, confirm: e.target.value }))} required />
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Tạo tài khoản</>}
                </motion.button>

                <p className="text-[11px] text-center text-muted-foreground">
                  Bằng cách đăng ký, bạn đồng ý với{' '}
                  <span className="text-purple-500 cursor-pointer hover:underline">Điều khoản dịch vụ</span>
                </p>
              </motion.form>
            )}

            {tab === 'forgot' && (
              <motion.form key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleForgot} className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">Nhập địa chỉ email bạn đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu.</p>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className={`${inputClass} pl-9`} type="email" placeholder="Email của bạn"
                    value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                </div>
                <button type="submit" className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-600/20 text-sm">
                  Gửi email đặt lại
                </button>
                <button type="button" onClick={() => setTab('login')}
                  className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                  <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
