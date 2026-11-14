import { useCallback, useEffect, useState } from "react";
import type { StructureBuilder } from "sanity/structure";

/**
 * Herramienta del panel: importa publicaciones recientes de
 * Instagram como fichas de producto.
 *
 * El Studio NO habla con Instagram directamente: llama a la API
 * del sitio (que guarda el token en el servidor) y esta se ocupa
 * de descargar las fotos y subirlas al asset de Sanity.
 */

const SITE_URL = (
  process.env.SANITY_STUDIO_SITE_URL ?? "https://jp-accesorios.es"
).replace(/\/$/, "");

type Draft = {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  category: string;
  permalink: string;
  mediaUrl: string;
};

export function instagramImportTool(S: StructureBuilder) {
  return S.listItem()
    .title("Importar desde Instagram")
    .id("instagramImport")
    .child(
      S.component()
        .id("instagramImport")
        .title("Importar desde Instagram")
        .component(InstagramImport),
    );
}

function InstagramImport() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setStatus("Leyendo publicaciones de Instagram…");
    try {
      const response = await fetch(`${SITE_URL}/api/instagram/media`);
      const json = await response.json();
      if (!response.ok) {
        setError(json?.error ?? "No se pudo leer el feed de Instagram.");
        setStatus("");
        return;
      }
      const list: Draft[] = json.drafts ?? [];
      setDrafts(list);
      setSelected(list.map((item) => item.id));
      setStatus(
        list.length
          ? `${list.length} publicaciones encontradas. Desmarca las que no quieras importar.`
          : "No hay publicaciones nuevas.",
      );
    } catch {
      setError(
        `No se pudo contactar con ${SITE_URL}. Comprueba que la web esté publicada.`,
      );
      setStatus("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runImport = useCallback(async () => {
    setLoading(true);
    setError("");
    setStatus("Importando… (las fotos se descargan de Instagram)");
    try {
      const response = await fetch(`${SITE_URL}/api/instagram/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json?.error ?? "La importación ha fallado.");
        setStatus("");
        return;
      }
      setStatus(
        `Importación terminada: ${json.imported} piezas (${json.created} nuevas, ${json.failed} con errores).`,
      );
    } catch {
      setError("No se pudo contactar con la web.");
      setStatus("");
    } finally {
      setLoading(false);
    }
  }, [selected]);

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "60rem" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Importar desde Instagram
      </h2>
      <p style={{ color: "#555", maxWidth: "44rem", lineHeight: 1.5 }}>
        Trae las publicaciones de la cuenta de la tienda como fichas de
        producto.         Del pie de foto se extraen el nombre, el precio (si aparece) y la
        categoría. La foto se descarga y se guarda en Sanity: el catálogo
        deja de depender de Instagram. Después revisa cada ficha y publícala.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", margin: "1.5rem 0" }}>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          style={{
            padding: "0.6rem 1.1rem",
            borderRadius: "999px",
            border: "1px solid #ccc",
            background: "white",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          Actualizar
        </button>
        <button
          type="button"
          onClick={() => void runImport()}
          disabled={loading || selected.length === 0}
          style={{
            padding: "0.6rem 1.1rem",
            borderRadius: "999px",
            border: "none",
            background: "#c0a062",
            color: "#1b1b1b",
            fontWeight: 700,
            cursor: loading || !selected.length ? "not-allowed" : "pointer",
            opacity: loading || !selected.length ? 0.5 : 1,
          }}
        >
          Importar seleccionadas ({selected.length})
        </button>
      </div>

      {status ? <p style={{ color: "#1b1b1b" }}>{status}</p> : null}
      {error ? (
        <p
          style={{
            color: "#b00020",
            background: "#fdecee",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
          }}
        >
          {error}
        </p>
      ) : null}

      <ul style={{ listStyle: "none", padding: 0, marginTop: "1.5rem" }}>
        {drafts.map((draft) => (
          <li
            key={draft.id}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              padding: "0.75rem",
              borderTop: "1px solid #eee",
            }}
          >
            <input
              type="checkbox"
              checked={selected.includes(draft.id)}
              onChange={() => toggle(draft.id)}
              aria-label={`Seleccionar ${draft.title}`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={draft.mediaUrl}
              alt=""
              width={64}
              height={64}
              style={{ objectFit: "cover", borderRadius: "0.5rem" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>{draft.title}</p>
              <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>
                {draft.category}
                {draft.price !== null ? ` · ${draft.price} €` : " · sin precio"}
                {` · /producto/${draft.slug}`}
              </p>
            </div>
            <a
              href={draft.permalink}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.85rem" }}
            >
              Ver post
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
