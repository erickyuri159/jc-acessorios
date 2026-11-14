// ============================================================
// CLIENTE DE SANITY
// ------------------------------------------------------------
// Configura el acceso de solo lectura al contenido publicado.
// Si no hay variables de entorno (SANITY_PROJECT_ID), el sitio
// usa los datos estáticos de src/data/ como respaldo.
// ============================================================

import { createClient, type SanityClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.SANITY_PROJECT_ID ?? "";
const dataset = process.env.SANITY_DATASET ?? "production";

export const isContentCmsConfigured = Boolean(projectId);

export const sanityClient: SanityClient | null = isContentCmsConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2026-01-01",
      // Sin CDN: al revalidar, la consulta debe traer lo último publicado.
      useCdn: false,
    })
  : null;

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

/** Imagen de Sanity: objeto { asset: { _ref } } → URL del CDN optimizada. */
export function sanityImageSrc(
  image: { asset: { _ref: string } } | undefined | null,
): string {
  if (!image || !builder) return "";
  return builder.image(image).auto("format").fit("max").url();
}
