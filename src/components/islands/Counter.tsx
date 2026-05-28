import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Valeur cible (ex. 17, 40, 100). */
  to: number;
  /** Préfixe (ex. "-") ou suffixe (ex. "%", "+", "/an"). */
  prefix?: string;
  suffix?: string;
  /** Durée d'animation en ms. */
  duration?: number;
  /** Classe sur le span. */
  className?: string;
  /** Permet de passer la valeur en string brute si non numérique (ex. "FR/EN"). */
  raw?: string;
}

/**
 * Compteur animé qui démarre quand le composant entre dans la viewport.
 * Pas de dépendance externe — IntersectionObserver + requestAnimationFrame.
 * Si `raw` est fourni, on affiche directement la string sans animer.
 */
export default function Counter({
  to,
  prefix = '',
  suffix = '',
  duration = 1500,
  className,
  raw,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(raw ? to : 0);

  useEffect(() => {
    if (raw) return;
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(to);
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        io.disconnect();

        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out-cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(to * eased));
          if (progress < 1) raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration, raw]);

  return (
    <span ref={ref} className={className}>
      {raw ?? `${prefix}${value}${suffix}`}
    </span>
  );
}
