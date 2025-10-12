// import type { Product } from "@/components/products/products-grid"

// // Mock data for car parts
// const mockProducts: Product[] = [
//   {
//     _id: "60d21b4667d0d8992e610c85",
//     sku: "BRK-PAD-1234",
//     name: "Premium Brake Pads - Front Set",
//     description: "High-performance ceramic brake pads for optimal stopping power and reduced brake dust.",
//     brand: "StopTech",
//     category: "Brakes",
//     price: 49.99,
//     images: [
//       "/placeholder.svg?height=400&width=400&text=Brake+Pads",
//       "/placeholder.svg?height=400&width=400&text=Brake+Pads+2",
//     ],
//     attributes: {
//       material: "Ceramic",
//       position: "Front",
//       width: "120mm",
//       thickness: "15mm",
//     },
//     compatibility: [
//       { make: "Toyota", model: "Camry", year: 2018 },
//       { make: "Toyota", model: "Camry", year: 2019 },
//       { make: "Toyota", model: "Camry", year: 2020 },
//       { make: "Toyota", model: "Avalon", year: 2019 },
//       { make: "Toyota", model: "Avalon", year: 2020 },
//       { make: "Lexus", model: "ES", year: 2019 },
//     ],
//     tags: ["ceramic", "premium", "low-dust", "quiet"],
//     stockControlled: true,
//     createdBy: "60d21b4667d0d8992e610c01",
//     createdAt: "2023-01-15T08:30:00.000Z",
//     updatedAt: "2023-01-15T08:30:00.000Z",
//   },
//   {
//     _id: "60d21b4667d0d8992e610c86",
//     sku: "OIL-FLT-5678",
//     name: "Engine Oil Filter",
//     description: "Premium quality oil filter that removes harmful contaminants from engine oil.",
//     brand: "Bosch",
//     category: "Engine",
//     price: 12.99,
//     images: ["/placeholder.svg?height=400&width=400&text=Oil+Filter"],
//     attributes: {
//       filtration: "99%",
//       thread: "3/4-16",
//       height: "95mm",
//     },
//     compatibility: [
//       { make: "Honda", model: "Civic", year: 2016 },
//       { make: "Honda", model: "Civic", year: 2017 },
//       { make: "Honda", model: "Civic", year: 2018 },
//       { make: "Honda", model: "Accord", year: 2017 },
//       { make: "Honda", model: "Accord", year: 2018 },
//       { make: "Acura", model: "TLX", year: 2018 },
//     ],
//     tags: ["oil filter", "engine maintenance", "synthetic oil"],
//     stockControlled: true,
//     createdBy: "60d21b4667d0d8992e610c01",
//     createdAt: "2023-01-16T09:15:00.000Z",
//     updatedAt: "2023-01-16T09:15:00.000Z",
//   },
//   {
//     _id: "60d21b4667d0d8992e610c87",
//     sku: "ALT-RMF-9012",
//     name: "Alternator - Remanufactured",
//     description: "Remanufactured alternator that meets or exceeds OEM specifications.",
//     brand: "ACDelco",
//     category: "Electrical",
//     price: 189.99,
//     images: ["/placeholder.svg?height=400&width=400&text=Alternator"],
//     attributes: {
//       output: "130 Amp",
//       voltage: "12V",
//       warranty: "1 Year",
//     },
//     compatibility: [
//       { make: "Ford", model: "F-150", year: 2015 },
//       { make: "Ford", model: "F-150", year: 2016 },
//       { make: "Ford", model: "F-150", year: 2017 },
//       { make: "Ford", model: "Expedition", year: 2015 },
//       { make: "Ford", model: "Expedition", year: 2016 },
//     ],
//     tags: ["alternator", "electrical", "charging system"],
//     stockControlled: true,
//     createdBy: "60d21b4667d0d8992e610c01",
//     createdAt: "2023-01-17T10:45:00.000Z",
//     updatedAt: "2023-01-17T10:45:00.000Z",
//   },
//   {
//     _id: "60d21b4667d0d8992e610c88",
//     sku: "SPK-PLG-3456",
//     name: "Spark Plugs - Set of 4",
//     description: "Iridium spark plugs for improved fuel efficiency and engine performance.",
//     brand: "NGK",
//     category: "Engine",
//     price: 32.99,
//     images: ["/placeholder.svg?height=400&width=400&text=Spark+Plugs"],
//     attributes: {
//       material: "Iridium",
//       gap: "0.044 inch",
//       thread: "14mm",
//       reach: "19mm",
//     },
//     compatibility: [
//       { make: "Chevrolet", model: "Silverado", year: 2014 },
//       { make: "Chevrolet", model: "Silverado", year: 2015 },
//       { make: "Chevrolet", model: "Silverado", year: 2016 },
//       { make: "GMC", model: "Sierra", year: 2014 },
//       { make: "GMC", model: "Sierra", year: 2015 },
//       { make: "Chevrolet", model: "Tahoe", year: 2015 },
//     ],
//     tags: ["spark plugs", "ignition", "tune-up", "iridium"],
//     stockControlled: true,
//     createdBy: "60d21b4667d0d8992e610c01",
//     createdAt: "2023-01-18T11:30:00.000Z",
//     updatedAt: "2023-01-18T11:30:00.000Z",
//   },
//   {
//     _id: "60d21b4667d0d8992e610c89",
//     sku: "TRN-FLD-7890",
//     name: "Transmission Fluid - 1 Quart",
//     description: "Synthetic automatic transmission fluid for smooth shifting and transmission protection.",
//     brand: "Valvoline",
//     category: "Transmission",
//     price: 24.99,
//     images: ["/placeholder.svg?height=400&width=400&text=Transmission+Fluid"],
//     attributes: {
//       type: "Synthetic",
//       capacity: "1 Quart",
//       specification: "ATF+4",
//     },
//     compatibility: [
//       { make: "BMW", model: "3 Series", year: 2015 },
//       { make: "BMW", model: "3 Series", year: 2016 },
//       { make: "BMW", model: "5 Series", year: 2015 },
//       { make: "BMW", model: "5 Series", year: 2016 },
//       { make: "BMW", model: "X3", year: 2015 },
//     ],
//     tags: ["transmission fluid", "ATF", "synthetic", "automatic"],
//     stockControlled: true,
//     createdBy: "60d21b4667d0d8992e610c01",
//     createdAt: "2023-01-19T12:15:00.000Z",
//     updatedAt: "2023-01-19T12:15:00.000Z",
//   },
//   {
//     _id: "60d21b4667d0d8992e610c8a",
//     sku: "AIR-FLT-2345",
//     name: "Air Filter",
//     description: "High-flow air filter that improves engine performance and fuel economy.",
//     brand: "K&N",
//     category: "Engine",
//     price: 19.99,
//     images: ["/placeholder.svg?height=400&width=400&text=Air+Filter"],
//     attributes: {
//       type: "Reusable",
//       shape: "Panel",
//       height: "25mm",
//     },
//     compatibility: [
//       { make: "Nissan", model: "Altima", year: 2016 },
//       { make: "Nissan", model: "Altima", year: 2017 },
//       { make: "Nissan", model: "Maxima", year: 2016 },
//       { make: "Nissan", model: "Maxima", year: 2017 },
//       { make: "Infiniti", model: "Q50", year: 2016 },
//     ],
//     tags: ["air filter", "high flow", "washable", "reusable"],
//     stockControlled: false,
//     createdBy: "60d21b4667d0d8992e610c01",
//     createdAt: "2023-01-20T13:00:00.000Z",
//     updatedAt: "2023-01-20T13:00:00.000Z",
//   },
//   {
//     _id: "60d21b4667d0d8992e610c8b",
//     sku: "RAD-ALM-6789",
//     name: "Radiator",
//     description: "Aluminum radiator with plastic tanks for efficient engine cooling.",
//     brand: "Denso",
//     category: "Cooling",
//     price: 129.99,
//     images: ["/placeholder.svg?height=400&width=400&text=Radiator"],
//     attributes: {
//       material: "Aluminum/Plastic",
//       rows: "2",
//       transmission: "Automatic",
//     },
//     compatibility: [
//       { make: "Hyundai", model: "Sonata", year: 2015 },
//       { make: "Hyundai", model: "Sonata", year: 2016 },
//       { make: "Hyundai", model: "Sonata", year: 2017 },
//       { make: "Kia", model: "Optima", year: 2015 },
//       { make: "Kia", model: "Optima", year: 2016 },
//     ],
//     tags: ["radiator", "cooling", "aluminum", "engine cooling"],
//     stockControlled: true,
//     createdBy: "60d21b4667d0d8992e610c01",
//     createdAt: "2023-01-21T14:30:00.000Z",
//     updatedAt: "2023-01-21T14:30:00.000Z",
//   },
//   {
//     _id: "60d21b4667d0d8992e610c8c",
//     sku: "O2-SNS-0123",
//     name: "Oxygen Sensor",
//     description: "Direct-fit oxygen sensor that monitors exhaust gas oxygen content.",
//     brand: "Denso",
//     category: "Exhaust",
//     price: 59.99,
//     images: ["/placeholder.svg?height=400&width=400&text=O2+Sensor"],
//     attributes: {
//       position: "Upstream",
//       wires: "4",
//       length: "16 inch",
//     },
//     compatibility: [
//       { make: "Subaru", model: "Outback", year: 2015 },
//       { make: "Subaru", model: "Outback", year: 2016 },
//       { make: "Subaru", model: "Forester", year: 2015 },
//       { make: "Subaru", model: "Forester", year: 2016 },
//       { make: "Subaru", model: "Legacy", year: 2015 },
//     ],
//     tags: ["oxygen sensor", "O2 sensor", "emissions", "fuel economy"],
//     stockControlled: true,
//     createdBy: "60d21b4667d0d8992e610c01",
//     createdAt: "2023-01-22T15:45:00.000Z",
//     updatedAt: "2023-01-22T15:45:00.000Z",
//   },
//   {
//     _id: "60d21b4667d0d8992e610c8d",
//     sku: "SHK-ABS-4567",
//     name: "Shock Absorber - Front",
//     description: "Gas-charged shock absorber for improved handling and ride comfort.",
//     brand: "Monroe",
//     category: "Suspension",
//     price: 79.99,
//     images: ["/placeholder.svg?height=400&width=400&text=Shock+Absorber"],
//     attributes: {
//       type: "Gas-Charged",
//       position: "Front",
//       extended_length: "18.5 inch",
//     },
//     compatibility: [
//       { make: "Jeep", model: "Wrangler", year: 2018 },
//       { make: "Jeep", model: "Wrangler", year: 2019 },
//       { make: "Jeep", model: "Wrangler", year: 2020 },
//       { make: "Jeep", model: "Gladiator", year: 2020 },
//     ],
//     tags: ["shock absorber", "suspension", "handling", "ride comfort"],
//     stockControlled: false,
//     createdBy: "60d21b4667d0d8992e610c01",
//     createdAt: "2023-01-23T16:30:00.000Z",
//     updatedAt: "2023-01-23T16:30:00.000Z",
//   },
// ]

