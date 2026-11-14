"use client";

import { useEffect, useRef } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Wordmark } from "@/components/ui/Wordmark";
import type { BusinessConfig, SiteConfig } from "@/lib/content";
import { WA_MESSAGE_GENERAL, waLink } from "@/lib/whatsapp";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  business: BusinessConfig;
  site: SiteConfig;
};

/**
 * Menú de pantalla completa para móvil. Enumeración grande en
 * cartel, cierre con foco devuelto al botón de apertura.
 */
export function MobileMenu({ open, onClose, business, site }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="menu-movil"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-noche pt-8"
    >
      <div className="container-site flex h-20 items-center justify-between">
        <Wordmark name={business.shortName} />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-linea text-marfil transition-colors hover:border-oro hover:text-oro"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav
        aria-label="Menú móvil"
        className="container-site flex flex-1 flex-col justify-center py-10"
      >
        <ul className="space-y-1">
          {site.nav.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={onClose}
                className="group flex items-baseline gap-4 border-b border-linea py-4 transition-colors hover:border-oro/50"
              >
                <span className="font-poster text-sm text-prisma">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-4xl text-marfil transition-colors group-hover:text-oro">
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-site border-t border-linea py-8">
        <CtaLink
          href="/provador"
          variant="prisma"
          onClick={onClose}
          className="w-full justify-center"
        >
          Abrir el probador AR
        </CtaLink>
        <CtaLink
          href={waLink(business.whatsappNumber, WA_MESSAGE_GENERAL)}
          external
          variant="outline"
          className="mt-3 w-full justify-center"
        >
          Escribir por WhatsApp
        </CtaLink>
        <p className="mt-5 text-center text-sm text-humo">{business.telephone}</p>
      </div>
    </div>
  );
}
