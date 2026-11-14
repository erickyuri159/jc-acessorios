// ============================================================
// CONTENIDO DEL SITIO — FUENTE DE VERDAD
// ------------------------------------------------------------
// `getSiteContent()` devuelve el contenido combinado de la tienda:
//   - si SANITY_PROJECT_ID está definido, lee el documento de
//     Sanity (editable por la dueña sin tocar código) y el
//     catálogo de piezas publicado;
//   - si no, o si la consulta falla, usa los datos de src/data/
//     como respaldo para que el build nunca se rompa.
// ============================================================

import { business as businessFallback } from "@/data/business";
import { site as siteFallback } from "@/data/site";
import {
  categories as categoriesFallback,
  products as productsFallback,
  type CategoryId,
  type Product,
} from "@/data/products";
import { isContentCmsConfigured, sanityClient, sanityImageSrc } from "./sanity";

export type BusinessConfig = {
  name: string;
  shortName: string;
  legalName: string;
  taxId: string;
  telephone: string;
  telephoneE164: string;
  whatsappNumber: string;
  email: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
  };
  openingHours: {
    mondayToFriday: string;
    saturday: string;
    sunday: string;
  };
  map: { latitude: number | null; longitude: number | null };
  mapsProfileUrl: string;
  social: { instagram: string; facebook: string };
  shipping: {
    localPickup: boolean;
    localPickupNote: string;
    localDeliveryNote: string;
    spainNote: string;
    europeNote: string;
    spainShippingCost: number;
    europeShippingCost: number;
    spainDeliveryDays: string;
    europeDeliveryDays: string;
    freeShippingFrom: number;
  };
  payments: {
    bizumEnabled: boolean;
    bizumPhone: string;
    bizumPaymentLink: string;
    cardEnabled: boolean;
    bankTransferEnabled: boolean;
  };
  newsletterFormUrl: string;
};

export type SiteConfig = {
  meta: { title: string; description: string };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    ctaPrimary: string;
    ctaSecondary: string;
  };
  catalog: { kicker: string; title: string; intro: string };
  tryOn: {
    kicker: string;
    title: string;
    intro: string;
    bullets: string[];
    cta: string;
  };
  faceShape: { kicker: string; title: string; intro: string; cta: string };
  passport: { kicker: string; title: string; intro: string; points: string[]; cta: string };
  shipping: { kicker: string; title: string; intro: string; points: string[] };
  instagram: { kicker: string; title: string; intro: string; cta: string };
  contact: { kicker: string; title: string; text: string };
  nav: { label: string; href: string }[];
};

export type SiteContent = {
  business: BusinessConfig;
  site: SiteConfig;
  products: Product[];
  categories: { id: CategoryId; title: string; tagline: string }[];
};

/* ------------------------------------------------------------
 * Respaldo local (datos actuales de src/data/)
 * ---------------------------------------------------------- */

function fallbackContent(): SiteContent {
  return {
    business: {
      ...businessFallback,
      address: { ...businessFallback.address },
      openingHours: { ...businessFallback.openingHours },
      map: { ...businessFallback.map },
      social: { ...businessFallback.social },
      shipping: { ...businessFallback.shipping },
      payments: { ...businessFallback.payments },
    },
    site: {
      ...siteFallback,
      hero: { ...siteFallback.hero, image: { ...siteFallback.hero.image } },
      catalog: { ...siteFallback.catalog },
      tryOn: { ...siteFallback.tryOn, bullets: [...siteFallback.tryOn.bullets] },
      faceShape: { ...siteFallback.faceShape },
      passport: { ...siteFallback.passport, points: [...siteFallback.passport.points] },
      shipping: { ...siteFallback.shipping, points: [...siteFallback.shipping.points] },
      instagram: { ...siteFallback.instagram },
      contact: { ...siteFallback.contact },
      nav: siteFallback.nav.map((item) => ({ ...item })),
    },
    products: productsFallback.map((product) => ({ ...product, tags: [...product.tags] })),
    categories: categoriesFallback.map((category) => ({ ...category })),
  };
}

/* ------------------------------------------------------------
 * Documentos de Sanity
 * ---------------------------------------------------------- */

type SanityImageField = { asset: { _ref: string } };

