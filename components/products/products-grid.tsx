"use client"

import ProductCard from "./product-card"
import { Product } from "@/types/product"

export type ProductCompatibility = {
  make: string
  model: string
  year: number
}

interface ProductsGridProps {
  initialProducts: {
    products: Product[]
    total: number
  }
}

export default function ProductsGrid({ initialProducts }: ProductsGridProps) {
  // const [page, setPage] = useState(1)
  const isLoading = false;

  const products = initialProducts.products

  return (
    <div className="space-y-4">
      {/* Results count and sort - fixed below header */}
      <div className="bg-white dark:bg-[#0C0C0C] p-3 rounded-lg shadow-sm mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{initialProducts?.total || 0} results</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Sort by</span>
          <select className="text-sm border rounded p-1 bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && !isLoading && (
        <div className="text-center py-12 border border-dashed rounded-lg dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No parts found matching your criteria</p>
        </div>
      )}

      {/* Load more button */}
      {/* {products.length > 0 && page * 12 < (initialProducts?.total || 0) && (
        <div className="flex justify-center mt-8 pb-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-[#670D2F] hover:bg-[#670D2F]/90 text-white px-4 py-2 rounded-md"
          >
            Load More Parts
          </button>
        </div>
      )} */}
    </div>
  )
}
