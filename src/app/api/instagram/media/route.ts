// ============================================================
// API — Publicaciones recientes de Instagram
// ------------------------------------------------------------
// GET /api/instagram/media
//   Devuelve las publicaciones de la tienda ya interpretadas
//   como borradores de producto. El token se queda en el
//   servidor: el Studio nunca lo ve.
// ============================================================

import { NextResponse } from "next/server";
import {
  fetchInstagramMedia,
  isInstagramConfigured,
  mediaToDraft,
} from "@/lib/instagram";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isInstagramConfigured()) {
    return NextResponse.json(
      {
        error:
          "Instagram no está conectado. Añade INSTAGRAM_ACCESS_TOKEN al entorno del servidor.",
      },
      { status: 503 },
    );
  }

  try {
    const media = await fetchInstagramMedia(25);
    return NextResponse.json({
      drafts: media.map(mediaToDraft),
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
