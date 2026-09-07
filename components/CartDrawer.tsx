"use client";

import { useCart } from "@/lib/cart-context";
import { X, Trash, WhatsappLogo, ShoppingBag, Minus, Plus } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart, isOpen, closeCart } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    let text = "Hi Zlip Store! 👋 I'd like to order:\n\n";
    items.forEach((item, i) => {
      text += `${i + 1}. *${item.productName}*`;
      if (item.selectedSize) text += ` — Size: ${item.selectedSize}`;
      if (item.selectedColor) text += `, Color: ${item.selectedColor}`;
      text += `, Qty: ${item.quantity}`;
      if (item.priceMode === "display" && item.price) {
        text += `, Price: ₹${item.price * item.quantity}`;
      } else {
        text += `, Price: Enquiry`;
      }
      text += "\n";
    });

    const displayTotal = items
      .filter((i) => i.priceMode === "display" && i.price)
      .reduce((sum, i) => sum + (i.price! * i.quantity), 0);

    const hasEnquiry = items.some((i) => i.priceMode === "enquire");

    if (displayTotal > 0) {
      text += `\n*Total: ₹${displayTotal.toLocaleString("en-IN")}*`;
      if (hasEnquiry) text += ` *(excluding enquiry items)*`;
    }

    text += "\n\nPlease confirm availability and total. Thank you!";

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/919446426981?text=${encodedText}`, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-[420px] bg-zinc-950 border-l border-border/20 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/20">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <h2 className="text-base font-bold uppercase tracking-wider text-white">
              Your Cart
            </h2>
            {totalItems > 0 && (
              <span className="text-xs font-bold bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
            aria-label="Close cart"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <ShoppingBag size={64} className="text-zinc-700" weight="thin" />
              <p className="text-zinc-400 font-medium">Your cart is empty</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="text-sm text-primary hover:underline"
              >
                Continue shopping →
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => {
                const isExternal = item.image?.startsWith("http");
                return (
                  <div
                    key={`${item.productId}-${item.selectedSize}`}
                    className="flex gap-3 bg-zinc-900 rounded-xl p-3 border border-border/10"
                  >
                    {/* Image */}
                    <Link href={`/product/${item.slug}`} onClick={closeCart}>
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 relative">
                        {item.image ? (
                          isExternal ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          )
                        ) : (
                          <div className="w-full h-full bg-zinc-800" />
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.slug}`} onClick={closeCart}>
                        <p className="text-sm font-bold text-white line-clamp-2 hover:text-primary transition-colors">
                          {item.productName}
                        </p>
                      </Link>
                      {item.selectedSize && (
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Size: <span className="text-zinc-300 font-medium">{item.selectedSize}</span>
                        </p>
                      )}
                      {item.priceMode === "display" && item.price ? (
                        <p className="text-sm font-bold text-white mt-1">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          {item.quantity > 1 && (
                            <span className="text-xs text-zinc-500 font-normal ml-1">
                              (₹{item.price.toLocaleString("en-IN")} each)
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-xs text-zinc-400 mt-1 border border-zinc-700 inline-block px-2 py-0.5 rounded">
                          DM for price
                        </p>
                      )}

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedSize, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                        >
                          <Minus size={10} className="text-white" />
                        </button>
                        <span className="text-sm font-bold text-white w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.selectedSize, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                        >
                          <Plus size={10} className="text-white" />
                        </button>
                        <button
                          onClick={() => removeItem(item.productId, item.selectedSize)}
                          className="ml-auto w-6 h-6 rounded-md text-red-400 hover:text-red-300 hover:bg-red-900/20 flex items-center justify-center transition-colors"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border/20 px-5 py-5 space-y-4 bg-zinc-950">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 font-medium">
                Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
              </span>
              <div className="text-right">
                {totalPrice > 0 ? (
                  <span className="text-lg font-bold text-white">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span className="text-sm text-zinc-400">Enquiry items</span>
                )}
                {items.some((i) => i.priceMode === "enquire") && totalPrice > 0 && (
                  <p className="text-[10px] text-zinc-500">+ enquiry item(s)</p>
                )}
              </div>
            </div>

            {/* Checkout via WhatsApp */}
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm shadow-lg shadow-green-900/30"
            >
              <WhatsappLogo size={20} weight="fill" />
              Order via WhatsApp
            </button>

            <button
              onClick={clearCart}
              className="w-full text-xs text-zinc-500 hover:text-red-400 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
