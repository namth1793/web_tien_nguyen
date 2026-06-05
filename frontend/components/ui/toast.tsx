'use client';
import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn('fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-[380px] flex-col gap-2 p-4', className)}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & { variant?: 'default' | 'success' | 'error' | 'info' }
>(({ className, variant = 'default', ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border p-4 shadow-xl transition-all',
      'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-full',
      {
        'bg-card border-border': variant === 'default',
        'bg-green-950 border-green-800 text-green-200': variant === 'success',
        'bg-red-950 border-red-800 text-red-200': variant === 'error',
        'bg-blue-950 border-blue-800 text-blue-200': variant === 'info',
      },
      className
    )}
    {...props}
  />
));
Toast.displayName = ToastPrimitive.Root.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn('text-xs opacity-80', className)} {...props} />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn('shrink-0 rounded-full p-1 opacity-50 hover:opacity-100 transition-opacity', className)}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

// Hook
interface ToastMessage { id: string; title: string; description?: string; variant?: 'default' | 'success' | 'error' | 'info' }
const toastEvents: ((msg: ToastMessage) => void)[] = [];
export function toast(msg: Omit<ToastMessage, 'id'>) {
  toastEvents.forEach(fn => fn({ ...msg, id: Math.random().toString(36).slice(2) }));
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  React.useEffect(() => {
    const fn = (msg: ToastMessage) => {
      setToasts(prev => [...prev, msg]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== msg.id)), 4000);
    };
    toastEvents.push(fn);
    return () => { const i = toastEvents.indexOf(fn); if (i > -1) toastEvents.splice(i, 1); };
  }, []);

  const icons = { success: <CheckCircle2 className="w-4 h-4 text-green-400" />, error: <AlertCircle className="w-4 h-4 text-red-400" />, info: <Info className="w-4 h-4 text-blue-400" />, default: null };

  return (
    <ToastProvider>
      {toasts.map(t => (
        <Toast key={t.id} variant={t.variant} open>
          <div className="flex items-start gap-2 flex-1">
            {icons[t.variant || 'default']}
            <div>
              <ToastTitle>{t.title}</ToastTitle>
              {t.description && <ToastDescription>{t.description}</ToastDescription>}
            </div>
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport };
