import { useEffect, useRef, useState } from 'react';

interface Slide {
  id: string;
  /** HTML stringifié (généré côté serveur via Astro). */
  html: string;
}

interface Props {
  slides: Slide[];
  /** Intervalle d'autoplay en ms (0 = désactivé). */
  autoplay?: number;
  /** Affiche les flèches de navigation. */
  arrows?: boolean;
  ariaLabel?: string;
}

/**
 * Carousel simple avec autoplay, dots, navigation clavier.
 * Pas de dépendance externe — drag tactile basique inclus.
 */
export default function Carousel({ slides, autoplay = 5000, arrows = true, ariaLabel }: Props) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  const go = (i: number) => {
    const n = slides.length;
    setIndex(((i % n) + n) % n);
  };

  useEffect(() => {
    if (!autoplay || hover) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((curr) => (curr + 1) % slides.length);
    }, autoplay);
    return () => window.clearInterval(id);
  }, [autoplay, slides.length, hover]);

  useEffect(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement !== wrap) return;
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    wrap.addEventListener('keydown', onKey);
    return () => wrap.removeEventListener('keydown', onKey);
  }, [index, slides.length]);

  // Drag tactile
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let startX = 0;
    let dx = 0;
    let dragging = false;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      dx = 0;
      track.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      dx = e.clientX - startX;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try { track.releasePointerCapture(e.pointerId); } catch {}
      if (Math.abs(dx) > 40) {
        go(index + (dx < 0 ? 1 : -1));
      }
    };
    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onUp);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', onUp);
      track.removeEventListener('pointercancel', onUp);
    };
  }, [index, slides.length]);

  return (
    <div
      ref={wrapperRef}
      className="carousel relative"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ outline: 'none' }}
    >
      <div className="overflow-hidden rounded-xl">
        <div
          ref={trackRef}
          className="carousel-track flex"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
            touchAction: 'pan-y',
          }}
        >
          {slides.map((s, i) => (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}
              aria-hidden={i !== index}
              className="w-full shrink-0 px-1"
              dangerouslySetInnerHTML={{ __html: s.html }}
            />
          ))}
        </div>
      </div>

      {arrows && slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Précédent"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-900/80 backdrop-blur border border-ink-700 text-ink-100 hover:bg-ink-800 transition-colors flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            type="button"
            aria-label="Suivant"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink-900/80 backdrop-blur border border-ink-700 text-ink-100 hover:bg-ink-800 transition-colors flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Aller à la slide ${i + 1}`}
              onClick={() => go(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === index ? 24 : 8,
                background: i === index ? 'var(--color-teal-400, #00D9FF)' : 'var(--color-ink-700, #2E2F3A)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
