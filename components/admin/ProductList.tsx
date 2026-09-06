import { Product } from "@/lib/db";
import { PencilSimple, Trash, WarningCircle, CheckCircle } from "@phosphor-icons/react/dist/ssr";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-zinc-900 border border-border/10 rounded-xl p-12 text-center">
        <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
        <p className="text-zinc-400">Click "Add Product" to create your first product.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-border/10 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-950/50 text-xs uppercase font-semibold text-zinc-400 border-b border-border/10">
            <tr>
              <th scope="col" className="px-4 py-3">Product</th>
              <th scope="col" className="px-4 py-3">Price</th>
              <th scope="col" className="px-4 py-3">Category</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-zinc-800 overflow-hidden shrink-0">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">No Img</div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white line-clamp-1">{product.name}</div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {product.priceMode === "display" ? (
                    <span className="font-medium">₹{product.price}</span>
                  ) : (
                    <span className="text-zinc-500 italic">Enquire</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 capitalize">
                    {product.category.replace("-", " ")}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {product.inStock ? (
                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                      <CheckCircle weight="fill" size={14} />
                      In Stock {product.stockCount ? `(${product.stockCount})` : ''}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                      <WarningCircle weight="fill" size={14} />
                      Out of Stock
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                      title="Edit"
                    >
                      <PencilSimple size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
