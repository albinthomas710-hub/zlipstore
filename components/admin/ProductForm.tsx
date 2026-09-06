"use client";

import { useState } from "react";
import { Product, Size } from "@/lib/db";
import { UploadSimple, X, Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";

interface ProductFormProps {
  initialData?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "latest-drops",
  "trending-now",
  "special-edition",
  "limited-stock",
  "club-player-edition"
];

const AVAILABLE_TAGS = [
  "new-arrival",
  "trending",
  "limited-stock",
  "special-edition",
  "premium-quality",
  "club-player-edition",
];

const DEFAULT_SIZES: Size[] = [
  { label: "S", available: true },
  { label: "M", available: true },
  { label: "L", available: true },
  { label: "XL", available: true },
  { label: "XXL", available: true },
];

export function ProductForm({ initialData, onSave, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "latest-drops");
  const [priceMode, setPriceMode] = useState<"display" | "enquire">(initialData?.priceMode || "display");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(initialData?.originalPrice?.toString() || "");
  const [inStock, setInStock] = useState(initialData?.inStock ?? true);
  const [stockCount, setStockCount] = useState(initialData?.stockCount?.toString() || "");
  const [badge, setBadge] = useState(initialData?.badge || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [sizes, setSizes] = useState<Size[]>(initialData?.sizes || DEFAULT_SIZES);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImages([...images, data.url]);
      } else {
        alert("Upload failed");
      }
    } catch (e) {
      alert("Error uploading image");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleSize = (index: number) => {
    const newSizes = [...sizes];
    newSizes[index].available = !newSizes[index].available;
    setSizes(newSizes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Minimal validation
    if (!name) {
      setError("Product name is required");
      setIsSubmitting(false);
      return;
    }

    if (images.length === 0) {
      setError("At least one image is required");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name,
      description,
      category,
      priceMode,
      price: price ? parseFloat(price) : null,
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      inStock,
      stockCount: stockCount ? parseInt(stockCount, 10) : null,
      badge: badge || undefined,
      images,
      sizes,
      tags: selectedTags
    };

    try {
      const url = initialData 
        ? `/api/admin/products/${initialData.id}` 
        : "/api/admin/products";
        
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedProduct = await res.json();
        onSave(savedProduct);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save product");
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-border/10 rounded-xl p-4 sm:p-6 lg:p-8 shadow-xl max-w-4xl space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Grid Layout for Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border/10 pb-2 text-white">Basic Info</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Product Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Retro Classic Jersey"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary capitalize"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace(/-/g, " ")}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                  placeholder="Optional product description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-zinc-950 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      {tag.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border/10 pb-2 text-white">Pricing & Badge</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Price Display Mode</label>
                <div className="flex gap-4 bg-zinc-950 p-1 rounded-md border border-zinc-800">
                  <button 
                    type="button"
                    onClick={() => setPriceMode("display")}
                    className={`flex-1 py-1.5 text-sm font-medium rounded ${priceMode === "display" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    Show Price
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPriceMode("enquire")}
                    className={`flex-1 py-1.5 text-sm font-medium rounded ${priceMode === "enquire" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    Enquire Only
                  </button>
                </div>
              </div>

              {priceMode === "display" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Current Price (₹)</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Original Price (₹)</label>
                    <input 
                      type="number" 
                      value={originalPrice} 
                      onChange={e => setOriginalPrice(e.target.value)} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                      min="0"
                      placeholder="Optional strikethrough"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Badge Text</label>
                <input 
                  type="text" 
                  value={badge} 
                  onChange={e => setBadge(e.target.value)} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. RETRO GRAIL, NEW"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border/10 pb-2 text-white">Images *</h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square bg-zinc-950 rounded-md border border-zinc-800 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square bg-zinc-950 rounded-md border border-zinc-800 border-dashed hover:border-zinc-600 transition-colors flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 cursor-pointer">
                  <UploadSimple size={24} className="mb-2" />
                  <span className="text-xs font-medium">Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <p className="text-xs text-zinc-500">First image will be the primary product thumbnail.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-border/10 pb-2 text-white">Inventory & Variants</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-md border border-zinc-800">
                <div>
                  <div className="text-sm font-medium text-white">In Stock</div>
                  <div className="text-xs text-zinc-500">Is this product available for purchase?</div>
                </div>
                <button
                  type="button"
                  onClick={() => setInStock(!inStock)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inStock ? 'bg-primary' : 'bg-zinc-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inStock ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {inStock && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Stock Count (Optional)</label>
                  <input 
                    type="number" 
                    value={stockCount} 
                    onChange={e => setStockCount(e.target.value)} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                    min="0"
                    placeholder="Leave empty for infinite"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size, index) => (
                    <button
                      key={size.label}
                      type="button"
                      onClick={() => toggleSize(index)}
                      className={`w-12 h-12 flex items-center justify-center rounded border text-sm font-bold transition-colors ${
                        size.available 
                          ? "border-primary bg-primary/10 text-primary" 
                          : "border-zinc-800 bg-zinc-950 text-zinc-600 hover:border-zinc-700"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <div className="pt-6 border-t border-border/10 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-md font-semibold text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-md font-semibold text-sm bg-white text-black hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>

    </form>
  );
}
