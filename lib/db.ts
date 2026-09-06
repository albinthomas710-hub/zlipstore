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

// On Vercel (production), process.cwd() points to /var/task which is READ-ONLY.
// We use /tmp for writes (writable on Vercel) and fall back to the bundled data files for reads.
// In development, we read/write to the local data/ folder as usual.
const IS_VERCEL = process.env.VERCEL === "1";

const dataFileRead = path.join(process.cwd(), "data", "products.json");
const dataFileWrite = IS_VERCEL
  ? "/tmp/products.json"
  : path.join(process.cwd(), "data", "products.json");

const faqFileRead = path.join(process.cwd(), "data", "faqs.json");
const faqFileWrite = IS_VERCEL
  ? "/tmp/faqs.json"
  : path.join(process.cwd(), "data", "faqs.json");

function readData(): Product[] {
  // On Vercel: try /tmp first (in-session mutations), then fall back to bundled seed
  const candidates = IS_VERCEL
    ? [dataFileWrite, dataFileRead]
    : [dataFileRead];

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    try {
      return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
      // corrupt file, try next
    }
  }
  return [];
}

function writeData(data: Product[]) {
  fs.writeFileSync(dataFileWrite, JSON.stringify(data, null, 2), "utf-8");
}

function readFaqData(): FAQ[] {
  const candidates = IS_VERCEL
    ? [faqFileWrite, faqFileRead]
    : [faqFileRead];

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    try {
      return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
      // corrupt file, try next
    }
  }
  return [];
}

function writeFaqData(data: FAQ[]) {
  fs.writeFileSync(faqFileWrite, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  // Product Methods
  getProducts: () => readData(),
  
  getProductById: (id: string) => readData().find((p) => p.id === id),
  
  getProductBySlug: (slug: string) => readData().find((p) => p.slug === slug),
  
  getProductsByCategory: (category: string) => readData().filter((p) => p.category === category),
  
  getProductsByTag: (tag: string) => readData().filter((p) => p.tags.includes(tag)),
  
  getFeaturedProducts: () => readData().filter((p) => p.category === "latest-drops").slice(0, 8),
  
  getCategories: () => {
    const products = readData();
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
  
  createProduct: (data: Omit<Product, "id" | "slug" | "createdAt" | "updatedAt">) => {
    const products = readData();
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
    writeData(products);
    return newProduct;
  },
  
  updateProduct: (id: string, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>) => {
    const products = readData();
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
    writeData(products);
    return products[index];
  },
  
  deleteProduct: (id: string) => {
    const products = readData();
    const filtered = products.filter((p) => p.id !== id);
    writeData(filtered);
  },

  // FAQ Methods
  getFAQs: () => {
    const faqs = readFaqData();
    return faqs.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  createFAQ: (data: Omit<FAQ, "id" | "createdAt" | "updatedAt">) => {
    const faqs = readFaqData();
    const id = crypto.randomUUID();
    
    const newFaq: FAQ = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    faqs.push(newFaq);
    writeFaqData(faqs);
    return newFaq;
  },

  updateFAQ: (id: string, data: Partial<Omit<FAQ, "id" | "createdAt" | "updatedAt">>) => {
    const faqs = readFaqData();
    const index = faqs.findIndex((f) => f.id === id);
    if (index === -1) throw new Error("FAQ not found");
    
    faqs[index] = {
      ...faqs[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    writeFaqData(faqs);
    return faqs[index];
  },

  deleteFAQ: (id: string) => {
    const faqs = readFaqData();
    const filtered = faqs.filter((f) => f.id !== id);
    writeFaqData(filtered);
  },

  updateFAQSorter: (reorderedFAQs: Pick<FAQ, 'id' | 'sortOrder'>[]) => {
     const faqs = readFaqData();
     const faqMap = new Map(faqs.map(f => [f.id, f]));
     
     const updated = reorderedFAQs.map(({id, sortOrder}) => {
       const existing = faqMap.get(id);
       if (existing) {
         existing.sortOrder = sortOrder;
         existing.updatedAt = new Date().toISOString();
       }
       return existing;
     }).filter(Boolean) as FAQ[];

     // Keep any faqs that weren't in the reorder list (though the UI should send all)
     const updatedIds = new Set(updated.map(f => f.id));
     const remaining = faqs.filter(f => !updatedIds.has(f.id));

     writeFaqData([...updated, ...remaining]);
  }
};
