// ============================================================
// API — Importar publicaciones de Instagram como productos
// ------------------------------------------------------------
// POST /api/instagram/import
//   Body: { ids?: string[] }
//   Sin ids → importa todas las publicaciones disponibles.
//   Descarga la imagen de Instagram, la sube al asset de Sanity y
//   crea/actualiza el documento de producto correspondiente.
// ============================================================

import { NextResponse } from "next/server";
import {
  fetchInstagramMedia,
  importMediaAsProduct,
  isInstagramConfigured,
  isSanityWritable,
} from "@/lib/instagram";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isInstagramConfigured()) {
    return NextResponse.json(
      { error: "Instagram no está conectado (falta INSTAGRAM_ACCESS_TOKEN)." },
      { status: 503 },
    );
  }

  if (!isSanityWritable()) {
    return NextResponse.json(
      {
        error:
          "Sanity no tiene permiso de escritura (faltan SANITY_API_WRITE_TOKEN o SANITY_PROJECT_ID).",
      },
      { status: 503 },
    );
  }

  let ids: string[] | undefined;
  try {
    const body = (await request.json()) as { ids?: string[] };
    ids = Array.isArray(body?.ids) ? body.ids : undefined;
  } catch {
    ids = undefined;
  }

  try {
    const media = await fetchInstagramMedia(25);
    const selected = ids?.length
      ? media.filter((item) => ids.includes(item.id))
      : media;

    if (!selected.length) {
      return NextResponse.json(
        { error: "No hay publicaciones nuevas que importar." },
        { status: 404 },
      );
    }

    const results: { id: string; slug?: string; created?: boolean; error?: string }[] =
      [];

    for (const item of selected) {
      try {
        const result = await importMediaAsProduct(item);
        results.push({ id: item.id, ...result });
      } catch (error) {
        results.push({
          id: item.id,
          error:
            error instanceof Error ? error.message : "Error al importar la pieza.",
        });
      }
    }

    const created = results.filter((item) => item.created).length;
    const failed = results.filter((item) => item.error).length;

    return NextResponse.json({
      imported: results.length - failed,
      created,
      failed,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo leer el feed de Instagram.",
      },
      { status: 502 },
    );
  }
}
