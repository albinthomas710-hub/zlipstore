import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductPageClient from "./client";
import { Metadata } from "next";

const BASE_URL = "https://zlipstore.in";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.getProductBySlug(slug);
  if (!product) return { title: "Product Not Found | Zlip Store" };

  const title = `Buy ${product.name} — ${product.category.replace(/-/g, " ")} | Zlip Store`;
  const description =
    product.description ||
    `Shop ${product.name} at Zlip Store. ${product.inStock ? "In stock" : "Limited stock"}. ${
      product.sizes?.length ? `Available in sizes: ${product.sizes.map((s) => s.label).join(", ")}.` : ""
    } All India delivery. Order via WhatsApp.`;

  const image = product.images?.[0] || `${BASE_URL}/og-image.jpg`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: description,
    image: image.startsWith("http") ? image : `${BASE_URL}${image}`,
    brand: {
      "@type": "Brand",
      name: "Zlip Store",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.priceMode === "display" && product.price ? product.price : undefined,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Zlip Store",
      },
    },
    category: product.category.replace(/-/g, " "),
  };

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category.replace(/-/g, " "),
      "buy jersey india",
      "jersey online",
      "zlip store",
      "kerala jersey",
    ],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/product/${product.slug}`,
      type: "website",
      images: [{ url: image.startsWith("http") ? image : `${BASE_URL}${image}`, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.startsWith("http") ? image : `${BASE_URL}${image}`],
    },
    alternates: {
      canonical: `${BASE_URL}/product/${product.slug}`,
    },
    other: {
      "product:schema": JSON.stringify(productSchema),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const BASE = "https://zlipstore.in";
  const image = product.images?.[0] || `${BASE}/og-image.jpg`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ||
      `Shop ${product.name} at Zlip Store. All India delivery. Order via WhatsApp.`,
    image: image.startsWith("http") ? image : `${BASE}${image}`,
    brand: { "@type": "Brand", name: "Zlip Store" },
    offers: {
      "@type": "Offer",
      url: `${BASE}/product/${product.slug}`,
      priceCurrency: "INR",
      price: product.priceMode === "display" && product.price ? product.price : undefined,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Zlip Store" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
