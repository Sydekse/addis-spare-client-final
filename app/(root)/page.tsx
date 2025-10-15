import { Suspense } from "react";
import ProductsGrid from "@/components/products/products-grid";
import FilterSidebar from "@/components/products/filter-sidebar";
import ProductsSkeletonGrid from "@/components/products/products-skeleton-grid";
import SearchHeader from "@/components/products/search-header";
import { Product } from "@/types/product";
import { getProducts } from "@/lib/api/services/product.service";
import { Footer } from "@/components/layout/footer";

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

export default async function ProductsPage() {
  const initialProducts: Product[] = await getProducts();

  // Categories
  const categoryMap: Record<string, number> = {};
  initialProducts.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categories: CategoryOption[] = Object.entries(categoryMap).map(
    ([name, count], index) => ({
      id: `cat-${index}`,
      name,
      count,
    })
  );

  // Makes
  const makesSet = new Set(
    initialProducts.flatMap((p) => p.compatibility.map((c) => c.make))
  );
  const makes: MakeOption[] = Array.from(makesSet).map((make, index) => ({
    id: `make-${index}`,
    name: make,
  }));

  // Models
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

  // Years
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
        <div className="max-w-[1200px] mx-auto px-4 py-4">
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
              <ProductsGrid
                initialProducts={{
                  products: initialProducts,
                  total: initialProducts.length,
                }}
              />
            </Suspense>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
