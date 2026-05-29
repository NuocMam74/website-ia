import { useState } from 'react';

interface Step {
  id: string;
  label: string;
  duration?: string;
  description: string;
  bullets: string[];
  icon?: string;
}

interface Props {
  steps: Step[];
  family?: 'solutions' | 'ia' | 'templates';
}

/**
 * Stepper horizontal interactif. Sur desktop, étape sélectionnée
 * affichée en panel de droite ; sur mobile, accordéon vertical.
 */
export default function Stepper({ steps, family }: Props) {
  const [active, setActive] = useState(steps[0]?.id ?? '');
  const idx = steps.findIndex((s) => s.id === active);
  const current = steps[idx] ?? steps[0];

  const accentRing =
    family === 'solutions' ? 'ring-teal-400/40 bg-teal-500/15 text-teal-200'
    : family === 'ia' ? 'ring-coral-400/40 bg-coral-500/15 text-coral-200'
    : family === 'templates' ? 'ring-amber-400/40 bg-amber-500/15 text-amber-200'
    : 'ring-ink-50/40 bg-ink-50/10 text-ink-50';

  const accentLine =
    family === 'solutions' ? 'bg-teal-400'
    : family === 'ia' ? 'bg-coral-400'
    : family === 'templates' ? 'bg-amber-400'
    : 'bg-ink-50';

  return (
    <div className="stepper">
      {/* Barre d'étapes */}
      <ol className="hidden md:flex items-center gap-0 relative mb-10" role="list">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-ink-800" aria-hidden="true" />
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 h-px ${accentLine}`}
          style={{
            width: `${(idx / Math.max(1, steps.length - 1)) * 100}%`,
            transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          aria-hidden="true"
        />
        {steps.map((s, i) => {
          const isActive = s.id === active;
          const isDone = i < idx;
          return (
            <li key={s.id} className="relative flex-1 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setActive(s.id)}
                aria-current={isActive ? 'step' : undefined}
                className={[
                  'relative z-10 inline-flex items-center justify-center w-11 h-11 rounded-full ring-2 transition-all cursor-pointer',
                  isActive
                    ? `${accentRing} scale-105`
                    : isDone
                      ? 'bg-ink-50 text-ink-950 ring-ink-50'
                      : 'bg-ink-900 text-ink-400 ring-ink-700 hover:ring-ink-500',
                ].join(' ')}
              >
                <span className="text-small font-semibold">{String(i + 1).padStart(2, '0')}</span>
              </button>
              <span
                className={`mt-3 text-xs uppercase tracking-wider transition-colors ${
                  isActive ? 'text-ink-50' : 'text-ink-400'
                }`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Panel détail desktop */}
      <div className="hidden md:block rounded-xl border border-ink-800 bg-ink-900/60 backdrop-blur p-8 md:p-10">
        <div className="flex flex-wrap items-baseline gap-4 mb-4">
          <h3 className="text-h2 font-semibold text-ink-50 tracking-tight">{current.label}</h3>
          {current.duration && (
            <span className="text-small text-ink-400">{current.duration}</span>
          )}
        </div>
        <p className="text-base text-ink-200 leading-relaxed max-w-3xl">{current.description}</p>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {current.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-ink-950/60 border border-ink-800">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-300 mt-1 shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              <span className="text-small text-ink-100">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile : accordéon */}
      <div className="md:hidden space-y-3">
        {steps.map((s, i) => {
          const isActive = s.id === active;
          return (
            <div key={s.id} className="rounded-lg border border-ink-800 bg-ink-900/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setActive(isActive ? '' : s.id)}
                aria-expanded={isActive}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span
                  className={[
                    'inline-flex items-center justify-center w-9 h-9 rounded-full text-small font-semibold shrink-0',
                    isActive ? accentRing : 'bg-ink-800 text-ink-300',
                  ].join(' ')}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-h4 font-medium text-ink-50">{s.label}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform ${isActive ? 'rotate-180' : ''} text-ink-400`}
                  aria-hidden="true"
                ><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {isActive && (
                <div className="px-4 pb-5">
                  <p className="text-small text-ink-200 leading-relaxed">{s.description}</p>
                  <ul className="mt-3 space-y-1.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-small text-ink-100">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-300 mt-1 shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
