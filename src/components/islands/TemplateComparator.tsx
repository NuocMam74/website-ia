import { useMemo, useState } from 'react';
import { ArrowRight, ArrowLeft, Check, RefreshCw } from 'lucide-react';

interface Template {
  slug: string;
  name: string;
  norm: string;
  priceEUR: number;
  summary: string;
  href: string;
  /** Tags pour scoring. */
  domains: string[];
  /** Profil de cas typique. */
  fit: string[];
}

interface Props {
  templates: Template[];
  lang: 'fr' | 'en';
}

interface Question {
  id: string;
  label: string;
  options: { value: string; label: string; tags: string[] }[];
}

/**
 * Petit quiz à 3 questions qui recommande le template le plus adapté
 * en fonction des réponses, via un score simple (intersections de tags).
 * Pas de tracking, tout côté client.
 */
export default function TemplateComparator({ templates, lang }: Props) {
  const questions: Question[] = useMemo(
    () => [
      {
        id: 'sector',
        label: lang === 'fr' ? 'Dans quel secteur évoluez-vous ?' : 'In which sector do you operate?',
        options: [
          { value: 'auto', label: lang === 'fr' ? 'Automobile' : 'Automotive', tags: ['auto', 'aspice', 'iso26262', 'iso21434'] },
          { value: 'medical', label: lang === 'fr' ? 'Médical' : 'Medical', tags: ['medical', 'iso13485'] },
          { value: 'autre', label: lang === 'fr' ? 'Autre industrie' : 'Other industry', tags: ['iso9001'] },
        ],
      },
      {
        id: 'concern',
        label: lang === 'fr' ? 'Quel est votre enjeu principal ?' : 'What is your main concern?',
        options: [
          { value: 'process', label: lang === 'fr' ? 'Maturité process / audit' : 'Process maturity / audit', tags: ['aspice', 'process'] },
          { value: 'safety', label: lang === 'fr' ? 'Sécurité fonctionnelle' : 'Functional safety', tags: ['iso26262', 'safety'] },
          { value: 'cyber', label: lang === 'fr' ? 'Cybersécurité véhicule' : 'Vehicle cybersecurity', tags: ['iso21434', 'cyber'] },
          { value: 'tooling', label: lang === 'fr' ? 'Outillage / Polarion' : 'Tooling / Polarion', tags: ['polarion', 'tooling', 'aspice'] },
        ],
      },
      {
        id: 'urgency',
        label: lang === 'fr' ? 'Quelle est votre échéance ?' : 'What is your deadline?',
        options: [
          { value: 'fast', label: lang === 'fr' ? 'Sous 3 mois' : 'Within 3 months', tags: ['fast'] },
          { value: 'q', label: lang === 'fr' ? 'Ce trimestre' : 'This quarter', tags: ['fast'] },
          { value: 'long', label: lang === 'fr' ? 'À plus long terme' : 'Longer term', tags: [] },
        ],
      },
    ],
    [lang],
  );

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const finished = step >= questions.length;

  const handlePick = (qid: string, value: string, tags: string[]) => {
    setAnswers((prev) => ({ ...prev, [qid]: JSON.stringify({ value, tags }) }));
    setStep((s) => s + 1);
  };

  const recommended = useMemo(() => {
    if (!finished) return [];
    // Aggregate tags from answers
    const allTags = Object.values(answers).flatMap((raw) => {
      try {
        return (JSON.parse(raw) as { tags: string[] }).tags;
      } catch {
        return [] as string[];
      }
    });
    // Score each template = number of tag intersections
    return templates
      .map((tpl) => {
        const score = tpl.fit.reduce((acc, t) => acc + (allTags.includes(t) ? 1 : 0), 0);
        return { tpl, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  }, [finished, answers, templates]);

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  if (finished) {
    const top = recommended[0];

    return (
      <div className="border border-ink-800 rounded-xl bg-ink-900 p-8 md:p-10">
        {top ? (
          <>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-teal-300 mb-2 font-medium">
                  {lang === 'fr' ? 'Recommandation' : 'Recommendation'}
                </p>
                <h3 className="text-h1 font-semibold text-ink-50 tracking-tight">{top.tpl.name}</h3>
                <p className="mt-2 text-base text-ink-300 max-w-xl">{top.tpl.summary}</p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-small text-ink-300 hover:text-ink-50 border border-ink-700 rounded-md transition-colors"
              >
                <RefreshCw size={14} aria-hidden="true" />
                {lang === 'fr' ? 'Refaire' : 'Restart'}
              </button>
            </div>

            <div className="flex flex-wrap gap-3 items-center mb-6 pt-6 border-t border-ink-800">
              <div className="text-h2 font-semibold text-amber-300">
                {new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }).format(top.tpl.priceEUR)}
              </div>
              <span className="text-xs text-ink-500">{lang === 'fr' ? 'TTC' : 'incl. VAT'}</span>
            </div>

            <a
              href={top.tpl.href}
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-ink-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors glow-amber"
            >
              {lang === 'fr' ? 'Voir le template' : 'See the template'}
              <ArrowRight size={16} aria-hidden="true" />
            </a>

            {recommended.length > 1 && (
              <div className="mt-10 pt-6 border-t border-ink-800">
                <p className="text-small text-ink-400 mb-4">
                  {lang === 'fr' ? 'Autre option pertinente' : 'Other relevant option'} :
                </p>
                <a
                  href={recommended[1].tpl.href}
                  className="inline-flex items-center gap-2 text-base text-ink-100 hover:text-amber-300 transition-colors"
                >
                  {recommended[1].tpl.name}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-base text-ink-300 mb-6">
              {lang === 'fr'
                ? 'Aucun template ne correspond précisément à vos critères. Décrivez-nous votre besoin, nous pouvons construire une base sur-mesure.'
                : 'No template matches your criteria precisely. Tell us your need, we can build a custom baseline.'}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-base font-medium text-ink-950 bg-ink-50 hover:bg-ink-100 rounded-md transition-colors"
            >
              {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={reset}
              className="ml-3 inline-flex items-center gap-1.5 px-4 py-2 text-small text-ink-300 hover:text-ink-50 border border-ink-700 rounded-md transition-colors"
            >
              <RefreshCw size={14} />
              {lang === 'fr' ? 'Refaire le quiz' : 'Restart quiz'}
            </button>
          </div>
        )}
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="border border-ink-800 rounded-xl bg-ink-900 p-8 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs uppercase tracking-wider text-ink-400 font-medium">
          {lang === 'fr' ? `Question ${step + 1} / ${questions.length}` : `Question ${step + 1} / ${questions.length}`}
        </p>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <span
              key={i}
              className={
                'block w-8 h-1 rounded-full ' +
                (i <= step ? 'bg-teal-400' : 'bg-ink-700')
              }
            />
          ))}
        </div>
      </div>

      <h3 className="text-h1 font-semibold text-ink-50 mb-8 tracking-tight">{q.label}</h3>

      <div className="grid sm:grid-cols-2 gap-3">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handlePick(q.id, opt.value, opt.tags)}
            className="group flex items-center justify-between gap-3 px-5 py-4 text-left text-base text-ink-100 border border-ink-700 hover:border-teal-400 hover:bg-ink-800/60 rounded-lg transition-all hover:-translate-y-0.5"
          >
            <span>{opt.label}</span>
            <ArrowRight
              size={16}
              className="text-ink-500 group-hover:text-teal-300 group-hover:translate-x-1 transition-all"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="mt-6 inline-flex items-center gap-1.5 text-small text-ink-400 hover:text-ink-200"
        >
          <ArrowLeft size={14} />
          {lang === 'fr' ? 'Question précédente' : 'Previous question'}
        </button>
      )}
    </div>
  );
}
