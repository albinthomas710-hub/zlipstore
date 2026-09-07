"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  selectedSize: string | null;
  selectedColor: string | null;
  quantity: number;
  price: number | null;
  priceMode: "display" | "enquire";
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string | null) => void;
  updateQuantity: (productId: string, size: string | null, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "zlip-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.selectedSize === newItem.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId && i.selectedSize === newItem.selectedSize
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, size: string | null) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.selectedSize === size))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, size: string | null, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter((i) => !(i.productId === productId && i.selectedSize === size))
      );
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.selectedSize === size ? { ...i, quantity } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + (i.priceMode === "display" && i.price ? i.price * i.quantity : 0),
    0
  );

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, isOpen, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
