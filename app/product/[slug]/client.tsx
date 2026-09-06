"use client";

import { useState } from "react";
import { Truck, ChatCircle, Heart, Fire, CheckCircle, WarningCircle, Info } from "@phosphor-icons/react";
import Link from "next/link";
import { Product } from "@/lib/db";

export default function ProductPageClient({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.images[0] || "");
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.find(s => s.available)?.label || null
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const discountAmount = (product.originalPrice && product.price)
    ? product.originalPrice - product.price
    : 0;

  const discountPercent = (product.originalPrice && product.price)
    ? Math.round((discountAmount / product.originalPrice) * 100)
    : 0;

  const handleOrder = () => {
    if (!selectedSize && product.sizes.some(s => s.available)) {
      alert("Please select a size first.");
      return;
    }

    let text = `Hi Zlip Store! 👋 I'd like to order:\n\n*${product.name}*`;
    if (selectedSize) text += `\nSize: ${selectedSize}`;
    text += `\nQuantity: ${quantity}`;

    if (product.priceMode === 'display' && product.price) {
      text += `\nPrice: ₹${product.price} x ${quantity} = ₹${product.price * quantity}`;
    } else {
      text += `\nPrice: Enquiry`;
    }

    text += `\n\nPlease confirm availability and total. Thank you!`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/919446426981?text=${encodedText}`, "_blank");
  };

  return (
    <main className="flex-1 w-full flex flex-col items-center bg-zinc-950 min-h-screen">
      {/* Breadcrumbs */}
      <div className="w-full border-b border-border/10 bg-zinc-900/50">
        <div className="container mx-auto px-4 md:px-6 py-4 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-zinc-900 border border-border/20">
              {activeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">No Image</div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.priceMode === "display" && discountPercent > 0 && (
                  <div className="bg-black text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm">
                    SALE • {discountPercent}% OFF
                  </div>
                )}
                {product.badge && (
                  <div className="bg-white/90 backdrop-blur-md text-black flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm">
                    <Fire size={14} weight="fill" className="text-red-500" />
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              >
                <Heart size={20} weight={isWishlisted ? "fill" : "regular"} className={isWishlisted ? "text-red-500" : "text-zinc-600"} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent hover:border-zinc-700'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            {/* Category Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">{product.category.replace(/-/g, " ")}</span>
              {product.tags?.length > 0 && (
                <>
                  <span className="text-xs text-zinc-600">•</span>
                  <span className="text-xs font-bold text-[#00ff88] tracking-wider uppercase">{product.tags[0].replace(/-/g, " ")}</span>
                </>
              )}
            </div>

            {/* Title & Description */}
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter uppercase mb-3">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-zinc-400 text-sm md:text-base mb-8">
                {product.description}
              </p>
            )}

            {/* Pricing Section */}
            <div className="bg-zinc-900/50 border border-border/20 rounded-xl p-6 mb-8">
              {product.priceMode === "display" ? (
                <>
                  <div className="flex items-end gap-3 mb-4">
                    <span className="text-4xl font-bold text-white">₹{product.price?.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-zinc-500 line-through mb-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                    {discountAmount > 0 && (
                      <span className="text-sm font-bold text-red-500 mb-1">SAVE ₹{discountAmount.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#00ff88]" /> Tax included
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-[#00ff88]" /> Fast Delivery via DTDC / SpeedPost
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <span className="text-3xl font-bold text-white uppercase tracking-tight">DM FOR PRICE</span>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Info size={16} className="text-primary" /> Price available upon request via WhatsApp
                  </div>
                </div>
              )}
            </div>

            {/* Stock Alert */}
            {product.inStock && product.stockCount != null && product.stockCount <= 5 && (
              <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-2 text-red-400 font-medium text-sm">
                  <Fire size={18} weight="fill" className="animate-pulse" />
                  Only {product.stockCount} left in stock!
                </div>
                <span className="text-xs font-bold bg-white text-black px-2 py-1 rounded uppercase tracking-wider">
                  Rush
                </span>
              </div>
            )}

            {!product.inStock && (
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-8 text-zinc-400 font-medium text-sm">
                <WarningCircle size={18} />
                Sold Out — Check back soon or enquire on WhatsApp
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-wider uppercase text-white">Selected Size:</span>
                    <span className="text-sm font-bold text-primary">{selectedSize || "None"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      disabled={!size.available || !product.inStock}
                      onClick={() => setSelectedSize(size.label)}
                      className={`
                        w-14 h-14 flex items-center justify-center text-sm font-bold rounded-lg border-2 transition-all
                        ${!size.available || !product.inStock
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                          : selectedSize === size.label
                            ? 'bg-white border-white text-black'
                            : 'bg-zinc-900 border-zinc-800 text-white hover:border-zinc-600'
                        }
                      `}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="mb-8">
                <span className="text-sm font-bold tracking-wider uppercase text-white block mb-4">Quantity</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 rounded-lg border-2 border-zinc-800 bg-zinc-900 text-white text-xl font-bold hover:border-zinc-600 transition-colors flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-xl font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 rounded-lg border-2 border-zinc-800 bg-zinc-900 text-white text-xl font-bold hover:border-zinc-600 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-border/10">
              {product.priceMode === "enquire" ? (
                <button
                  onClick={handleOrder}
                  className="w-full h-14 bg-white text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <ChatCircle size={24} weight="fill" className="text-[#00ff88]" />
                  ENQUIRE PRICE ON WHATSAPP
                </button>
              ) : !product.inStock ? (
                <button
                  onClick={() => {
                    const text = `Hi Zlip Store! 👋 I'm interested in *${product.name}* and would like to know when it's back in stock.`;
                    window.open(`https://wa.me/919446426981?text=${encodeURIComponent(text)}`, "_blank");
                  }}
                  className="w-full h-14 bg-zinc-900 border border-zinc-800 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                >
                  <ChatCircle size={24} weight="fill" />
                  NOTIFY ME ON WHATSAPP
                </button>
              ) : (
                <button
                  onClick={handleOrder}
                  className="w-full h-14 bg-[#25D366] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-[0_0_20px_rgba(37,211,102,0.2)]"
                >
                  <ChatCircle size={24} weight="fill" />
                  ORDER VIA WHATSAPP
                </button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border/10">
              <div className="flex flex-col items-center justify-center text-center p-4 bg-zinc-900/50 rounded-xl border border-border/10">
                <CheckCircle size={24} className="text-zinc-400 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">100% Authentic</span>
                <span className="text-[10px] text-zinc-500 mt-1">Verified Quality</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 bg-zinc-900/50 rounded-xl border border-border/10">
                <Truck size={24} className="text-zinc-400 mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Fast Dispatch</span>
                <span className="text-[10px] text-zinc-500 mt-1">All Over India</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
