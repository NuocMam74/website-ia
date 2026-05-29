import { useEffect, useState } from 'react';

type ToastVariant = 'success' | 'info' | 'error';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastEventDetail {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

declare global {
  interface Window {
    showToast?: (message: string, opts?: { variant?: ToastVariant; duration?: number }) => void;
  }
  interface WindowEventMap {
    'toast:show': CustomEvent<ToastEventDetail>;
  }
}

let counter = 0;

/**
 * Provider de toasts global. À placer une seule fois dans BaseLayout.
 * Pour déclencher : window.showToast('Ajouté au panier')
 * ou dispatchEvent(new CustomEvent('toast:show', { detail: { message: '…' }}))
 */
export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const dismiss = (id: number) => {
      setToasts((curr) => curr.filter((t) => t.id !== id));
    };

    const show = (message: string, opts: { variant?: ToastVariant; duration?: number } = {}) => {
      const id = ++counter;
      const variant = opts.variant ?? 'success';
      setToasts((curr) => [...curr, { id, message, variant }]);
      const ttl = opts.duration ?? 3500;
      window.setTimeout(() => dismiss(id), ttl);
    };

    window.showToast = show;
    const onEvent = (e: CustomEvent<ToastEventDetail>) => {
      show(e.detail.message, { variant: e.detail.variant, duration: e.detail.duration });
    };
    window.addEventListener('toast:show', onEvent as EventListener);

    return () => {
      window.removeEventListener('toast:show', onEvent as EventListener);
      delete window.showToast;
    };
  }, []);

  const variantClass: Record<ToastVariant, string> = {
    success: 'border-teal-400/40 bg-ink-900/95 text-ink-50 shadow-[0_0_30px_-8px_rgba(0,217,255,0.45)]',
    info: 'border-ink-700 bg-ink-900/95 text-ink-50',
    error: 'border-coral-400/40 bg-ink-900/95 text-ink-50 shadow-[0_0_30px_-8px_rgba(255,61,127,0.45)]',
  };
  const dotClass: Record<ToastVariant, string> = {
    success: 'bg-teal-400',
    info: 'bg-ink-300',
    error: 'bg-coral-400',
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item pointer-events-auto flex items-center gap-3 rounded-lg border backdrop-blur px-4 py-3 min-w-[260px] max-w-sm ${variantClass[toast.variant]}`}
          style={{
            animation: 'toast-in 220ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass[toast.variant]} shrink-0`} aria-hidden="true" />
          <span className="text-small leading-snug flex-1">{toast.message}</span>
        </div>
      ))}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .toast-item { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