type RawConfig = {
  name?: string;
  shortName?: string;
  legalName?: string;
  taxId?: string;
  telephone?: string;
  telephoneE164?: string;
  whatsappNumber?: string;
  email?: string;
  address?: { street?: string; locality?: string; region?: string; postalCode?: string };
  openingHours?: { mondayToFriday?: string; saturday?: string; sunday?: string };
  map?: { latitude?: number; longitude?: number; mapsProfileUrl?: string };
  social?: { instagram?: string; facebook?: string };
  shipping?: Partial<BusinessConfig["shipping"]>;
  payments?: Partial<BusinessConfig["payments"]>;
  newsletterFormUrl?: string;
  meta?: { title?: string; description?: string };
  hero?: {
    kicker?: string;
    title?: string;
    subtitle?: string;
    image?: SanityImageField;
    imageAlt?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
  };
  catalog?: { kicker?: string; title?: string; intro?: string };
  tryOn?: { kicker?: string; title?: string; intro?: string; bullets?: string[]; cta?: string };
  faceShape?: { kicker?: string; title?: string; intro?: string; cta?: string };
  passport?: { kicker?: string; title?: string; intro?: string; points?: string[]; cta?: string };
  shippingFlow?: { kicker?: string; title?: string; intro?: string; points?: string[] };
  instagram?: { kicker?: string; title?: string; intro?: string; cta?: string };
  contact?: { kicker?: string; title?: string; text?: string };
  nav?: { label?: string; href?: string }[];
};

type RawProduct = {
  _id?: string;
  title?: string;
  slug?: { current?: string };
  price?: number;
  compareAtPrice?: number;
  category?: string;
  shortDescription?: string;
  description?: string;
  materials?: string;
  image?: SanityImageField;
  arImage?: SanityImageField;
  arType?: string;
  arScale?: number;
  stock?: string;
  featured?: boolean;
  tags?: string[];
  instagramUrl?: string;
};

function firstNonEmpty(...values: (string | undefined)[]): string | undefined {
  return values.find((value) => value !== undefined && value.trim() !== "");
}

/* ------------------------------------------------------------
 * Normalización de texto y slugs
 * ------------------------------------------------------------
 * El panel es libre: alguien puede pegar una URL de Instagram en
 * el campo «slug» o dejar caracteres de control en el título.
 * Aquí se limpia todo antes de construir rutas, para que el build
 * nunca intente crear carpetas con «://» dentro.
 */

