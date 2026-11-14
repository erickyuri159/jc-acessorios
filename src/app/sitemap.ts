import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/business";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/coleccion`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/provador`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/como-comprar`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/producto/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
