import { useEffect, useMemo, useRef, useState } from 'react';
import type { Lang } from '~/lib/i18n';

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  href: string;
  group: string;
  keywords?: string;
}

interface Props {
  lang: Lang;
  items: CommandItem[];
}

/**
 * Palette de commandes ouverte par ⌘K / Ctrl+K.
 * Recherche fuzzy basique (matching séquentiel des caractères).
 */
function fuzzyScore(query: string, text: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return 100 - t.indexOf(q);
  let qi = 0;
  let score = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      qi++;
      score += 1;
    }
  }
  return qi === q.length ? score : -1;
}

export default function CommandPalette({ lang, items }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const labels = lang === 'fr'
    ? { placeholder: 'Rechercher pages, produits, ressources…', empty: 'Aucun résultat', tipOpen: 'Ouvrir', tipNav: 'Naviguer', tipClose: 'Fermer' }
    : { placeholder: 'Search pages, products, resources…', empty: 'No results', tipOpen: 'Open', tipNav: 'Navigate', tipClose: 'Close' };

  // Ouverture / fermeture clavier
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Trigger custom (bouton dans le header)
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('cmdk:open', onOpen);
    return () => window.removeEventListener('cmdk:open', onOpen);
  }, []);

  // Focus input à l'ouverture
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return items
      .map((it) => ({
        item: it,
        score: Math.max(
          fuzzyScore(query, it.label),
          fuzzyScore(query, it.group),
          it.keywords ? fuzzyScore(query, it.keywords) : -1,
          it.hint ? fuzzyScore(query, it.hint) : -1,
        ),
      }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  }, [items, query]);

  // Reset cursor si query change
  useEffect(() => {
    setActive(0);
  }, [query]);

  // Scroll element actif en vue
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-cmdk-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    results.forEach((it) => {
      const arr = map.get(it.group) ?? [];
      arr.push(it);
      map.set(it.group, arr);
    });
    return Array.from(map.entries());
  }, [results]);

  const flatList = useMemo(() => grouped.flatMap(([, list]) => list), [grouped]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(flatList.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = flatList[active];
      if (target) {
        window.location.href = target.href;
        setOpen(false);
      }
    }
  };

  if (!open) return null;

  let flatIdx = -1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.placeholder}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        background: 'rgba(9, 11, 16, 0.74)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'cmdk-fade 180ms ease',
      }}
    >
      <div
        className="cmdk-panel"
        style={{
          width: 'min(640px, calc(100% - 32px))',
          maxHeight: '70vh',
          borderRadius: 12,
          border: '1px solid var(--color-ink-700, #2E2F3A)',
          background: 'var(--color-ink-900, #161821)',
          boxShadow: '0 24px 64px -16px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'cmdk-pop 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-800">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-ink-400 shrink-0" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={labels.placeholder}
            className="flex-1 bg-transparent border-none outline-none text-base text-ink-50 placeholder:text-ink-500"
            aria-label={labels.placeholder}
          />
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono text-ink-400 border border-ink-700 bg-ink-950">esc</kbd>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto py-2">
          {grouped.length === 0 && (
            <div className="px-4 py-12 text-center text-small text-ink-400">
              {labels.empty}
            </div>
          )}
          {grouped.map(([group, list]) => (
            <div key={group} className="py-1">
              <div className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-wider text-ink-500">{group}</div>
              {list.map((it) => {
                flatIdx++;
                const isActive = flatIdx === active;
                return (
                  <a
                    key={it.id}
                    href={it.href}
                    data-cmdk-idx={flatIdx}
                    onMouseEnter={(() => {
                      const captured = flatIdx;
                      return () => setActive(captured);
                    })()}
                    onClick={() => setOpen(false)}
                    className={`block mx-2 px-3 py-2.5 rounded-md flex items-center gap-3 ${
                      isActive ? 'bg-ink-800 text-ink-50' : 'text-ink-200 hover:bg-ink-800/60'
                    }`}
                  >
                    <span className="text-small font-medium flex-1 truncate">{it.label}</span>
                    {it.hint && (
                      <span className="text-xs text-ink-500 truncate max-w-[200px]">{it.hint}</span>
                    )}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-ink-500 shrink-0" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-ink-800 text-[10px] text-ink-500">
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded font-mono border border-ink-700">↵</kbd>{labels.tipOpen}</span>
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded font-mono border border-ink-700">↑↓</kbd>{labels.tipNav}</span>
          <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 rounded font-mono border border-ink-700">esc</kbd>{labels.tipClose}</span>
        </div>
      </div>

      <style>{`
        @keyframes cmdk-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cmdk-pop { from { opacity: 0; transform: translateY(-12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .cmdk-panel { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
