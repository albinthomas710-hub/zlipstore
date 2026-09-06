import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function ProductNotFound() {
  return (
    <main className="flex-1 w-full flex flex-col items-center justify-center bg-zinc-950 min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-zinc-400 mb-2">Product Not Found</p>
      <p className="text-zinc-500 mb-8 max-w-md">
        This product doesn&apos;t exist or may have been removed. Check out our full collection instead.
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
      >
        <ArrowLeft size={18} />
        View All Products
      </Link>
    </main>
  );
}
