import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface Props {
  labelDark?: string;
  labelLight?: string;
}

/**
 * Bouton de bascule du thème (clair/sombre).
 *
 * Le thème initial est appliqué par un script inline dans BaseLayout
 * pour éviter le flash. Ce composant lit l'attribut `data-theme` posé
 * et expose un toggle persisté en localStorage.
 */
export default function ThemeToggle({
  labelDark = 'Passer en mode sombre',
  labelLight = 'Passer en mode clair',
}: Props) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = document.documentElement.getAttribute('data-theme') as Theme | null;
    setTheme(current === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme.preference', next); } catch {}
    setTheme(next);
    document.documentElement.dispatchEvent(new CustomEvent('theme:change', { detail: next }));
  };

  // Pendant le SSR / avant montage : on rend un placeholder neutre
  // pour éviter le mismatch d'hydratation.
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={labelLight}
        className="inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? labelLight : labelDark}
      title={isDark ? labelLight : labelDark}
      className="theme-toggle relative inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-300 hover:text-ink-50 hover:bg-ink-800 transition-colors cursor-pointer overflow-hidden"
    >
      {/* Soleil (visible en dark, on bascule vers clair) */}
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
        className="theme-icon-sun absolute"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)',
          transition: 'opacity 200ms ease, transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
      </svg>

      {/* Lune (visible en light, on bascule vers sombre) */}
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
        className="theme-icon-moon absolute"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(-90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
          transition: 'opacity 200ms ease, transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
  );
}
