"use client";

import { useEffect, useRef } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { PieceImage } from "@/components/ui/PieceImage";
import { GemStage } from "./GemStage";
import { formatPrice, type Product } from "@/data/products";
import type { BusinessConfig, SiteConfig } from "@/lib/content";
import { WA_MESSAGE_GENERAL, waLink } from "@/lib/whatsapp";

type CinematicHeroProps = {
  business: BusinessConfig;
  site: SiteConfig;
  products: Product[];
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

/** Rampa suave entre dos valores (0 → 1). */
const smooth = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/**
 * Portada cinemática.
 *
 * La pieza grande ocupa la pantalla y, al bajar, se encoge hacia el
 * borde mientras entra el muestrario del resto de joyería. Todo el
 * scroll es nativo: no se secuestra la rueda ni el teclado, sólo se
 * reacciona a la posición del scroll.
 */
export function CinematicHero({
  business,
  site,
  products,
}: CinematicHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);

  const showcase = products.slice(0, 6);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      // Sin animación: la pieza se queda quieta y el muestrario visible.
      if (copyRef.current) copyRef.current.style.opacity = "1";
      if (stageRef.current) stageRef.current.style.transform = "none";
      if (railRef.current) railRef.current.style.opacity = "1";
      for (const card of cardRefs.current) {
        if (card) {
          card.style.opacity = "1";
          card.style.transform = "none";
        }
      }
      return;
    }

    let frame = 0;
    let current = 0;
    let target = 0;

    const measure = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const runway = section.offsetHeight - window.innerHeight;
      target = clamp(runway > 0 ? -rect.top / runway : 0);
    };

    const render = () => {
      frame = requestAnimationFrame(render);

      // Amortiguación: el valor sigue al scroll con inercia.
      current += (target - current) * 0.11;
      if (Math.abs(target - current) < 0.0005) current = target;

      const p = current;

      // 1. El texto se va hacia arriba.
      const copyOut = smooth(0, 0.32, p);
      if (copyRef.current) {
        copyRef.current.style.opacity = String(1 - copyOut);
        copyRef.current.style.transform = `translate3d(0, ${-90 * copyOut}px, 0) scale(${1 - 0.05 * copyOut})`;
        copyRef.current.style.filter = `blur(${6 * copyOut}px)`;
      }

      // 2. La pieza se encoge y se aparta cuando entra el muestrario.
      const handOver = smooth(0.38, 1, p);
      if (stageRef.current) {
        const scale = 1 - 0.52 * handOver;
        const x = -7 * handOver;
        const y = -16 * handOver;
        stageRef.current.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${scale})`;
        stageRef.current.style.opacity = String(1 - 0.25 * handOver);
      }

      // 3. El muestrario del resto de piezas entra escalonado.
      const railIn = smooth(0.26, 0.72, p);
      if (railRef.current) {
        railRef.current.style.opacity = String(railIn);
        railRef.current.style.transform = `translate3d(0, ${(1 - railIn) * 70}px, 0)`;
      }
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const local = smooth(0.28 + index * 0.055, 0.74 + index * 0.055, p);
        card.style.opacity = String(local);
        card.style.transform = `translate3d(0, ${(1 - local) * 44}px, 0)`;
      });

      // 4. Indicador de avance.
      if (barRef.current) {
        barRef.current.style.transform = `scaleY(${p})`;
      }
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative -mt-32 h-[260vh] sm:-mt-36 lg:h-[280vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Fondo: auroras de prisma y retícula técnica. */}
        <div
          className="aurora aurora-rubi -top-52 -left-40 h-[38rem] w-[38rem] opacity-40"
          aria-hidden="true"
        />
        <div
          className="aurora aurora-zafiro top-1/4 -right-40 h-[34rem] w-[34rem] opacity-30"
          aria-hidden="true"
        />
        <div
          className="rejilla absolute inset-0 opacity-50"
          aria-hidden="true"
        />

        <div className="container-site relative flex h-full flex-col pt-32 pb-10 sm:pt-36">
          {/* ------------------------------------------------ */}
          {/* Texto + pieza                                      */}
          {/* ------------------------------------------------ */}
          <div className="grid flex-1 items-center gap-10 lg:grid-cols-12">
            <div ref={copyRef} className="lg:col-span-6">
              <div className="flex items-center gap-3">
                <span className="punto-estado" aria-hidden="true" />
                <p className="kicker text-oro">{site.hero.kicker}</p>
              </div>

              <p className="font-poster mt-6 text-lg tracking-[0.18em] text-prisma sm:text-xl">
                PROBADOR DE REALIDAD AUMENTADA
              </p>

              <h1 className="font-display mt-4 text-[3.1rem] leading-[0.98] text-marfil sm:text-[4.2rem] lg:text-[4.8rem]">
                La joya que{" "}
                <span className="text-oro-metal">no te has</span>{" "}
                <span className="text-prisma italic">probado</span>{" "}
                <span className="text-oro-metal">todavía</span>
              </h1>

              <div className="mt-8 h-px w-full bg-gradient-to-r from-oro via-oro/40 to-transparent" />

              <p className="mt-8 max-w-xl text-lg leading-relaxed text-humo">
                {site.hero.subtitle}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <CtaLink href="/provador" variant="prisma">
                  {site.hero.ctaPrimary}
                </CtaLink>
                <CtaLink href="/coleccion" variant="outline">
                  {site.hero.ctaSecondary}
                </CtaLink>
                <a
                  href={waLink(business.whatsappNumber, WA_MESSAGE_GENERAL)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-humo underline decoration-oro/40 underline-offset-8 transition-colors hover:text-marfil"
                >
                  <span className="punto-estado" aria-hidden="true" />
                  Escríbenos por WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div
                ref={stageRef}
                  className="mx-auto w-full max-w-[28rem] lg:max-w-[34rem]"
                >
                  <GemStage src={site.hero.image.src} alt={site.hero.image.alt} />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ */}
          {/* Muestrario: el resto de la joyería entra aquí      */}
          {/* ------------------------------------------------ */}
          <div ref={railRef} className="opacity-0" style={{ willChange: "opacity" }}>
            <div className="flex items-center justify-between border-t border-linea pt-5">
              <p className="label text-oro">La colección</p>
              <a
                href="/coleccion"
                className="link-underline text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-humo transition-colors hover:text-marfil"
              >
                Ver las {products.length} piezas →
              </a>
            </div>

            <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {showcase.map((product, index) => (
                <li
                  key={product.id}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  className="opacity-0"
                  style={{ willChange: "opacity, transform" }}
                >
                  <a
                    href={`/producto/${product.slug}`}
                    className="group block"
                    aria-label={`Ver ${product.name}, ${formatPrice(product.price)}`}
                  >
                    <span className="piece-frame relative block aspect-square overflow-hidden rounded-sm">
                      <PieceImage
                        src={product.image}
                        alt=""
                        className="object-contain p-3 transition-transform duration-700 ease-editorial group-hover:scale-105"
                        sizes="(min-width: 640px) 14vw, 30vw"
                      />
                    </span>
                    <span className="mt-2 block truncate text-[0.6875rem] font-semibold text-marfil">
                      {product.name}
                    </span>
                    <span className="block text-[0.6875rem] text-oro tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Indicador de avance. */}
        <div
          className="pointer-events-none absolute top-1/2 right-5 hidden h-40 w-px -translate-y-1/2 bg-linea lg:block"
          aria-hidden="true"
        >
          <div
            ref={barRef}
            className="h-full w-full origin-top bg-prisma"
            style={{ transform: "scaleY(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
