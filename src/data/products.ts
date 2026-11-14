// ============================================================
// CATÁLOGO
// ------------------------------------------------------------
// Los productos del negocio viven aquí. Cuando se conecte el
// panel (Sanity), estos datos siguen sirviendo de respaldo para
// que el build nunca se rompa.
//
// ATENCIÓN: las piezas de esta lista son de DEMOSTRACIÓN. Hay
// que sustituirlas por el catálogo real (o publicar en el panel)
// antes de entregar la web a la tienda.
// ============================================================

export const categoryIds = [
  "pendientes",
  "collares",
  "pulseras",
  "anillos",
  "sets",
] as const;

export type CategoryId = (typeof categoryIds)[number];

export const categories: {
  id: CategoryId;
  title: string;
  tagline: string;
}[] = [
  {
    id: "pendientes",
    title: "Pendientes",
    tagline: "El corazón de la colección. Argollas, gotas y cascadas.",
  },
  {
    id: "collares",
    title: "Collares",
    tagline: "Cadenas finas y gargantillas para el día a día.",
  },
  {
    id: "pulseras",
    title: "Pulseras",
    tagline: "Cabecillas delicadas y pulsera fina.",
  },
  {
    id: "anillos",
    title: "Anillos",
    tagline: "Sellos y anillos de stacking.",
  },
  {
    id: "sets",
    title: "Sets",
    tagline: "Combinaciones completas con precio de conjunto.",
  },
];

export type StockStatus = "in-stock" | "low-stock" | "made-to-order";

export type ArType = "earring" | "necklace" | "bracelet" | "ring";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  materials: string;
  /** Imagen principal (fichero estático o CDN). */
  image: string;
  /** Imagen con fondo transparency para el probador AR. */
  arImage?: string;
  arType?: ArType;
  /** Tamaño del AR respecto al ancho de la cara (0.25 – 0.7). */
  arScale?: number;
  stock: StockStatus;
  featured?: boolean;
  /**
   * Etiquetas de estilo. El probador AR las usa para recomendar
   * piezas según la forma del rostro.
   */
  tags: string[];
  instagramUrl?: string;
  /** Pieza de muestra: solo sirve para probar el AR, no está a la venta. */
  isDemo?: boolean;
};

