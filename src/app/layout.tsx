import type { Metadata } from "next";
import { Anton, Bodoni_Moda, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { getSiteContent } from "@/lib/content";
import { jewelryStoreSchema } from "@/lib/schema";
import { siteUrl } from "@/data/business";

/* Bodoni Moda: display editorial de alto contraste (el lujo). */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

/* Space Grotesk: interfaz y microtexto (lo técnico). */
const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

/* Anton: carteles de campaña, para las frases de impacto. */
const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JP Accesorios — Bisutería y joyería en Mislata, Valencia",
    template: "%s · JP Accesorios",
  },
  description:
    "Pendientes, collares, pulseras y anillos con envío a toda España y Europa. Pruébatelos con el probador de realidad aumentada desde el móvil y pide por Bizum o WhatsApp.",
  icons: {
    icon: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "JP Accesorios",
    title: "JP Accesorios — Pruébatelos antes de comprarlos",
    description:
      "El probador de joyería en realidad aumentada. Mislata, Valencia. Envío a toda España y Europa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JP Accesorios — Pruébatelos antes de comprarlos",
    description:
      "El probador de joyería en realidad aumentada. Mislata, Valencia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { business, site } = await getSiteContent();

  return (
    <html
      lang="es"
      className={`${bodoni.variable} ${space.variable} ${anton.variable}`}
    >
      <body className="relative">
        {/* Grano: textura de papel sobre el fondo oscuro. */}
        <div className="grain" aria-hidden="true" />

        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-oro focus:px-6 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.2em] focus:text-noche"
        >
          Saltar al contenido
        </a>
        <CustomCursor />

        <CartProvider>
          <Header business={business} site={site} />
          <main id="contenido" className="pt-32 sm:pt-36">
            {children}
          </main>
          <Footer business={business} site={site} />
          <CartDrawer business={business} />
        </CartProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jewelryStoreSchema(business)),
          }}
        />
      </body>
    </html>
  );
}