// // Mock categories
// const mockCategories = [
//   { id: "brakes", name: "Brakes", count: 3 },
//   { id: "engine", name: "Engine", count: 6 },
//   { id: "electrical", name: "Electrical", count: 3 },
//   { id: "transmission", name: "Transmission", count: 1 },
//   { id: "cooling", name: "Cooling", count: 3 },
//   { id: "exhaust", name: "Exhaust", count: 2 },
//   { id: "suspension", name: "Suspension", count: 4 },
// ]

// // Mock vehicle makes
// const mockMakes = [
//   { id: "toyota", name: "Toyota" },
//   { id: "honda", name: "Honda" },
//   { id: "ford", name: "Ford" },
//   { id: "chevrolet", name: "Chevrolet" },
//   { id: "bmw", name: "BMW" },
//   { id: "nissan", name: "Nissan" },
//   { id: "hyundai", name: "Hyundai" },
//   { id: "subaru", name: "Subaru" },
//   { id: "jeep", name: "Jeep" },
// ]

// // Mock vehicle models
// const mockModels = [
//   { id: "camry", name: "Camry", makeId: "toyota" },
//   { id: "corolla", name: "Corolla", makeId: "toyota" },
//   { id: "rav4", name: "RAV4", makeId: "toyota" },
//   { id: "civic", name: "Civic", makeId: "honda" },
//   { id: "accord", name: "Accord", makeId: "honda" },
//   { id: "cr-v", name: "CR-V", makeId: "honda" },
//   { id: "f-150", name: "F-150", makeId: "ford" },
//   { id: "escape", name: "Escape", makeId: "ford" },
//   { id: "explorer", name: "Explorer", makeId: "ford" },
//   { id: "silverado", name: "Silverado", makeId: "chevrolet" },
//   { id: "equinox", name: "Equinox", makeId: "chevrolet" },
//   { id: "malibu", name: "Malibu", makeId: "chevrolet" },
//   { id: "3-series", name: "3 Series", makeId: "bmw" },
//   { id: "5-series", name: "5 Series", makeId: "bmw" },
//   { id: "x3", name: "X3", makeId: "bmw" },
// ]

