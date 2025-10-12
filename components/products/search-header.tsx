"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Calendar, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchHeaderProps {
  makes: {
    id: string
    name: string
  }[]
  models: {
    id: string
    name: string
    makeId: string
  }[]
  years: {
    id: string
    year: number
  }[]
}

export default function SearchHeader({ makes, models, years }: SearchHeaderProps) {
  const router = useRouter()
  const [selectedMake, setSelectedMake] = useState<string>("all")
  const [selectedModel, setSelectedModel] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Filter models based on selected make
  const filteredModels = selectedMake !== "all" ? models.filter((model) => model.makeId === selectedMake) : []

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (selectedMake !== "all") params.set("make", selectedMake)
    if (selectedModel !== "all") params.set("model", selectedModel)
    if (selectedYear !== "all") params.set("year", selectedYear)
    if (searchQuery.trim()) params.set("q", searchQuery.trim())

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-[#670D2F] dark:text-[#ff8fb1]" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Vehicle</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedMake} onValueChange={setSelectedMake}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {makes.map((make) => (
                  <SelectItem key={make.id} value={make.id}>
                    {make.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedModel} onValueChange={setSelectedModel} disabled={selectedMake === "all"}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {filteredModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-[#670D2F] dark:text-[#ff8fb1]" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Year</span>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-4 w-4 text-[#670D2F] dark:text-[#ff8fb1]" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Search by SKU</span>
          </div>
          <Input
            type="text"
            placeholder="Enter SKU or keyword"
            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full h-10 bg-[#670D2F] hover:bg-[#670D2F]/90 text-white">
            Search Parts
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="text-amber-400">★★★★★</div>
            <span className="text-sm ml-1 text-gray-700 dark:text-gray-300">4.6 of 5</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Based on 2500+ reviews</span>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span>United States</span>
        </div>
      </div>
    </div>
  )
}
