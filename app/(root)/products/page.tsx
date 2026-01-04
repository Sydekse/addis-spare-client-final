'use client'; // This makes your component a Client Component

import { Suspense, useEffect, useState } from "react";
import FilterSidebar from "@/components/products/filter-sidebar";
import ProductsSkeletonGrid from "@/components/products/products-skeleton-grid";
import SearchHeader from "@/components/products/search-header";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/api/services/product.service";
import { Footer } from "@/components/layout/footer";
import ProductCard from "@/components/products/product-card";
import { useSearchParams } from "next/navigation";  // import useSearchParams

interface CategoryOption {
  id: string;
  name: string;
  count: number;
}

interface MakeOption {
  id: string;
  name: string;
}

interface ModelOption {
  id: string;
  name: string;
  makeId: string;
}

interface YearOption {
  id: string;
  year: number;
}

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();

  // State to store filter values
  const make = searchParams.get("make") || "";
  const model = searchParams.get("model") || "";
  const year = searchParams.get("year") || "";
  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "";

  // Fetch initial products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setInitialProducts(products);
      setFilteredProducts(products);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialProducts.length === 0) return;

    let products = initialProducts;

    // Apply filters based on search params
    if (make) {
      products = products.filter((p) =>
        p.compatibility.some((c) => c.make.toLowerCase() === make.toLowerCase())
      );
    }

    if (model) {
      products = products.filter((p) =>
        p.compatibility.some((c) => c.model.toLowerCase() === model.toLowerCase())
      );
    }

    if (year) {
      products = products.filter((p) =>
        p.compatibility.some((c) => c.year === parseInt(year))
      );
    }

    if (q) {
      const queryLower = q.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(queryLower) ||
        p.description.toLowerCase().includes(queryLower)
      );
    }

    if (cat.trim()) {
      products = products.filter((p) => p.category === cat)
    }

    setFilteredProducts(products);
  }, [initialProducts, make, model, year, q, cat]);

  // Prepare categories, makes, models, and years for filtering options
  const categoryMap: Record<string, number> = {};
  initialProducts.forEach((p) => {
    console.log(filteredProducts)
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categories: CategoryOption[] = Object.entries(categoryMap).map(
    ([name, count], index) => ({
      id: `cat-${index}`,
      name,
      count,
    })
  );

  // Generate makes from products
  const makesSet = new Set(
    initialProducts.flatMap((p) => p.compatibility.map((c) => c.make))
  );
  const makes: MakeOption[] = Array.from(makesSet).map((make, index) => ({
    id: `make-${index}`,
    name: make,
  }));

  // Generate models from products
  const modelsMap: Record<string, Set<string>> = {};
  initialProducts.forEach((p) => {
    p.compatibility.forEach((c) => {
      if (!modelsMap[c.make]) modelsMap[c.make] = new Set();
      modelsMap[c.make].add(c.model);
    });
  });

  let modelIdCounter = 0;
  const models: ModelOption[] = Object.entries(modelsMap).flatMap(
    ([make, modelsSet]) =>
      Array.from(modelsSet).map((model) => ({
        id: `model-${modelIdCounter++}`,
        name: model,
        makeId: makes.find((m) => m.name === make)?.id || "",
      }))
  );

  // Generate years from products
  const yearsSet = new Set(
    initialProducts.flatMap((p) => p.compatibility.map((c) => c.year))
  );
  const years: YearOption[] = Array.from(yearsSet)
    .sort((a, b) => a - b)
    .map((year, index) => ({
      id: `year-${index}`,
      year,
    }));

  return (
    <div className="bg-white dark:bg-[#0C0C0C] min-h-screen">
      {/* Search/Filter Header - Fixed at top */}
      <div className="hidden md:block right-0 z-30 bg-white dark:bg-[#0C0C0C] shadow-sm">
        <div className="mx-auto px-8 py-4">
          <SearchHeader makes={makes} models={models} years={years} />
        </div>
      </div>

      {/* Main content with sticky sidebar */}
      <div className="container max-w-[95%] mx-auto px-4">
        <div className="flex pt-8">
          {/* Sticky sidebar with hidden scrollbar */}
          <div className="w-64 h-[calc(100vh-180px)] sticky top-[180px] hidden md:block">
            <div className="h-full overflow-auto hide-scrollbar">
              <FilterSidebar categories={categories} />
            </div>
          </div>

          {/* Main content with left margin to account for sidebar */}
          <div className="ml-[16px] flex-1">
            <Suspense fallback={<ProductsSkeletonGrid />}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                {initialProducts.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            </Suspense>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
