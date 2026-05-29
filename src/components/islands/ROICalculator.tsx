import { useMemo, useState } from 'react';
import type { Lang } from '~/lib/i18n';

interface Props {
  lang: Lang;
}

/**
 * Calculateur ROI simple : (heures gagnées par semaine × salaire chargé × nb équipes)
 * vs coût d'un projet sur-mesure. Indicatif, pas un devis.
 */
export default function ROICalculator({ lang }: Props) {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [people, setPeople] = useState(5);
  const [hourlyCost, setHourlyCost] = useState(60);
  const [projectCost, setProjectCost] = useState(45000);

  const labels = lang === 'fr'
    ? {
        title: 'Estimez votre ROI',
        subtitle: 'Estimation indicative — pas un devis. Ajustez les curseurs pour votre contexte.',
        hours: 'Heures économisées / semaine / personne',
        people: 'Personnes concernées',
        cost: 'Coût horaire chargé (€)',
        project: 'Investissement projet (€)',
        annualGain: 'Gain annuel estimé',
        payback: 'Retour sur investissement',
        weeks: (n: number) => `≈ ${n} ${n <= 1 ? 'semaine' : 'semaines'}`,
        years: (n: number) => `≈ ${n.toFixed(1)} an${n > 1 ? 's' : ''}`,
        cta: 'Demander un devis chiffré',
        breakdown: 'Détail du calcul',
        formula: (h: number, p: number, c: number, weeks = 46) =>
          `${h}h × ${p} pers. × ${c}€ × ${weeks} sem. travaillées`,
        net1: 'Gain année 1 (net)',
      }
    : {
        title: 'Estimate your ROI',
        subtitle: 'Indicative estimate — not a quote. Tune the sliders for your context.',
        hours: 'Hours saved / week / person',
        people: 'People involved',
        cost: 'Loaded hourly cost (€)',
        project: 'Project investment (€)',
        annualGain: 'Estimated annual gain',
        payback: 'Payback period',
        weeks: (n: number) => `≈ ${n} ${n <= 1 ? 'week' : 'weeks'}`,
        years: (n: number) => `≈ ${n.toFixed(1)} year${n > 1 ? 's' : ''}`,
        cta: 'Request a costed quote',
        breakdown: 'Calculation breakdown',
        formula: (h: number, p: number, c: number, weeks = 46) =>
          `${h}h × ${p} people × ${c}€ × ${weeks} working weeks`,
        net1: 'Year-1 net gain',
      };

  const calc = useMemo(() => {
    const workingWeeks = 46;
    const annualGain = hoursPerWeek * people * hourlyCost * workingWeeks;
    const paybackWeeks = annualGain > 0 ? Math.ceil((projectCost / annualGain) * 52) : Infinity;
    const paybackYears = annualGain > 0 ? projectCost / annualGain : Infinity;
    const netYear1 = annualGain - projectCost;
    return { annualGain, paybackWeeks, paybackYears, netYear1, workingWeeks };
  }, [hoursPerWeek, people, hourlyCost, projectCost]);

  const fmt = (n: number) =>
    new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="roi-calc rounded-xl border border-ink-800 bg-ink-900/60 backdrop-blur p-6 md:p-8">
      <header className="mb-6 md:mb-8">
        <h3 className="text-h2 font-semibold text-ink-50 tracking-tight">{labels.title}</h3>
        <p className="mt-2 text-small text-ink-300 leading-relaxed max-w-2xl">{labels.subtitle}</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <RangeField
            label={labels.hours}
            value={hoursPerWeek}
            onChange={setHoursPerWeek}
            min={1}
            max={40}
            step={1}
            suffix="h"
          />
          <RangeField
            label={labels.people}
            value={people}
            onChange={setPeople}
            min={1}
            max={100}
            step={1}
          />
          <RangeField
            label={labels.cost}
            value={hourlyCost}
            onChange={setHourlyCost}
            min={20}
            max={200}
            step={5}
            suffix="€/h"
          />
          <RangeField
            label={labels.project}
            value={projectCost}
            onChange={setProjectCost}
            min={5000}
            max={300000}
            step={1000}
            suffix="€"
          />
        </div>

        {/* Results */}
        <div className="rounded-lg border border-ink-800 bg-ink-950/70 p-5 md:p-6 flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-400">{labels.annualGain}</div>
              <div className="mt-1 text-h1 md:text-display font-semibold text-teal-300 tracking-tight">{fmt(calc.annualGain)}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-400">{labels.payback}</div>
              <div className="mt-1 text-h1 md:text-display font-semibold text-coral-300 tracking-tight">
                {Number.isFinite(calc.paybackWeeks) && calc.paybackWeeks <= 104
                  ? labels.weeks(calc.paybackWeeks)
                  : Number.isFinite(calc.paybackYears)
                    ? labels.years(calc.paybackYears)
                    : '—'}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-ink-800 space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink-500 mb-1">{labels.breakdown}</div>
              <div className="text-xs font-mono text-ink-300">
                {labels.formula(hoursPerWeek, people, hourlyCost, calc.workingWeeks)}
              </div>
            </div>
            <div className="flex items-center justify-between text-small">
              <span className="text-ink-400">{labels.net1}</span>
              <span className={calc.netYear1 >= 0 ? 'text-teal-300 font-semibold' : 'text-coral-300 font-semibold'}>
                {fmt(calc.netYear1)}
              </span>
            </div>
            <a
              href={lang === 'fr' ? '/contact?type=projet' : '/en/contact?type=projet'}
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-ink-50 text-ink-950 hover:bg-ink-100 text-small font-medium transition-colors"
            >
              {labels.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-small font-medium text-ink-200">{label}</span>
        <span className="text-small font-mono text-teal-300">
          {value.toLocaleString('fr-FR')}{suffix ?? ''}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-range w-full"
        style={{
          background: `linear-gradient(90deg, var(--color-teal-400, #00D9FF) 0%, var(--color-teal-400, #00D9FF) ${pct}%, var(--color-ink-800, #1F2029) ${pct}%, var(--color-ink-800, #1F2029) 100%)`,
        }}
      />
      <style>{`
        .roi-range { appearance: none; height: 4px; border-radius: 2px; outline: none; cursor: pointer; }
        .roi-range::-webkit-slider-thumb {
          appearance: none; -webkit-appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--color-ink-50, #FAFAFC);
          border: 2px solid var(--color-teal-400, #00D9FF);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
        }
        .roi-range::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: var(--color-ink-50, #FAFAFC);
          border: 2px solid var(--color-teal-400, #00D9FF);
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
        }
      `}</style>
    </label>
  );
}
