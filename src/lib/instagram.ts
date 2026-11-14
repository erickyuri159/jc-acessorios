// ============================================================
// IMPORTADOR DE INSTAGRAM
// ------------------------------------------------------------
// Convierte las publicaciones del Instagram de la tienda en
// fichas de producto de Sanity.
//
// El token NUNCA sale del servidor: el Studio llama a la API
// del sitio (/api/instagram/media y /api/instagram/import) y es
// esta capa la que habla con Instagram y con Sanity.
//
// Variables de entorno:
//   INSTAGRAM_ACCESS_TOKEN  Token de Meta (Instagram Basic Display
//                           o Instagram Login con permisos
//                           instagram_basic, instagram_content_publish)
//   SANITY_API_WRITE_TOKEN  Token con permiso de escritura
//   SANITY_PROJECT_ID       Proyecto de Sanity
//   SANITY_DATASET          Dataset (production)
// ============================================================

import { createClient, type SanityClient } from "@sanity/client";
import { categoryIds, type CategoryId } from "@/data/products";

export type InstagramMedia = {
  id: string;
  caption: string;
  permalink: string;
  mediaUrl: string;
  mediaType: string;
  timestamp: string;
};

export type InstagramDraft = {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  category: CategoryId;
  description: string;
  permalink: string;
  mediaUrl: string;
  mediaType: string;
};

/* ------------------------------------------------------------
 * Configuración
 * ---------------------------------------------------------- */

export function isInstagramConfigured(): boolean {
  return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN);
}

export function isSanityWritable(): boolean {
  return Boolean(
    process.env.SANITY_API_WRITE_TOKEN && process.env.SANITY_PROJECT_ID,
  );
}

function getWriteClient(): SanityClient {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.SANITY_PROJECT_ID;
  if (!token || !projectId) {
    throw new Error(
      "Faltan SANITY_API_WRITE_TOKEN o SANITY_PROJECT_ID para importar.",
    );
  }
  return createClient({
    projectId,
    dataset: process.env.SANITY_DATASET ?? "production",
    apiVersion: "2026-01-01",
    token,
    useCdn: false,
  });
}

/* ------------------------------------------------------------
 * Lectura de publicaciones
 * ---------------------------------------------------------- */

type GraphMedia = {
  id: string;
  caption?: string;
  permalink?: string;
  media_url?: string;
  media_type?: string;
  timestamp?: string;
};

const GRAPH_FIELDS = "id,caption,permalink,media_url,media_type,timestamp";

/**
 * Descarga las publicaciones recientes. Primero prueba con la API
 * de Instagram (graph.instagram.com) y, si el token es de una
 * cuenta profesional de Facebook, cae al endpoint de Facebook.
 */
export async function fetchInstagramMedia(
  limit = 25,
): Promise<InstagramMedia[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Falta la variable de entorno INSTAGRAM_ACCESS_TOKEN en el servidor.",
    );
  }

  const endpoints = [
    `https://graph.instagram.com/me/media?fields=${GRAPH_FIELDS}&limit=${limit}`,
    `https://graph.facebook.com/v21.0/me/media?fields=${GRAPH_FIELDS}&limit=${limit}`,
  ];

  let lastError: unknown = null;

  for (const endpoint of endpoints) {
    const url = `${endpoint}&access_token=${encodeURIComponent(token)}`;
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        const body = await response.text();
        lastError = new Error(
          `Instagram respondió ${response.status}: ${body.slice(0, 200)}`,
        );
        continue;
      }

      const json = (await response.json()) as { data?: GraphMedia[] };
      const items = json.data ?? [];

      return items
        .filter((item) => Boolean(item.media_url))
        .map((item) => ({
          id: item.id,
          caption: item.caption ?? "",
          permalink: item.permalink ?? "",
          mediaUrl: item.media_url ?? "",
          mediaType: item.media_type ?? "IMAGE",
          timestamp: item.timestamp ?? "",
        }));
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `No se pudo leer Instagram: ${
      lastError instanceof Error ? lastError.message : "error desconocido"
    }`,
  );
}

/* ------------------------------------------------------------
 * Lectura del pie de foto → ficha de producto
 * ---------------------------------------------------------- */

