"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

type Slide = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
};

function HeroPlaceholder({ eyebrow }: { eyebrow: string }) {
  return (
    <section className="relative w-full min-h-[max(37.5rem,100svh)] max-h-[1000px] bg-neutral-100 flex flex-col items-center justify-center text-center px-6">
      <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400 mb-5">{eyebrow}</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-neutral-300 leading-[0.95] mb-6 break-words max-w-lg">
        Your Hero Image
      </h1>
      <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
        Add a banner from{" "}
        <Link href="/admin/content" className="underline hover:text-neutral-600 transition-colors">
          Admin → Content Studio
        </Link>
      </p>
    </section>
  );
}

const SLIDE_INTERVAL = 5000;

export function HeroCarousel({ slides, eyebrow }: { slides: Slide[]; eyebrow: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((i) => (i + 1) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const id = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [next, paused, slides.length]);

  if (slides.length === 0) return <HeroPlaceholder eyebrow={eyebrow} />;

  const slide = slides[active];
  const pad = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <section
      className="relative w-full min-h-[max(37.5rem,100svh)] max-h-[1000px] bg-neutral-900 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <Image
            src={s.imageUrl}
            alt={s.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={i === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

      {slides.length > 1 && (
        <div className="absolute top-7 right-8 z-30 font-light tabular-nums text-white/60 text-[11px] tracking-[0.2em]">
          {pad(active)} / {pad(slides.length - 1)}
        </div>
      )}

      <div className="absolute bottom-20 sm:bottom-24 left-6 sm:left-14 lg:left-20 z-30 text-white max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.4em] mb-5 opacity-75">{eyebrow}</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.93] mb-5 break-words hyphens-auto">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="text-sm sm:text-base opacity-75 mb-8 max-w-sm leading-relaxed">{slide.subtitle}</p>
        )}
        <Link
          href={slide.ctaHref}
          className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] border-b border-white/80 pb-1 hover:opacity-60 transition-opacity"
        >
          {slide.ctaLabel}
          <svg className="w-3 h-2.5" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M1 5h10M7 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-9 left-6 sm:left-14 lg:left-20 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-px transition-all duration-500 bg-white cursor-pointer ${
                i === active ? "w-10 opacity-90" : "w-4 opacity-35 hover:opacity-60"
              }`}
            />
          ))}
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActive((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 h-10 w-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Progress bar — resets on each slide change via key, pauses on hover */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-30 h-px bg-white/10">
          <div
            key={active}
            className="h-full bg-white/50 animate-slide-progress"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          />
        </div>
      )}
    </section>
  );
}