function cleanText(value: string | undefined): string {
  return (value ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

function slugify(value: string | undefined): string {
  return cleanText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

const VALID_CATEGORIES = new Set<string>(categoriesFallback.map((c) => c.id));

function mapProduct(
  raw: RawProduct,
  index: number,
  usedSlugs?: Set<string>,
): Product | null {
  const title = cleanText(raw.title);
  if (!title) return null;

  const fromSlug = slugify(raw.slug?.current);
  const fromTitle = slugify(title);
  // Si en el panel pegan una URL en el slug, se ignora y se usa el título.
  const base =
    fromSlug && !/^https?-/.test(fromSlug)
      ? fromSlug
      : fromTitle || `pieza-${index + 1}`;

  let slug = base;
  if (usedSlugs) {
    let n = 2;
    while (usedSlugs.has(slug)) {
      slug = `${base}-${n}`;
      n += 1;
    }
    usedSlugs.add(slug);
  }

  const category = (raw.category && VALID_CATEGORIES.has(raw.category)
    ? raw.category
    : "pendientes") as CategoryId;

  return {
    id: raw._id || `p-${slug}`,
    slug,
    name: title,
    category,
    price: typeof raw.price === "number" ? raw.price : 0,
    compareAtPrice:
      typeof raw.compareAtPrice === "number" ? raw.compareAtPrice : undefined,
    shortDescription: raw.shortDescription ?? "",
    description: raw.description ?? "",
    materials: raw.materials ?? "",
    image: sanityImageSrc(raw.image) || "/images/productos/argolla-dorada.svg",
    arImage: sanityImageSrc(raw.arImage) || undefined,
    arType:
      raw.arType === "earring" ||
      raw.arType === "necklace" ||
      raw.arType === "bracelet" ||
      raw.arType === "ring"
        ? raw.arType
        : undefined,
    arScale: typeof raw.arScale === "number" ? raw.arScale : undefined,
    stock:
      raw.stock === "low-stock" || raw.stock === "made-to-order"
        ? raw.stock
        : "in-stock",
    featured: Boolean(raw.featured),
    tags: raw.tags ?? [],
    instagramUrl: raw.instagramUrl,
  };
}

/* ------------------------------------------------------------
 * API pública
 * ---------------------------------------------------------- */

export async function getSiteContent(): Promise<SiteContent> {
  if (!isContentCmsConfigured || !sanityClient) {
    return fallbackContent();
  }

  try {
    const [raw, rawProducts] = await Promise.all([
      sanityClient.fetch<RawConfig | null>(`*[_type == "siteConfig"][0]`),
      sanityClient.fetch<RawProduct[]>(
        `*[_type == "product"] | order(featured desc, _createdAt desc)`,
      ),
    ]);

    const content = fallbackContent();
    const b = content.business;
    const s = content.site;

    if (raw) {
      b.name = firstNonEmpty(raw.name, b.name) ?? b.name;
      b.shortName = firstNonEmpty(raw.shortName, b.shortName) ?? b.shortName;
      b.legalName = firstNonEmpty(raw.legalName, b.legalName) ?? b.legalName;
      b.taxId = firstNonEmpty(raw.taxId, b.taxId) ?? b.taxId;
      b.telephone = firstNonEmpty(raw.telephone, b.telephone) ?? b.telephone;
      b.telephoneE164 =
        firstNonEmpty(raw.telephoneE164, b.telephoneE164) ?? b.telephoneE164;
      b.whatsappNumber =
        firstNonEmpty(raw.whatsappNumber, b.whatsappNumber) ?? b.whatsappNumber;
      b.email = firstNonEmpty(raw.email, b.email) ?? b.email;

      if (raw.address) {
        b.address.street = firstNonEmpty(raw.address.street, b.address.street) ?? b.address.street;
        b.address.locality = firstNonEmpty(raw.address.locality, b.address.locality) ?? b.address.locality;
        b.address.region = firstNonEmpty(raw.address.region, b.address.region) ?? b.address.region;
        b.address.postalCode = firstNonEmpty(raw.address.postalCode, b.address.postalCode) ?? b.address.postalCode;
      }
      if (raw.openingHours) {
        b.openingHours.mondayToFriday =
          firstNonEmpty(raw.openingHours.mondayToFriday, b.openingHours.mondayToFriday) ??
          b.openingHours.mondayToFriday;
        b.openingHours.saturday =
          firstNonEmpty(raw.openingHours.saturday, b.openingHours.saturday) ??
          b.openingHours.saturday;
        b.openingHours.sunday =
          firstNonEmpty(raw.openingHours.sunday, b.openingHours.sunday) ??
          b.openingHours.sunday;
      }
      if (raw.map) {
        if (typeof raw.map.latitude === "number") b.map.latitude = raw.map.latitude;
        if (typeof raw.map.longitude === "number") b.map.longitude = raw.map.longitude;
        b.mapsProfileUrl = firstNonEmpty(raw.map.mapsProfileUrl, b.mapsProfileUrl) ?? b.mapsProfileUrl;
      }
      if (raw.social) {
        b.social.instagram = firstNonEmpty(raw.social.instagram, b.social.instagram) ?? b.social.instagram;
        b.social.facebook = firstNonEmpty(raw.social.facebook, b.social.facebook) ?? b.social.facebook;
      }
      if (raw.shipping) {
        Object.assign(b.shipping, raw.shipping);
      }
      if (raw.payments) {
        Object.assign(b.payments, raw.payments);
      }
      b.newsletterFormUrl =
        firstNonEmpty(raw.newsletterFormUrl, b.newsletterFormUrl) ?? b.newsletterFormUrl;

      if (raw.meta) {
        s.meta.title = firstNonEmpty(raw.meta.title, s.meta.title) ?? s.meta.title;
        s.meta.description =
          firstNonEmpty(raw.meta.description, s.meta.description) ?? s.meta.description;
      }
      if (raw.hero) {
        s.hero.kicker = firstNonEmpty(raw.hero.kicker, s.hero.kicker) ?? s.hero.kicker;
        s.hero.title = firstNonEmpty(raw.hero.title, s.hero.title) ?? s.hero.title;
        s.hero.subtitle = firstNonEmpty(raw.hero.subtitle, s.hero.subtitle) ?? s.hero.subtitle;
        s.hero.image.src = sanityImageSrc(raw.hero.image) || s.hero.image.src;
        s.hero.image.alt = firstNonEmpty(raw.hero.imageAlt, s.hero.image.alt) ?? s.hero.image.alt;
        s.hero.ctaPrimary = firstNonEmpty(raw.hero.ctaPrimary, s.hero.ctaPrimary) ?? s.hero.ctaPrimary;
        s.hero.ctaSecondary =
          firstNonEmpty(raw.hero.ctaSecondary, s.hero.ctaSecondary) ?? s.hero.ctaSecondary;
      }
      if (raw.catalog) {
        s.catalog.kicker = firstNonEmpty(raw.catalog.kicker, s.catalog.kicker) ?? s.catalog.kicker;
        s.catalog.title = firstNonEmpty(raw.catalog.title, s.catalog.title) ?? s.catalog.title;
        s.catalog.intro = firstNonEmpty(raw.catalog.intro, s.catalog.intro) ?? s.catalog.intro;
      }
      if (raw.tryOn) {
        s.tryOn.kicker = firstNonEmpty(raw.tryOn.kicker, s.tryOn.kicker) ?? s.tryOn.kicker;
        s.tryOn.title = firstNonEmpty(raw.tryOn.title, s.tryOn.title) ?? s.tryOn.title;
        s.tryOn.intro = firstNonEmpty(raw.tryOn.intro, s.tryOn.intro) ?? s.tryOn.intro;
        if (raw.tryOn.bullets?.length) s.tryOn.bullets = raw.tryOn.bullets.filter(Boolean);
        s.tryOn.cta = firstNonEmpty(raw.tryOn.cta, s.tryOn.cta) ?? s.tryOn.cta;
      }
      if (raw.faceShape) {
        s.faceShape.kicker = firstNonEmpty(raw.faceShape.kicker, s.faceShape.kicker) ?? s.faceShape.kicker;
        s.faceShape.title = firstNonEmpty(raw.faceShape.title, s.faceShape.title) ?? s.faceShape.title;
        s.faceShape.intro = firstNonEmpty(raw.faceShape.intro, s.faceShape.intro) ?? s.faceShape.intro;
        s.faceShape.cta = firstNonEmpty(raw.faceShape.cta, s.faceShape.cta) ?? s.faceShape.cta;
      }
      if (raw.passport) {
        s.passport.kicker = firstNonEmpty(raw.passport.kicker, s.passport.kicker) ?? s.passport.kicker;
        s.passport.title = firstNonEmpty(raw.passport.title, s.passport.title) ?? s.passport.title;
        s.passport.intro = firstNonEmpty(raw.passport.intro, s.passport.intro) ?? s.passport.intro;
        if (raw.passport.points?.length) s.passport.points = raw.passport.points.filter(Boolean);
        s.passport.cta = firstNonEmpty(raw.passport.cta, s.passport.cta) ?? s.passport.cta;
      }
      if (raw.shippingFlow) {
        s.shipping.kicker = firstNonEmpty(raw.shippingFlow.kicker, s.shipping.kicker) ?? s.shipping.kicker;
        s.shipping.title = firstNonEmpty(raw.shippingFlow.title, s.shipping.title) ?? s.shipping.title;
        s.shipping.intro = firstNonEmpty(raw.shippingFlow.intro, s.shipping.intro) ?? s.shipping.intro;
        if (raw.shippingFlow.points?.length) s.shipping.points = raw.shippingFlow.points.filter(Boolean);
      }
      if (raw.instagram) {
        s.instagram.kicker = firstNonEmpty(raw.instagram.kicker, s.instagram.kicker) ?? s.instagram.kicker;
        s.instagram.title = firstNonEmpty(raw.instagram.title, s.instagram.title) ?? s.instagram.title;
        s.instagram.intro = firstNonEmpty(raw.instagram.intro, s.instagram.intro) ?? s.instagram.intro;
        s.instagram.cta = firstNonEmpty(raw.instagram.cta, s.instagram.cta) ?? s.instagram.cta;
      }
      if (raw.contact) {
        s.contact.kicker = firstNonEmpty(raw.contact.kicker, s.contact.kicker) ?? s.contact.kicker;
        s.contact.title = firstNonEmpty(raw.contact.title, s.contact.title) ?? s.contact.title;
        s.contact.text = firstNonEmpty(raw.contact.text, s.contact.text) ?? s.contact.text;
      }
      if (raw.nav?.length) {
        s.nav = raw.nav
          .filter((item) => item?.label && item.href)
          .map((item) => ({ label: item!.label!, href: item!.href! }));
      }
    }

    if (rawProducts?.length) {
      const usedSlugs = new Set<string>();
      const mapped = rawProducts
        .map((product, index) => mapProduct(product, index, usedSlugs))
        .filter((product): product is Product => product !== null);
      if (mapped.length) content.products = mapped;
    }

    return content;
  } catch {
    return fallbackContent();
  }
}
