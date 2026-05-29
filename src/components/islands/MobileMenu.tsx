import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowRight, Search } from 'lucide-react';
import type { Lang } from '~/lib/i18n';

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  lang: Lang;
  items: NavItem[];
  contactHref: string;
  contactLabel: string;
  openLabel: string;
  closeLabel: string;
}

/**
 * Menu mobile : burger qui ouvre un panneau plein écran avec la nav.
 * - Ferme à l'échappement et au clic en dehors.
 * - Bloque le scroll du body quand ouvert.
 * - Trap basique du focus (premier élément focusé à l'ouverture).
 */
export default function MobileMenu({
  lang,
  items,
  contactHref,
  contactLabel,
  openLabel,
  closeLabel,
}: Props) {
  const searchLabel = lang === 'fr' ? 'Rechercher' : 'Search';
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors"
        aria-label={openLabel}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
      >
        <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
      </button>

      {open && (
        <div
          id="mobile-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label={openLabel}
          className="fixed inset-0 z-50 bg-ink-900 flex flex-col"
        >
          <div className="h-16 px-6 flex items-center justify-end gap-2 border-b border-ink-800">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                window.setTimeout(() => window.dispatchEvent(new CustomEvent('cmdk:open')), 50);
              }}
              className="inline-flex items-center justify-center w-10 h-10 rounded-md text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors"
              aria-label={searchLabel}
            >
              <Search size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-md text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors"
              aria-label={closeLabel}
            >
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Principale" className="flex-1 px-6 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block px-3 py-3 text-h3 text-ink-50 hover:bg-ink-800 rounded-md transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-6 border-t border-ink-800">
            <a
              href={contactHref}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-ink-950 bg-ink-50 hover:bg-ink-100 rounded-md transition-colors"
            >
              {contactLabel}
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
