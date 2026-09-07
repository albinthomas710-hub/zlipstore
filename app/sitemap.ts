import { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL = "https://zlipstore.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.getProducts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categories = [
    "latest-drops",
    "trending-now",
    "footwears",
    "gadgets",
    "clothes",
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
