"use client";

import { useState } from "react";
import { Product, FAQ } from "@/lib/db";
import { ProductList } from "./ProductList";
import { ProductForm } from "./ProductForm";
import { FaqList } from "./FaqList";
import { FaqForm } from "./FaqForm";
import { SignOut, Storefront, Plus, Package, Question } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

export function AdminDashboard({ 
  initialProducts, 
  initialFaqs 
}: { 
  initialProducts: Product[],
  initialFaqs: FAQ[]
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  
  const [activeTab, setActiveTab] = useState<"products" | "faqs">("products");
  const [view, setView] = useState<"list" | "form">("list");
  
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [editingFaq, setEditingFaq] = useState<FAQ | undefined>(undefined);
  
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/panel/login");
    router.refresh();
  };

  const handleAddNew = () => {
    if (activeTab === "products") {
      setEditingProduct(undefined);
    } else {
      setEditingFaq(undefined);
    }
    setView("form");
  };

  // --- Product Handlers ---
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setView("form");
  };

  const handleSaveProduct = (savedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      } else {
        return [savedProduct, ...prev];
      }
    });
    setView("list");
    router.refresh();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete product.");
      }
    } catch (e) {
      alert("Error deleting product.");
    }
  };

  // --- FAQ Handlers ---
  const handleEditFaq = (faq: FAQ) => {
    setEditingFaq(faq);
    setView("form");
  };

  const handleSaveFaq = (savedFaq: FAQ) => {
    setFaqs((prev) => {
      const exists = prev.find((f) => f.id === savedFaq.id);
      if (exists) {
        return prev.map((f) => (f.id === savedFaq.id ? savedFaq : f)).sort((a, b) => a.sortOrder - b.sortOrder);
      } else {
        return [...prev, savedFaq].sort((a, b) => a.sortOrder - b.sortOrder);
      }
    });
    setView("list");
    router.refresh();
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete FAQ.");
      }
    } catch (e) {
      alert("Error deleting FAQ.");
    }
  };

  const handleReorderFaqs = (newFaqs: FAQ[]) => {
    setFaqs(newFaqs);
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Header */}
      <header className="bg-zinc-900 border-b border-border/10 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Storefront size={24} className="text-primary" />
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Zlip Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">
            View Store
          </a>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
          >
            <SignOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        
        {/* Tabs - Only show when in list view */}
        {view === "list" && (
          <div className="flex items-center gap-2 mb-8 border-b border-border/10 pb-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "products" 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Package size={18} />
              Products
            </button>
            <button
              onClick={() => setActiveTab("faqs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "faqs" 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Question size={18} />
              FAQs
            </button>
          </div>
        )}

        {/* Content Area */}
        {view === "list" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold uppercase tracking-tighter">
                {activeTab === "products" ? "Products" : "FAQs"}
              </h2>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} weight="bold" />
                Add {activeTab === "products" ? "Product" : "FAQ"}
              </button>
            </div>
            
            {activeTab === "products" ? (
              <ProductList 
                products={products} 
                onEdit={handleEditProduct} 
                onDelete={handleDeleteProduct} 
              />
            ) : (
              <FaqList 
                faqs={faqs}
                onEdit={handleEditFaq}
                onDelete={handleDeleteFaq}
                onReorder={handleReorderFaqs}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold uppercase tracking-tighter">
                {activeTab === "products" 
                  ? (editingProduct ? "Edit Product" : "New Product")
                  : (editingFaq ? "Edit FAQ" : "New FAQ")
                }
              </h2>
              <button
                onClick={() => setView("list")}
                className="text-sm text-zinc-400 hover:text-white underline"
              >
                Cancel
              </button>
            </div>
            
            {activeTab === "products" ? (
              <ProductForm 
                initialData={editingProduct} 
                onSave={handleSaveProduct} 
                onCancel={() => setView("list")} 
              />
            ) : (
              <FaqForm
                initialData={editingFaq}
                onSave={handleSaveFaq}
                onCancel={() => setView("list")}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
