import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "JP Accesorios — probador de joyería en realidad aumentada";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagen social generada en el servidor: fondo obsidiana, la gema
 * de la marca y el titular del probador.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 20% 10%, #2a2140 0%, #07060b 60%)",
          padding: 72,
          color: "#f7f2e8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#fff4d4,#e7be6a 45%,#a97c2c)",
              color: "#07060b",
              fontSize: 34,
              fontWeight: 700,
              clipPath:
                "polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)",
            }}
          >
            JP
          </div>
          <div
            style={{
              fontSize: 30,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#e7be6a",
            }}
          >
            JP Accesorios · Mislata
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, lineHeight: 1.02, maxWidth: 980 }}>
            Pruébatelos antes de comprarlos
          </div>
          <div style={{ fontSize: 34, color: "#a49cb8", marginTop: 28 }}>
            Probador de joyería en realidad aumentada · Envío a España y Europa
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 10,
            background:
              "linear-gradient(90deg,#ff2e63,#ffd84d,#00e5a0,#3b82f6,#a855f7)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
