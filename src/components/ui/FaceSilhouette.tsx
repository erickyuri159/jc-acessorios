export type FaceShapeKey =
  | "redondo"
  | "cuadrado"
  | "ovalado"
  | "corazon"
  | "diamante"
  | "triangular"
  | "alargado";

type FaceSilhouetteProps = {
  shape: FaceShapeKey;
  className?: string;
  /** Colores del degradado de la silueta. */
  from?: string;
  to?: string;
};

/**
 * Silueta de rostro. Cada forma tiene su propio trazo: es la
 * pieza gráfica que hace tangible el análisis del probador.
 */
export function FaceSilhouette({
  shape,
  className = "",
  from = "#ff2e63",
  to = "#a855f7",
}: FaceSilhouetteProps) {
  const id = `forma-${shape}`;

  return (
    <svg
      viewBox="0 0 100 130"
      className={className}
      role="img"
      aria-label={`Silueta de rostro ${shape}`}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>

      <path
        d={PATHS[shape]}
        fill={`url(#${id})`}
        fillOpacity="0.16"
        stroke={`url(#${id})`}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PATHS: Record<FaceShapeKey, string> = {
  // Redondo: mejillas anchas, mentón estrecho.
  redondo:
    "M50 16c-22 0-33 15-33 38 0 20 9 33 14 45 5 11 9 17 19 17s14-6 19-17c5-12 14-25 14-45 0-23-11-38-33-38z",
  // Cuadrado: frente y mandíbula anchos, esquinas marcadas.
  cuadrado:
    "M22 40c0-14 12-22 28-22s28 8 28 22v38c0 20-11 32-28 32S22 98 22 78V40z",
  // Ovalado: el clásico equilibrado.
  ovalado:
    "M50 14c-18 0-27 16-27 42 0 24 12 42 27 42s27-18 27-42c0-26-9-42-27-42z",
  // Corazón: frente ancha, mentón puntiagudo.
  corazon:
    "M50 14c-19 0-30 13-30 33 0 18 10 30 17 42l13 25 13-25c7-12 17-24 17-42 0-20-11-33-30-33z",
  // Diamante: frente estrecha, pómulos anchos, mentón fino.
  diamante: "M50 12 79 50 50 118 21 50 50 12z",
  // Triangular: frente estrecha, mandíbula amplia.
  triangular: "M26 20h48l-10 58c-2 12-8 20-14 24-6-4-12-12-14-24L26 20z",
  // Alargado: muy largo y estrecho.
  alargado:
    "M50 8c-14 0-21 15-21 40 0 27 8 52 21 52s21-25 21-52c0-25-7-40-21-40z",
};
