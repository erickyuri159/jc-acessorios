// ============================================================
// DATOS ESTRUCTURADOS (Schema.org)
// ------------------------------------------------------------
// Solo se publican campos confirmados. Si la dirección o el
// horario no están, se omiten en lugar de inventarlos.
// ============================================================

import type { BusinessConfig } from "./content";
import type { Product } from "@/data/products";
import { siteUrl } from "@/data/business";

/** Ficha de la tienda (Google Maps y Knowledge Graph). */
export function jewelryStoreSchema(business: BusinessConfig) {
  const hasAddress =
    business.address.street.trim() !== "" &&
    !business.address.street.startsWith("[");
  const hasGeo =
    typeof business.map.latitude === "number" &&
    typeof business.map.longitude === "number";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: business.name,
    url: siteUrl,
    image: `${siteUrl}/og.jpg`,
    telephone: business.telephone,
    currenciesAccepted: "EUR",
    paymentAccepted: business.payments.bizumEnabled
      ? "Bizum, Efectivo"
      : "Efectivo",
    areaServed: [
      { "@type": "City", name: "Mislata" },
      { "@type": "City", name: "Valencia" },
      { "@type": "Country", name: "España" },
      { "@type": "Place", name: "Unión Europea" },
    ],
  };

  if (hasAddress) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: "ES",
    };
  }
  if (hasGeo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: business.map.latitude,
      longitude: business.map.longitude,
    };
  }
  if (business.social.instagram) {
    schema.sameAs = [business.social.instagram].filter(Boolean);
  }
  if (business.openingHours.mondayToFriday && !business.openingHours.mondayToFriday.startsWith("[")) {
    schema.openingHours = business.openingHours.mondayToFriday;
  }

  return schema;
}

/** Ficha de producto con precio y disponibilidad. */
export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.image ? [`${siteUrl}${product.image}`] : undefined,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      availability:
        product.stock === "made-to-order"
          ? "https://schema.org/PreOrder"
          : "https://schema.org/InStock",
      url: `${siteUrl}/producto/${product.slug}`,
      seller: { "@type": "Organization", name: "JP Accesorios" },
    },
  };
}

/** Migas de pan. */
export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.href}`,
    })),
  };
}
