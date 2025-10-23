"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface FilterSidebarProps {
  categories: {
    id: string
    name: string
    count: number
  }[]
}

export default function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    compatibility: true,
    price: true,
    brand: true,
    attributes: false,
  })

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams)

    if (categoryId === "all") {
      params.delete("category")
    } else {
      const cat =  categories.find((c) => c.id === categoryId);
      if (cat) params.set("category", cat.name)
    }

    router.push(`/products/?${params.toString()}`)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow scrollbar-none">
      <div>
        <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Filter by</h3>

        <div className="space-y-4">
          {/* Part Category */}
          <div>
            <button
              className="flex items-center justify-between w-full text-left font-medium mb-2 text-gray-900 dark:text-white"
              onClick={() => toggleSection("category")}
            >
              <h4 className="text-sm">Part Category</h4>
              {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {expandedSections.category && (
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={cn(
                      "flex items-center w-full text-left",
                      currentCategory === "all"
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border mr-2 flex items-center justify-center",
                        currentCategory === "all"
                          ? "border-[#670D2F] dark:border-[#ff8fb1]"
                          : "border-gray-300 dark:border-gray-600",
                      )}
                    >
                      {currentCategory === "all" && <Check className="h-3 w-3 text-[#670D2F] dark:text-[#ff8fb1]" />}
                    </div>
                    <span>All</span>
                    <span className="ml-1 text-gray-400 dark:text-gray-500">5</span>
                  </button>
                </li>

                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.id)}
                      className={cn(
                        "flex items-center w-full text-left",
                        currentCategory === category.id
                          ? "font-medium text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border mr-2 flex items-center justify-center",
                          currentCategory === category.id
                            ? "border-[#670D2F] dark:border-[#ff8fb1]"
                            : "border-gray-300 dark:border-gray-600",
                        )}
                      >
                        {currentCategory === category.id && (
                          <Check className="h-3 w-3 text-[#670D2F] dark:text-[#ff8fb1]" />
                        )}
                      </div>
                      <span>{category.name}</span>
                      <span className="ml-1 text-gray-400 dark:text-gray-500">{category.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Compatibility */}
          <div>
            <button
              className="flex items-center justify-between w-full text-left font-medium mb-2 text-gray-900 dark:text-white"
              onClick={() => toggleSection("compatibility")}
            >
              <h4 className="text-sm">Compatibility</h4>
              {expandedSections.compatibility ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {expandedSections.compatibility && (
              <ul className="space-y-1">
                <li>
                  <button className="flex items-center w-full text-left text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 mr-2"></div>
                    <span>Domestic</span>
                    <span className="ml-1 text-gray-400 dark:text-gray-500">28</span>
                  </button>
                </li>
                <li>
                  <button className="flex items-center w-full text-left text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 mr-2"></div>
                    <span>Import</span>
                    <span className="ml-1 text-gray-400 dark:text-gray-500">12</span>
                  </button>
                </li>
                <li>
                  <button className="flex items-center w-full text-left text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600 mr-2"></div>
                    <span>Universal</span>
                    <span className="ml-1 text-gray-400 dark:text-gray-500">6</span>
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* Price range */}
          <div>
            <button
              className="flex items-center justify-between w-full text-left font-medium mb-2 text-gray-900 dark:text-white"
              onClick={() => toggleSection("price")}
            >
              <h4 className="text-sm">Price range</h4>
              {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {expandedSections.price && (
              <div className="px-2">
                <Slider
                  defaultValue={[0, 10000]}
                  max={10000}
                  step={10}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="my-6"
                />
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                  <div>ETB {priceRange[0]}</div>
                  <div>ETB {priceRange[1]}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
