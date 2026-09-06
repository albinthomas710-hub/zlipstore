"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, List } from "@phosphor-icons/react";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.jpg" alt="Zlip Store Logo" width={32} height={32} className="rounded-full object-cover" />
          <span className="text-xl font-bold tracking-tighter uppercase text-primary">Zlip Store</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">Home</Link>
          <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">Products</Link>
          <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact</Link>
          <Link href="/faq" className="transition-colors hover:text-foreground/80 text-foreground/60">FAQ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button aria-label="Cart" className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag size={24} weight="light" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              0
            </span>
          </button>
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <List size={24} weight="light" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-b border-border/10 bg-background/95 backdrop-blur px-4 py-4 space-y-4 text-sm font-medium">
          <Link href="/" className="block transition-colors hover:text-primary">Home</Link>
          <Link href="/products" className="block transition-colors hover:text-primary">Products</Link>
          <Link href="/contact" className="block transition-colors hover:text-primary">Contact</Link>
          <Link href="/faq" className="block transition-colors hover:text-primary">FAQ</Link>
        </div>
      )}
    </header>
  );
}
