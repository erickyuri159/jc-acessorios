// ============================================================
// ANÁLISIS DE FORMA DE ROSTRO
// ------------------------------------------------------------
// El probador AR mide la cara con los landmarks de MediaPipe y
// la clasifica. A partir de la forma se recomiendan las piezas
// que mejor favorecen ese rostro.
//
// Todo el cálculo ocurre en el dispositivo: las coordenadas no
// salen nunca del navegador.
// ============================================================

import type { Product } from "@/data/products";

export type Landmark = { x: number; y: number; z: number };

export type FaceShape =
  | "redondo"
  | "ovalado"
  | "cuadrado"
  | "triangular"
  | "corazon"
  | "diamante"
  | "alargado";

export type FaceAnalysis = {
  shape: FaceShape;
  /** Etiquetas de estilo que favorecen a esa forma de rostro. */
  preferredTags: string[];
  /** Explicación corta para la cliente. */
  advice: string;
  /** Métricas usadas, por si hay que depurar el ajuste. */
  metrics: {
    ratio: number;
    jawRatio: number;
    foreheadRatio: number;
  };
};

// Índices de MediaPipe Face Mesh que nos interesan.
const IDX = {
  foreheadTop: 10,
  chin: 152,
  sideLeft: 234,
  sideRight: 454,
  jawLeft: 172,
  jawRight: 397,
  templeLeft: 103,
  templeRight: 332,
  cheekLeft: 93,
  cheekRight: 323,
} as const;

export const FACE_SHAPE_LABELS: Record<FaceShape, string> = {
  redondo: "Redondo",
  ovalado: "Ovalado",
  cuadrado: "Cuadrado",
  triangular: "Triangular",
  corazon: "Corazón",
  diamante: "Diamante",
  alargado: "Alargado",
};

export const FACE_SHAPE_ADVICE: Record<FaceShape, string> = {
  redondo:
    "Los pendientes largos y verticales estiran el rostro. Evita los muy anchos o redondeados.",
  ovalado:
    "Es la forma más equilibrada: casi todo te favorece. Los statement son tu mejor aliado.",
  cuadrado:
    "Las líneas curvas y los volantes redondeados suavizan la mandíbula. Los geométricos muy rectos la endurecen.",
  triangular:
    "Equilibra la mandíbula con piezas amplias en la parte superior: argollas grandes y Statement.",
  corazon:
    "La frente ancha se compensa con piezas delicadas y ligeras que miran hacia la mejilla.",
  diamante:
    "Los pendientes statement con movimiento en la parte inferior equilibran los pómulos marcados.",
  alargado:
    "Los pendientes anchos y las piezas con volumen horizontal acortan visualmente el rostro.",
};

/** Etiquetas de estilo que favorecen cada forma de rostro. */
const PREFERRED_TAGS: Record<FaceShape, string[]> = {
  redondo: ["largo", "statement", "elegante"],
  ovalado: ["statement", "largo", "sutil", "elegante"],
  cuadrado: ["delicado", "sutil", "elegante"],
  triangular: ["statement", "sutil"],
  corazon: ["delicado", "sutil"],
  diamante: ["statement", "elegante"],
  alargado: ["statement", "retro"],
};

function pixelPoint(
  landmarks: Landmark[],
  index: number,
  width: number,
  height: number,
) {
  const landmark = landmarks[index];
  return { x: landmark.x * width, y: landmark.y * height };
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Clasifica la forma del rostro a partir de los landmarks.
 * Devuelve null si la cara no está bien visible.
 */
export function analyseFace(
  landmarks: Landmark[],
  width: number,
  height: number,
): FaceAnalysis | null {
  if (!landmarks || landmarks.length < 468) return null;

  const faceWidth = distance(
    pixelPoint(landmarks, IDX.sideLeft, width, height),
    pixelPoint(landmarks, IDX.sideRight, width, height),
  );
  const faceHeight = distance(
    pixelPoint(landmarks, IDX.foreheadTop, width, height),
    pixelPoint(landmarks, IDX.chin, width, height),
  );

  if (faceWidth <= 0 || faceHeight <= 0) return null;

  const jawWidth = distance(
    pixelPoint(landmarks, IDX.jawLeft, width, height),
    pixelPoint(landmarks, IDX.jawRight, width, height),
  );
  const foreheadWidth = distance(
    pixelPoint(landmarks, IDX.templeLeft, width, height),
    pixelPoint(landmarks, IDX.templeRight, width, height),
  );
  const cheekWidth = distance(
    pixelPoint(landmarks, IDX.cheekLeft, width, height),
    pixelPoint(landmarks, IDX.cheekRight, width, height),
  );

  const ratio = faceHeight / faceWidth;
  const jawRatio = jawWidth / Math.max(cheekWidth, 1);
  const foreheadRatio = foreheadWidth / Math.max(jawWidth, 1);
  const cheekRatio = cheekWidth / Math.max(jawWidth, 1);

  let shape: FaceShape;

  if (ratio < 1.45) {
    shape = "redondo";
  } else if (ratio > 1.8) {
    shape = "alargado";
  } else if (jawRatio > 0.8) {
    shape = "cuadrado";
  } else if (foreheadRatio > 1.12) {
    shape = "corazon";
  } else if (cheekRatio > 1.08 && foreheadRatio < 0.92) {
    shape = "diamante";
  } else if (jawRatio < 0.78) {
    shape = "triangular";
  } else {
    shape = "ovalado";
  }

  return {
    shape,
    preferredTags: PREFERRED_TAGS[shape],
    advice: FACE_SHAPE_ADVICE[shape],
    metrics: { ratio, jawRatio, foreheadRatio },
  };
}

/**
 * Ordena el catálogo según lo que mejor favorece a la forma de
 * rostro detectada. Las piezas con más etiquetas coincidentes
 * suben; el resto mantiene su orden original.
 */
export function recommendProducts(
  products: Product[],
  analysis: FaceAnalysis | null,
): Product[] {
  if (!analysis) return products;

  const score = (product: Product) =>
    product.tags.reduce(
      (total, tag) => total + (analysis.preferredTags.includes(tag) ? 1 : 0),
      0,
    );

  return products
    .map((product, index) => ({ product, index, score: score(product) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.product);
}
