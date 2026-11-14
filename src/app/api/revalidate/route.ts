import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Revalidación bajo demanda.
 *
 * Sanity llama a esta ruta cada vez que se publica, edita o borra un
 * documento. Así los cambios del panel aparecen en la web al instante
 * en vez de esperar a los 60 s del ISR.
 *
 * Configuración del webhook en sanity.io/manage → API → Webhooks:
 *   URL: https://TU-DOMINIO/api/revalidate?secret=SANITY_REVALIDATE_SECRET
 *   Filtro: _type in ["product", "siteConfig"]
 *   Disparadores: create, update, delete
 */

export const dynamic = "force-dynamic";

type WebhookPayload = {
  _type?: string;
  slug?: { current?: string };
};

async function revalidate(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const { searchParams } = new URL(request.url);

  if (secret && searchParams.get("secret") !== secret) {
    return NextResponse.json(
      { ok: false, error: "Secret inválido." },
      { status: 401 },
    );
  }

  let payload: WebhookPayload | null = null;
  if (request.method === "POST") {
    try {
      payload = (await request.json()) as WebhookPayload;
    } catch {
      payload = null;
    }
  }

  // El layout raíz invalida todas las páginas (inicio, colección, fichas…).
  revalidatePath("/", "layout");

  if (payload?.slug?.current) {
    revalidatePath(`/producto/${payload.slug.current}`);
  }

  return NextResponse.json({
    ok: true,
    type: payload?._type ?? null,
    slug: payload?.slug?.current ?? null,
  });
}

export async function POST(request: Request) {
  return revalidate(request);
}

export async function GET(request: Request) {
  return revalidate(request);
}
