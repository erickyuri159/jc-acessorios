import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/data/business";

type LegalBlock = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

type LegalPageProps = {
  kicker: string;
  title: string;
  updated: string;
  blocks: LegalBlock[];
};

/**
 * Página legal con estilo editorial: serif sobre fondo obsidiana,
 * filetes finos y un enlace de vuelta a la portada. El contenido
 * cumple LSSI + RGPD con placeholders hasta que la dueña confirme
 * sus datos.
 */
export function LegalShell({ kicker, title, updated, blocks }: LegalPageProps) {
  return (
    <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        className="pointer-events-none absolute top-0 left-1/4 h-72 w-96 rounded-full bg-oro opacity-[0.07] blur-[110px]"
        aria-hidden="true"
      />
      <div className="container-site relative max-w-3xl">
        <p className="kicker">{kicker}</p>
        <h1 className="font-display mt-6 text-4xl leading-[1.02] text-marfil sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-humo-2">
          Última actualización: {updated}
        </p>

        <div className="mt-12 border-t border-linea pt-10">
          {blocks.map((block, index) => (
            <section
              key={block.heading}
              className={index > 0 ? "mt-10 border-t border-linea pt-10" : ""}
            >
              <h2 className="font-display text-2xl text-marfil sm:text-3xl">
                {block.heading}
              </h2>
              {block.paragraphs.map((paragraph, i) => (
                <p key={i} className="mt-4 text-base leading-relaxed text-humo">
                  {paragraph}
                </p>
              ))}
              {block.list ? (
                <ul className="mt-4 space-y-2 text-base leading-relaxed text-humo">
                  {block.list.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-oro"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-linea pt-8">
          <Link href="/" className="link-underline text-sm font-semibold text-marfil">
            ← Volver a la portada
          </Link>
        </div>
      </div>
    </div>
  );
}

export function legalMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: `${title} — JP Accesorios`,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    robots: { index: false, follow: false },
  };
}
