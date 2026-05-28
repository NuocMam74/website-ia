import { useEffect, useState } from 'react';
import { type Lang } from '~/lib/i18n';

interface Props {
  lang: Lang;
}

const STORAGE_KEY = 'cookies.consent.v1';

type Consent = 'accepted' | 'refused' | null;

/**
 * Bandeau cookies RGPD (cf. brief §20).
 * - Refus aussi simple qu'accepter (deux boutons côte à côte, même poids visuel).
 * - Aucun cookie/analytics non essentiel n'est posé avant consentement.
 * - Une fois la décision prise, on n'affiche plus le bandeau.
 *
 * Le consentement est exposé sur window.__consent pour que les scripts
 * d'analytics (chargés ailleurs) puissent s'y conformer.
 */
export default function CookieBanner({ lang }: Props) {
  const [decision, setDecision] = useState<Consent>('accepted'); // hide by default during SSR

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Consent) ?? null;
    setDecision(stored);
    if (stored) {
      (window as unknown as { __consent?: Consent }).__consent = stored;
    } else {
      setDecision(null); // show banner
    }
  }, []);

  const save = (value: Consent) => {
    if (!value) return;
    localStorage.setItem(STORAGE_KEY, value);
    (window as unknown as { __consent?: Consent }).__consent = value;
    setDecision(value);
  };

  if (decision !== null) return null;

  const messages = {
    fr: {
      message:
        'Nous utilisons des cookies pour mesurer l’audience. Vous pouvez les accepter ou les refuser. Aucun cookie non essentiel n’est posé avant votre consentement.',
      accept: 'Accepter',
      refuse: 'Refuser',
      label: 'Préférences cookies',
    },
    en: {
      message:
        'We use cookies to measure traffic. You can accept or refuse them. No non-essential cookie is set before your consent.',
      accept: 'Accept',
      refuse: 'Refuse',
      label: 'Cookie preferences',
    },
  };
  const m = messages[lang];

  return (
    <div
      role="dialog"
      aria-label={m.label}
      className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md z-40 bg-ink-900 border border-ink-700 rounded-lg p-5 shadow-sm"
    >
      <p className="text-small text-ink-100 leading-relaxed">{m.message}</p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => save('refused')}
          className="flex-1 px-4 py-2 text-small font-medium text-ink-50 border border-ink-700 hover:bg-ink-800 rounded-md transition-colors"
        >
          {m.refuse}
        </button>
        <button
          type="button"
          onClick={() => save('accepted')}
          className="flex-1 px-4 py-2 text-small font-medium text-ink-950 bg-ink-50 hover:bg-ink-100 rounded-md transition-colors"
        >
          {m.accept}
        </button>
      </div>
    </div>
  );
}
