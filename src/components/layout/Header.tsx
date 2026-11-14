"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartButton } from "@/components/cart/CartButton";
import { CtaLink } from "@/components/ui/CtaLink";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "./MobileMenu";
import type { BusinessConfig, SiteConfig } from "@/lib/content";
import { WA_MESSAGE_GENERAL, waLink } from "@/lib/whatsapp";

type HeaderProps = {
  business: BusinessConfig;
  site: SiteConfig;
};

/**
 * Cabecera fija. Barra de información con el envío gratuito, marca
 * a la izquierda, navegación y, a la derecha, la llamada al
 * probador AR (el producto estrella) y la cesta.
 */
export function Header({ business, site }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 border-b border-linea bg-noche-2/95 backdrop-blur">
        <div className="container-site flex h-9 items-center justify-center gap-3 text-[0.625rem] font-semibold uppercase tracking-[0.2em]">
          <span className="text-prisma">Mislata · Valencia</span>
          <span className="text-humo-2" aria-hidden="true">
            /
          </span>
          <span className="text-humo">
            Envío gratis desde {business.shipping.freeShippingFrom} €
          </span>
          <span className="hidden text-humo-2 sm:inline" aria-hidden="true">
            /
          </span>
          <span className="hidden text-humo sm:inline">
            Pago por Bizum
          </span>
        </div>
      </div>

      <header
        className={`fixed inset-x-0 top-9 z-40 border-b transition-all duration-300 ${
          scrolled
            ? "border-linea bg-noche/85 backdrop-blur-xl"
            : "border-transparent bg-noche/40 backdrop-blur-sm"
        }`}
      >
        <div className="container-site flex h-20 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={`${business.name} — volver al inicio`}
            className="rounded-sm"
          >
            <Wordmark name={business.shortName} />
          </Link>

          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-humo transition-colors hover:text-marfil"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <CtaLink
              href="/provador"
              variant="prisma"
              className="max-md:hidden !px-5 !py-2.5"
            >
              Probar en AR
            </CtaLink>

            <CtaLink
              href={waLink(business.whatsappNumber, WA_MESSAGE_GENERAL)}
              external
              variant="outline"
              className="max-lg:hidden !px-5 !py-2.5"
            >
              Escribir
            </CtaLink>

            <CartButton />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-linea text-marfil transition-colors hover:border-oro hover:text-oro lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M3.75 7h16.5M3.75 12h16.5M3.75 17h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        business={business}
        site={site}
      />
    </>
  );
}