const CATEGORY_KEYWORDS: { id: CategoryId; words: string[] }[] = [
  { id: "anillos", words: ["anillo", "anillos", "ring", "sello", "stacking"] },
  {
    id: "pendientes",
    words: ["pendiente", "pendientes", "argolla", "argollas", "oreja", "earring"],
  },
  {
    id: "collares",
    words: ["collar", "collares", "cadena", "gargantilla", "necklace", "colgante"],
  },
  {
    id: "pulseras",
    words: ["pulsera", "pulseras", "cabellera", "cabecilla", "bracelet", "brazalete"],
  },
  { id: "sets", words: ["set", "sets", "conjunto", "pack", "dúo", "duo"] },
];

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Extrae el precio del pie de foto: «12,50 €», «12.5€», «12 euros». */
export function extractPrice(caption: string): number | null {
  const match = caption.match(
    /(?:^|\s)(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:€|eur|euros?)\b/i,
  );
  if (!match) return null;
  const value = Number.parseFloat(match[1].replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

/** Deduce la categoría a partir del texto del pie de foto. */
export function guessCategory(caption: string): CategoryId {
  const text = caption.toLowerCase();
  for (const entry of CATEGORY_KEYWORDS) {
    if (entry.words.some((word) => text.includes(word))) {
      return entry.id;
    }
  }
  return "pendientes";
}

/** El nombre del producto es, por defecto, la primera línea con texto. */
export function extractTitle(caption: string): string {
  const lines = caption
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const first = lines[0] ?? "Pieza sin título";
  const cleaned = first
    .replace(/[#@]/g, "")
    .replace(/\d{1,4}(?:[.,]\d{1,2})?\s*(?:€|eur|euros?)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned.slice(0, 80) || "Pieza sin título";
}

/** Convierte una publicación en un borrador de producto. */
export function mediaToDraft(media: InstagramMedia): InstagramDraft {
  const title = extractTitle(media.caption);
  const base = slugify(title) || `pieza-${media.id}`;

  return {
    id: media.id,
    title,
    slug: base,
    price: extractPrice(media.caption),
    category: guessCategory(media.caption),
    description: media.caption.trim(),
    permalink: media.permalink,
    mediaUrl: media.mediaUrl,
    mediaType: media.mediaType,
  };
}

/* ------------------------------------------------------------
 * Escritura en Sanity
 * ---------------------------------------------------------- */

/**
 * Crea (o actualiza) un documento de producto en Sanity a partir
 * de una publicación de Instagram. La imagen se descarga de la CDN
 * de Instagram (sus URLs caducan a las 24 h) y se sube al asset
 * de Sanity, de modo que el catálogo no dependa de Instagram.
 */
export async function importMediaAsProduct(
  media: InstagramMedia,
): Promise<{ slug: string; created: boolean }> {
  const client = getWriteClient();
  const draft = mediaToDraft(media);

  // Descarga la imagen antes de que caduque la URL de Instagram.
  const response = await fetch(media.mediaUrl);
  if (!response.ok) {
    throw new Error(
      `No se pudo descargar la imagen de Instagram (${response.status}).`,
    );
  }
  const buffer = Buffer.from(await response.arrayBuffer());

  const asset = await client.assets.upload("image", buffer, {
    filename: `${draft.slug}.jpg`,
    contentType: "image/jpeg",
  });

  const document = {
    title: draft.title,
    slug: { _type: "slug", current: draft.slug },
    price: draft.price ?? 0,
    category: draft.category,
    shortDescription: draft.description.slice(0, 140),
    description: draft.description,
    materials: "",
    image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
    arScale: 0.45,
    stock: "in-stock",
    featured: false,
    tags: [],
    instagramUrl: draft.permalink,
    instagramId: media.id,
  };

  // Reutiliza el documento existente si ya hay una pieza con ese
  // slug (evita duplicados y errores de slug en Sanity).
  const existingId = await client
    .fetch<string | null>(
      `*[_type == "product" && slug.current == $slug][0]._id`,
      { slug: draft.slug },
    )
    .catch(() => null);

  if (existingId) {
    await client.patch(existingId).set(document).commit();
    return { slug: draft.slug, created: false };
  }

  await client.create({ _type: "product", ...document });
  return { slug: draft.slug, created: true };
}

export { categoryIds };
