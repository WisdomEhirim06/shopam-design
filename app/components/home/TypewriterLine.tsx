'use client';

import { useEffect, useRef, useState } from 'react';

const FULL_TEXT = 'Shopping Experience..... Best with..... Shopam';
const SHOPAM_START = FULL_TEXT.indexOf('Shopam');

export default function TypewriterLine() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const id = setInterval(() => {
            i += 1;
            setCount(i);
            if (i >= FULL_TEXT.length) clearInterval(id);
          }, 95);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shown = FULL_TEXT.slice(0, count);
  const before = shown.length > SHOPAM_START ? shown.slice(0, SHOPAM_START) : shown;
  const after = shown.length > SHOPAM_START ? shown.slice(SHOPAM_START) : '';

  return (
    <section className="bg-canvas py-20 sm:py-28">
      <div ref={ref} className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-script text-4xl leading-snug text-ink sm:text-5xl lg:text-6xl xl:text-7xl">
          {before}
          {after && <span className="text-[#FA3728]">{after}</span>}
          <span className="type-cursor ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] rounded-full bg-[#FA3728] align-middle" />
        </p>
      </div>

      <style jsx>{`
        .type-cursor {
          animation: blink 1s steps(1) infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .type-cursor { animation: none; }
        }
      `}</style>
    </section>
  );
}
