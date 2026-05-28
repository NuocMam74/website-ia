import { useEffect, useMemo, useState } from 'react';

interface Option {
  value: string;
  label: string;
  /** Pour les services : à quels domaines ils appartiennent (mapping
   *  pour n'afficher que les services disponibles dans le domaine actif). */
  domains?: string[];
}

interface Props {
  primaryLabel: string;
  primaryOptions: Option[];
  secondaryLabel: string;
  secondaryOptions: Option[];
  /** CSS sélecteur des cartes filtrables. Chaque carte doit avoir
   *  data-primary-value et data-secondary-value (CSV). */
  targetSelector: string;
  /** Sélecteur de l'état vide à afficher si aucune carte ne matche. */
  emptySelector?: string;
  /** Couleur d'accent. */
  accent?: 'teal' | 'coral' | 'amber' | 'ink';
}

/**
 * Filtre à 2 niveaux côté client :
 *   1. Domaine (industriel, tertiaire, tech…)  → toujours visible
 *   2. Service / cas d'usage                   → n'apparaît que si un domaine est actif
 *      (ou affiche tous les services si "tous secteurs" sélectionné)
 *
 * Les cartes doivent porter `data-primary-value` (CSV des domaines) et
 * `data-secondary-value` (CSV des services). Une carte match si ses
 * valeurs croisent l'union des filtres actifs.
 *
 * URL params : `?d=industriel&s=rh` pour partager un filtre.
 */
export default function LayeredFilters({
  primaryLabel,
  primaryOptions,
  secondaryLabel,
  secondaryOptions,
  targetSelector,
  emptySelector,
  accent = 'teal',
}: Props) {
  const [primary, setPrimary] = useState('all');
  const [secondary, setSecondary] = useState('all');

  /* Hydrate depuis URL */
  useEffect(() => {
    const url = new URL(window.location.href);
    const d = url.searchParams.get('d');
    const s = url.searchParams.get('s');
    if (d && primaryOptions.some((o) => o.value === d)) setPrimary(d);
    if (s && secondaryOptions.some((o) => o.value === s)) setSecondary(s);
  }, [primaryOptions, secondaryOptions]);

  /* Quand on change de domaine, on remet le service à "tous" si le service
     actuel n'est pas disponible dans le nouveau domaine. */
  useEffect(() => {
    if (primary === 'all' || secondary === 'all') return;
    const sOpt = secondaryOptions.find((o) => o.value === secondary);
    if (sOpt?.domains && !sOpt.domains.includes(primary)) {
      setSecondary('all');
    }
  }, [primary, secondary, secondaryOptions]);

  /* Calcule les services réellement disponibles pour le domaine actif. */
  const visibleSecondary = useMemo(() => {
    if (primary === 'all') return secondaryOptions;
    return secondaryOptions.filter(
      (o) => o.value === 'all' || !o.domains || o.domains.includes(primary),
    );
  }, [primary, secondaryOptions]);

  /* Applique le filtre dans le DOM. */
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(targetSelector);
    let visible = 0;
    cards.forEach((card) => {
      const cardPrimaries = (card.dataset.primaryValue ?? '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      const cardSecondaries = (card.dataset.secondaryValue ?? '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      const matchPrimary = primary === 'all' || cardPrimaries.includes(primary);
      const matchSecondary =
        secondary === 'all' || cardSecondaries.includes(secondary);
      const matches = matchPrimary && matchSecondary;

      card.style.display = matches ? '' : 'none';
      if (matches) visible += 1;
    });

    if (emptySelector) {
      const empty = document.querySelector<HTMLElement>(emptySelector);
      if (empty) empty.style.display = visible === 0 ? '' : 'none';
    }

    /* Sync URL — replaceState pour ne pas polluer l'historique */
    const url = new URL(window.location.href);
    if (primary === 'all') url.searchParams.delete('d');
    else url.searchParams.set('d', primary);
    if (secondary === 'all') url.searchParams.delete('s');
    else url.searchParams.set('s', secondary);
    window.history.replaceState({}, '', url.toString());
  }, [primary, secondary, targetSelector, emptySelector]);

  const accentActive: Record<NonNullable<Props['accent']>, string> = {
    teal: 'bg-teal-400 text-ink-950 border-teal-400 shadow-[0_0_20px_-4px_rgba(0,217,255,0.5)]',
    coral: 'bg-coral-400 text-ink-950 border-coral-400 shadow-[0_0_20px_-4px_rgba(255,61,127,0.5)]',
    amber: 'bg-amber-400 text-ink-950 border-amber-400 shadow-[0_0_20px_-4px_rgba(255,176,0,0.5)]',
    ink: 'bg-ink-50 text-ink-950 border-ink-50',
  };

  const subtleActive: Record<NonNullable<Props['accent']>, string> = {
    teal: 'bg-teal-500/15 text-teal-200 border-teal-400/40',
    coral: 'bg-coral-500/15 text-coral-200 border-coral-400/40',
    amber: 'bg-amber-500/15 text-amber-200 border-amber-400/40',
    ink: 'bg-ink-700 text-ink-50 border-ink-600',
  };

  const renderChip = (opt: Option, active: boolean, onClick: () => void, sub = false) => (
    <button
      key={opt.value}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'inline-flex items-center px-3.5 py-1.5 text-small font-medium rounded-full border transition-all duration-200 hover:-translate-y-0.5',
        active
          ? sub
            ? subtleActive[accent]
            : accentActive[accent]
          : 'bg-ink-900/60 border-ink-700 text-ink-200 hover:border-ink-500 hover:text-ink-50',
      ].join(' ')}
    >
      {opt.label}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Niveau 1 — domaines */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500 mb-2.5 font-medium">{primaryLabel}</div>
        <div role="group" aria-label={primaryLabel} className="flex flex-wrap gap-2">
          {primaryOptions.map((opt) => renderChip(opt, primary === opt.value, () => setPrimary(opt.value)))}
        </div>
      </div>

      {/* Niveau 2 — services, animé en entrée/sortie */}
      <div
        className={[
          'overflow-hidden transition-all duration-300',
          visibleSecondary.length > 1 ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="pt-4 border-t border-ink-800/60">
          <div className="text-[10px] uppercase tracking-[0.15em] text-ink-500 mb-2.5 font-medium">{secondaryLabel}</div>
          <div role="group" aria-label={secondaryLabel} className="flex flex-wrap gap-2">
            {visibleSecondary.map((opt) => renderChip(opt, secondary === opt.value, () => setSecondary(opt.value), true))}
          </div>
        </div>
      </div>
    </div>
  );
}