// // Mock years
// const mockYears = [
//   { id: "2022", year: 2022 },
//   { id: "2021", year: 2021 },
//   { id: "2020", year: 2020 },
//   { id: "2019", year: 2019 },
//   { id: "2018", year: 2018 },
//   { id: "2017", year: 2017 },
//   { id: "2016", year: 2016 },
//   { id: "2015", year: 2015 },
// ]

// // Simulate API fetch for products
// export async function fetchProducts({
//   page = 1,
//   limit = 12,
//   category,
//   make,
//   model,
//   year,
// }: {
//   page?: number
//   limit?: number
//   category?: string
//   make?: string
//   model?: string
//   year?: string
// }) {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 500))

//   let filteredProducts = [...mockProducts]

//   // Apply category filter if provided
//   if (category) {
//     const categoryName = mockCategories.find((c) => c.id === category)?.name
//     if (categoryName) {
//       filteredProducts = filteredProducts.filter((p) => p.category === categoryName)
//     }
//   }

//   // Apply make filter if provided
//   if (make) {
//     const makeName = mockMakes.find((m) => m.id === make)?.name
//     if (makeName) {
//       filteredProducts = filteredProducts.filter((p) => p.compatibility.some((c) => c.make === makeName))
//     }
//   }

//   // Apply model filter if provided
//   if (model) {
//     const modelName = mockModels.find((m) => m.id === model)?.name
//     if (modelName) {
//       filteredProducts = filteredProducts.filter((p) => p.compatibility.some((c) => c.model === modelName))
//     }
//   }

//   // Apply year filter if provided
//   if (year) {
//     const yearValue = mockYears.find((y) => y.id === year)?.year
//     if (yearValue) {
//       filteredProducts = filteredProducts.filter((p) => p.compatibility.some((c) => c.year === yearValue))
//     }
//   }

//   // Calculate pagination
//   const startIndex = (page - 1) * limit
//   const endIndex = startIndex + limit
//   const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

//   return {
//     products: paginatedProducts,
//     total: filteredProducts.length,
//   }
// }

// // Fetch categories
// export async function fetchCategories() {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 300))

//   return mockCategories
// }

// // Fetch vehicle makes
// export async function fetchVehicleMakes() {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 300))

//   return mockMakes
// }

// // Fetch vehicle models
// export async function fetchVehicleModels() {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 300))

//   return mockModels
// }

// // Fetch years
// export async function fetchYears() {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 300))

//   return mockYears
// }
