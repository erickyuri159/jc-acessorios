import { Wordmark } from "@/components/ui/Wordmark";
import type { BusinessConfig, SiteConfig } from "@/lib/content";
import { WA_MESSAGE_GENERAL, waLink } from "@/lib/whatsapp";

type FooterProps = {
  business: BusinessConfig;
  site: SiteConfig;
};

/**
 * Pie de página: cierre de campaña con wordmark grande, enlaces
 * de navegación, contacto y páginas legales. Fondo obsidiana con
 * un halo de prisma que separa la web del fondo del navegador.
 */
export function Footer({ business, site }: FooterProps) {
  const year = new Date().getFullYear();
  const hasAddress = !business.address.street.startsWith("[");
  const nav = site.nav;

  return (
    <footer className="relative overflow-hidden border-t border-linea bg-noche-2">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-prisma opacity-20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-site relative py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Wordmark name={business.shortName} />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-humo">
              Bisutería y joyería seleccionada en Mislata. Envío a toda España y
              Europa, pago por Bizum y probador de realidad aumentada en el
              móvil.
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <h2 className="label text-oro">Tienda</h2>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline text-sm text-humo transition-colors hover:text-marfil"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label text-oro">Contacto</h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={waLink(business.whatsappNumber, WA_MESSAGE_GENERAL)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-marfil transition-colors hover:text-oro"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`tel:${business.telephone.replace(/\s/g, "")}`}
                  className="link-underline text-humo transition-colors hover:text-marfil"
                >
                  {business.telephone}
                </a>
              </li>
              {business.email ? (
                <li>
                  <a
                    href={`mailto:${business.email}`}
                    className="link-underline text-humo transition-colors hover:text-marfil"
                  >
                    {business.email}
                  </a>
                </li>
              ) : null}
              {hasAddress ? (
                <li className="text-humo">
                  {business.address.street}
                  <br />
                  {business.address.postalCode} {business.address.locality}
                  {business.address.region ? ` (${business.address.region})` : ""}
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h2 className="label text-oro">Síguenos</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {business.social.instagram ? (
                <li>
                  <a
                    href={business.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-marfil transition-colors hover:text-oro"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  href="/provador"
                  className="link-underline text-humo transition-colors hover:text-marfil"
                >
                  Probador de realidad aumentada
                </a>
              </li>
              <li>
                <a
                  href="/como-comprar"
                  className="link-underline text-humo transition-colors hover:text-marfil"
                >
                  Cómo comprar
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Cierre de campaña: la marca a tamaño de cartel. */}
        <div className="mt-16 border-t border-linea pt-10">
          <p className="font-poster text-[13vw] leading-[0.85] text-contorno sm:text-[9vw]">
            JP ACCESORIOS
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-linea pt-8 text-xs text-humo-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.legalName}. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["Aviso legal", "/aviso-legal"],
              ["Privacidad", "/politica-de-privacidad"],
              ["Cookies", "/politica-de-cookies"],
              ["Condiciones de venta", "/condiciones-de-venta"],
              ["Cómo comprar", "/como-comprar"],
            ].map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="transition-colors hover:text-marfil"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
