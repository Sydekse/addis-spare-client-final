// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Users, Zap, Tag, ShoppingCart } from "lucide-react"
// import type { Product } from "@/types/product"

// interface ProductCardProps {
//   product: Product
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   // Get the first image or use a placeholder
//   const mainImage : string =
//     product.images && product.images.length > 0
//       ? '/' + product.images[0]
//       : `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(product.name)}`

//   // Format compatibility for display
//   const compatibilityText =
//     product.compatibility && product.compatibility.length > 0
//       ? product.compatibility.map((c) => `${c.make} ${c.model} ${c.year}`).join(", ")
//       : "Universal Fit"

//   // Get key attributes for display
//   const keyAttributes = product.attributes ? Object.entries(product.attributes).slice(0, 3) : []

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
//       <Link href={`/products/${product.id}`} className="block">
//         <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
//           <Image
//             src={mainImage || "/placeholder.svg"}
//             alt={product.name}
//             fill
//             className="object-contain p-4"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//           {product.stockControlled ? (
//             <div className="absolute top-2 right-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs px-2 py-1 rounded">
//               In Stock
//             </div>
//           ) : (
//             <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-xs px-2 py-1 rounded">
//               On Backorder
//             </div>
//           )}
//         </div>
//       </Link>

//       <div className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <div>
//             <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">{product.category}</div>
//             <h3 className="font-medium text-gray-900 dark:text-gray-100">{product.name}</h3>
//           </div>
//           <div className="text-xs font-medium text-[#670D2F] dark:text-[#ff8fb1]">{product.brand}</div>
//         </div>

//         <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">SKU: {product.sku}</div>

//         <div className="space-y-2 mb-4">
//           {/* Compatibility */}
//           <div className="flex items-center text-sm">
//             <Users className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500 shrink-0" />
//             <span className="truncate text-gray-700 dark:text-gray-300" title={compatibilityText}>
//               {compatibilityText.length > 40 ? compatibilityText.substring(0, 40) + "..." : compatibilityText}
//             </span>
//           </div>

//           {/* Key attributes */}
//           {keyAttributes.map(([key, value], index) => (
//             <div key={index} className="flex items-center text-sm">
//               <Zap className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500 shrink-0" />
//               <span className="text-gray-700 dark:text-gray-300">
//                 {key}: {value}
//               </span>
//             </div>
//           ))}

//           {/* Tags */}
//           {product.tags && product.tags.length > 0 && (
//             <div className="flex items-center text-sm">
//               <Tag className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500 shrink-0" />
//               <div className="flex flex-wrap gap-1">
//                 {product.tags.slice(0, 3).map((tag, index) => (
//                   <span
//                     key={index}
//                     className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-0.5 rounded text-gray-700 dark:text-gray-300"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//                 {product.tags.length > 3 && (
//                   <span className="text-xs text-gray-500 dark:text-gray-400">+{product.tags.length - 3} more</span>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between items-center">
//           <div>
//             <div className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</div>
//             <div className="text-xs text-gray-500 dark:text-gray-400">per part</div>
//           </div>

//           <Button className="bg-[#670D2F] hover:bg-[#670D2F]/90 text-white">
//             <ShoppingCart className="h-4 w-4 mr-2" />
//             Add to Cart
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client';

import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCart } from '@/context/use-cart';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onWishlistClick?: (productId: string) => void;
  isInWishlist?: boolean;
}

export default function ProductCard({ 
  product, 
}: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const router = useRouter();

  const onProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link href={`/product/${product.id}`}>
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onProductClick(product.id)}
    >
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
          <Image
          height={100}
          width={100}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={handleWishlistClick}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
            </Button> */}
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          {product.category && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 text-xs"
            >
              {product.category}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </div>
          
          {product.brand && (
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          )}
          
          <p className="text-xs text-muted-foreground line-clamp-1">
            SKU: {product.sku}
          </p>
          
          {product.compatibility && product.compatibility.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.compatibility.slice(0, 2).map((comp, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {comp.make} {comp.model}
                </Badge>
              ))}
              {product.compatibility.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{product.compatibility.length - 2} more
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-3 w-3 fill-current text-yellow-400"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">(4.5)</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-semibold text-lg">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <Button
          size="sm"
          onClick={(e) => handleAddToCart(e)}
          disabled={isInCart(product.id)}
          className="ml-2"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          {isInCart(product.id) ? 'Added' : 'Add'}
        </Button>
      </CardFooter>
    </Card>
    </Link>
  );
}
