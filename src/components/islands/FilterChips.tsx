import { useEffect, useState } from 'react';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  /** Sélecteur CSS des cartes filtrables (`[data-filter-value]`). */
  targetSelector: string;
  /** Sélecteur de l'état vide (`#empty-state`) à afficher si aucune carte ne matche. */
  emptySelector?: string;
  /** Valeur initiale (« all » par défaut). */
  initial?: string;
  /** Label accessibilité (« Filtrer par domaine »…). */
  ariaLabel: string;
  /** Couleur d'accent du chip actif. */
  accent?: 'teal' | 'coral' | 'amber' | 'ink';
}

/**
 * Filtre côté client sur des cartes déjà rendues au build (cf. brief §11).
 * Le contenu reste indexable ; seul l'affichage des cartes est masqué/affiché.
 * On lit/écrit aussi le param URL `?f=...` pour permettre le partage.
 */
export default function FilterChips({
  options,
  targetSelector,
  emptySelector,
  initial = 'all',
  ariaLabel,
  accent = 'ink',
}: Props) {
  const [active, setActive] = useState(initial);

  // Hydrate depuis l'URL si présent
  useEffect(() => {
    const url = new URL(window.location.href);
    const f = url.searchParams.get('f');
    if (f && options.some((o) => o.value === f)) {
      setActive(f);
    }
  }, [options]);

  // Applique le filtre dans le DOM à chaque changement
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(targetSelector);
    let visible = 0;
    cards.forEach((card) => {
      const value = card.dataset.filterValue ?? '';
      const matches =
        active === 'all' || value.split(',').map((v) => v.trim()).includes(active);
      card.style.display = matches ? '' : 'none';
      if (matches) visible += 1;
    });

    if (emptySelector) {
      const empty = document.querySelector<HTMLElement>(emptySelector);
      if (empty) empty.style.display = visible === 0 ? '' : 'none';
    }

    // Sync URL (replaceState — pas d'entrée d'historique pour chaque clic)
    const url = new URL(window.location.href);
    if (active === 'all') url.searchParams.delete('f');
    else url.searchParams.set('f', active);
    window.history.replaceState({}, '', url.toString());
  }, [active, targetSelector, emptySelector]);

  const accentActive: Record<NonNullable<Props['accent']>, string> = {
    teal: 'bg-teal-400 text-white border-teal-600',
    coral: 'bg-coral-400 text-white border-coral-600',
    amber: 'bg-amber-400 text-white border-amber-600',
    ink: 'bg-ink-50 text-ink-950 border-ink-900',
  };

  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = active === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setActive(opt.value)}
            aria-pressed={isActive}
            className={[
              'inline-flex items-center px-3 py-1.5 text-small font-medium rounded-full border transition-colors',
              isActive
                ? accentActive[accent]
                : 'bg-ink-900 border-ink-700 text-ink-200 hover:border-ink-600',
            ].join(' ')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