export const products: Product[] = [
  {
    id: "p-argolla-doha",
    slug: "argolla-doha",
    name: "Argolla Doha",
    category: "pendientes",
    price: 24.9,
    shortDescription: "Argolla abierta de oro laminado, ligera y everyday.",
    description:
      "Una argolla fina que aguanta el día entero sin pesar. Diseño abierto, se adapta a la oreja y combina con cualquier resto del outfit. Acabado en oro laminado con cierre de pression.",
    materials: "Acero inoxidable · oro laminado 18k",
    image: "/images/productos/argolla-dorada.svg",
    arImage: "/images/productos/argolla-dorada.svg",
    arType: "earring",
    arScale: 0.3,
    stock: "in-stock",
    featured: true,
    tags: ["sutil", "statement", "dorado"],
  },
  {
    id: "p-cascada-perlas",
    slug: "cascada-de-perlas",
    name: "Cascada de Perlas",
    category: "pendientes",
    price: 34.9,
    compareAtPrice: 39.9,
    shortDescription: "Perlas engastadas en cascada, para ocasiones y noches.",
    description:
      "Cuatro perlas de freshwater que caen en cascada sobre un hilo de acero. El brillo se va de suave a intenso según el ángulo. Un pendiente de eventos que también funciona a diario.",
    materials: "Perlas de freshwater · acero inoxidable",
    image: "/images/productos/cascada-perlas.svg",
    arImage: "/images/productos/cascada-perlas.svg",
    arType: "earring",
    arScale: 0.42,
    stock: "in-stock",
    featured: true,
    tags: ["largo", "elegante", "perla"],
  },
  {
    id: "p-gota-cristal",
    slug: "gota-de-cristal",
    name: "Gota de Cristal",
    category: "pendientes",
    price: 19.9,
    shortDescription: "Gota facetada con destello frío. El pendiente que alarga el rostro.",
    description:
      "Cristal facetado con engaste de oro. Es el pendiente que más favorece los rostros redondos porque alarga visualmente. Ligero y con mucho brillo.",
    materials: "Cristal facetado · acero inoxidable · oro laminado",
    image: "/images/productos/gota-cristal.svg",
    arImage: "/images/productos/gota-cristal.svg",
    arType: "earring",
    arScale: 0.36,
    stock: "low-stock",
    featured: true,
    tags: ["largo", "delicado", "frio"],
  },
  {
    id: "p-medallon-vintage",
    slug: "medallon-vintage",
    name: "Medallón Vintage",
    category: "pendientes",
    price: 29.9,
    shortDescription: "Medallón geométrico con aire retro.",
    description:
      "Una pieza con carácter: rombo dorado con textura interior. Statement statement para quien quiere que las orejas hablen.",
    materials: "Latón con baño de oro",
    image: "/images/productos/medallon-vintage.svg",
    arImage: "/images/productos/medallon-vintage.svg",
    arType: "earring",
    arScale: 0.34,
    stock: "made-to-order",
    tags: ["statement", "retro", "dorado"],
  },
  {
    id: "p-collar-cadena",
    slug: "collar-cadena-fina",
    name: "Collar Cadena Fina",
    category: "collares",
    price: 27.9,
    shortDescription: "Cadena fina con medallón central.",
    description:
      "Cadena fina regulable con un medallón central. Se lleva sola o en capas con otros collares de la colección.",
    materials: "Acero inoxidable · oro laminado",
    image: "/images/productos/collar-cadena.svg",
    arImage: "/images/productos/collar-cadena.svg",
    arType: "necklace",
    arScale: 0.72,
    stock: "in-stock",
    tags: ["sutil", "dorado"],
  },
  {
    id: "p-pulsera-cabecilla",
    slug: "pulsera-de-cabecillas",
    name: "Pulsera de Cabecillas",
    category: "pulseras",
    price: 22.9,
    shortDescription: "Pulsera elástica con cabecillas doradas.",
    description:
      "Pulsera elástica con cuatro cabecillas y cierre ajustable. Sin cierre, sin tensión: se pone y se lleva.",
    materials: "Acero inoxidable · oro laminado",
    image: "/images/productos/pulsera-cabecilla.svg",
    arImage: "/images/productos/pulsera-cabecilla.svg",
    arType: "bracelet",
    arScale: 0.5,
    stock: "in-stock",
    tags: ["sutil", "dorado"],
  },
  {
    id: "p-anillo-sello",
    slug: "anillo-de-sello",
    name: "Anillo de Sello",
    category: "anillos",
    price: 32.9,
    shortDescription: "Sello con engraving personalizable.",
    description:
      "Anillo de sello con engraved a medida. Elige la fecha, las iniciales o la palabra que quieras grabada: se prepara en 48 horas.",
    materials: "Acero inoxidable · grabado a laser",
    image: "/images/productos/anillo-sello.svg",
    stock: "made-to-order",
    tags: ["statement", "personalizable"],
  },
  {
    id: "p-set-oro",
    slug: "set-medida",
    name: "Set Medida",
    category: "sets",
    price: 69.9,
    compareAtPrice: 82.7,
    shortDescription: "Argollas, gargantilla y pulsera. El conjunto completo.",
    description:
      "El pack que mejor funciona: una argolla, una gargantilla y una pulsera. Comprado por separado cuesta 82,70 €; en set, 69,90 €.",
    materials: "Acero inoxidable · oro laminado",
    image: "/images/productos/set-oro.svg",
    arImage: "/images/productos/set-oro.svg",
    arType: "earring",
    arScale: 0.3,
    stock: "in-stock",
    featured: true,
    tags: ["sutil", "dorado", "regalo"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/**
 * Piezas de muestra para el probador.
 *
 * Permiten enseñar la realidad aumentada aunque la tienda todavía no
 * tenga sus fotos recortadas. Se mezclan con el catálogo real solo en
 * la página del probador: no aparecen en la colección ni se pueden
 * comprar.
 */
export const demoTryOnPieces: Product[] = products
  .filter(
    (product) =>
      Boolean(product.arImage) &&
      (product.arType === "earring" || product.arType === "necklace"),
  )
  .map((product) => ({ ...product, isDemo: true }));

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
