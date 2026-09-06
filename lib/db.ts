import Redis from "ioredis";
import fs from "fs";
import path from "path";

export interface Size {
  label: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  tags: string[];
  images: string[];
  sizes: Size[];
  priceMode: "display" | "enquire";
  price?: number | null;
  originalPrice?: number | null;
  inStock: boolean;
  stockCount?: number | null;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const IS_VERCEL = process.env.VERCEL === "1";

// Initialize Redis client if URL is present
const redis = process.env.KV_REDIS_URL ? new Redis(process.env.KV_REDIS_URL) : null;

// Helper to get initial local data if KV is empty
function getLocalProducts(): Product[] {
  try {
    const file = path.join(process.cwd(), "data", "products.json");
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to read local products", e);
  }
  return [];
}

function getLocalFAQs(): FAQ[] {
  try {
    const file = path.join(process.cwd(), "data", "faqs.json");
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to read local faqs", e);
  }
  return [];
}

// Fallback logic for when KV is not configured (e.g. local dev without env vars)
let localProductsCache: Product[] | null = null;
let localFaqsCache: FAQ[] | null = null;

async function readProducts(): Promise<Product[]> {
  if (redis) {
    try {
      const dataString = await redis.get("products");
      if (dataString) {
        return JSON.parse(dataString);
      }
      
      // If KV is empty, seed it with local data
      const localData = getLocalProducts();
      if (localData.length > 0) {
        await redis.set("products", JSON.stringify(localData));
      }
      return localData;
    } catch (e) {
      console.error("Redis read error (products)", e);
      return [];
    }
  } else {
    if (!localProductsCache) {
      localProductsCache = getLocalProducts();
    }
    return localProductsCache;
  }
}

async function writeProducts(data: Product[]): Promise<void> {
  if (redis) {
    await redis.set("products", JSON.stringify(data));
  } else {
    localProductsCache = data;
    // Attempt to write to local file if not on Vercel
    if (!IS_VERCEL) {
      try {
        fs.writeFileSync(path.join(process.cwd(), "data", "products.json"), JSON.stringify(data, null, 2));
      } catch (e) {
        console.error("Failed to write to local file", e);
      }
    }
  }
}

async function readFAQs(): Promise<FAQ[]> {
  if (redis) {
    try {
      const dataString = await redis.get("faqs");
      if (dataString) {
        return JSON.parse(dataString);
      }
      
      const localData = getLocalFAQs();
      if (localData.length > 0) {
        await redis.set("faqs", JSON.stringify(localData));
      }
      return localData;
    } catch (e) {
      console.error("Redis read error (faqs)", e);
      return [];
    }
  } else {
    if (!localFaqsCache) {
      localFaqsCache = getLocalFAQs();
    }
    return localFaqsCache;
  }
}

async function writeFAQs(data: FAQ[]): Promise<void> {
  if (redis) {
    await redis.set("faqs", JSON.stringify(data));
  } else {
    localFaqsCache = data;
    if (!IS_VERCEL) {
      try {
        fs.writeFileSync(path.join(process.cwd(), "data", "faqs.json"), JSON.stringify(data, null, 2));
      } catch (e) {
        console.error("Failed to write to local file", e);
      }
    }
  }
}

export const db = {
  // Product Methods
  getProducts: async () => await readProducts(),
  
  getProductById: async (id: string) => {
    const products = await readProducts();
    return products.find((p) => p.id === id);
  },
  
  getProductBySlug: async (slug: string) => {
    const products = await readProducts();
    return products.find((p) => p.slug === slug);
  },
  
  getProductsByCategory: async (category: string) => {
    const products = await readProducts();
    return products.filter((p) => p.category === category);
  },
  
  getProductsByTag: async (tag: string) => {
    const products = await readProducts();
    return products.filter((p) => p.tags.includes(tag));
  },
  
  getFeaturedProducts: async () => {
    const products = await readProducts();
    return products.filter((p) => p.category === "latest-drops").slice(0, 8);
  },
  
  getCategories: async () => {
    const products = await readProducts();
    const counts = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([name, totalCount]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      slug: name,
      totalCount
    }));
  },
  
  createProduct: async (data: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">) => {
    const products = await readProducts();
    const id = crypto.randomUUID();
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
      
    const finalSlug = products.some((p) => p.slug === slug) 
      ? `${slug}-${Math.random().toString(36).substring(2, 6)}` 
      : slug;
      
    const newProduct: Product = {
      ...data,
      id,
      slug: finalSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    products.push(newProduct);
    await writeProducts(products);
    return newProduct;
  },
  
  updateProduct: async (id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    const products = await readProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    
    let finalSlug = products[index].slug;
    if (data.name && data.name !== products[index].name) {
      const baseSlug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      finalSlug = products.some((p) => p.slug === baseSlug && p.id !== id) 
        ? `${baseSlug}-${Math.random().toString(36).substring(2, 6)}` 
        : baseSlug;
    }

    products[index] = {
      ...products[index],
      ...data,
      slug: finalSlug,
      updatedAt: new Date().toISOString(),
    };
    await writeProducts(products);
    return products[index];
  },
  
  deleteProduct: async (id: string) => {
    const products = await readProducts();
    const filtered = products.filter((p) => p.id !== id);
    await writeProducts(filtered);
  },

  // FAQ Methods
  getFAQs: async () => {
    const faqs = await readFAQs();
    return faqs.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  createFAQ: async (data: Omit<FAQ, "id" | "createdAt" | "updatedAt">) => {
    const faqs = await readFAQs();
    const id = crypto.randomUUID();
    
    const newFaq: FAQ = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    faqs.push(newFaq);
    await writeFAQs(faqs);
    return newFaq;
  },

  updateFAQ: async (id: string, data: Partial<Omit<FAQ, "id" | "createdAt" | "updatedAt">>) => {
    const faqs = await readFAQs();
    const index = faqs.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("FAQ not found");
    
    faqs[index] = {
      ...faqs[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await writeFAQs(faqs);
    return faqs[index];
  },

  deleteFAQ: async (id: string) => {
    const faqs = await readFAQs();
    const filtered = faqs.filter((f) => f.id !== id);
    await writeFAQs(filtered);
  },

  updateFAQSorter: async (reorderedFAQs: Pick<FAQ, 'id' | 'sortOrder'>[]) => {
     const faqs = await readFAQs();
     const faqMap = new Map(faqs.map(f => [f.id, f]));
     
     const updated = reorderedFAQs.map(({id, sortOrder}) => {
       const existing = faqMap.get(id);
       if (existing) {
         existing.sortOrder = sortOrder;
         existing.updatedAt = new Date().toISOString();
       }
       return existing;
     }).filter(Boolean) as FAQ[];

     const updatedIds = new Set(updated.map(f => f.id));
     const remaining = faqs.filter(f => !updatedIds.has(f.id));

     await writeFAQs([...updated, ...remaining]);
  }
};
