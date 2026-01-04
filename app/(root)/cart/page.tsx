// app/cart/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CartPage } from '@/components/cart/CartPage';

export default function Cart() {
  const router = useRouter();

  const handleNavigate = (page: string) => {
    // Navigate to other pages
    switch (page) {
      case 'products':
        router.push('/');
        break;
      case 'checkout':
        router.push('/checkout');
        break;
      default:
        router.push('/');
        break;
    }
  };

  const handleProductClick = (productId: string) => {
    // Navigate to product details page
    router.push(`/products/${productId}`);
  };

  return (
    <CartPage
      onNavigate={handleNavigate}
      onProductClick={handleProductClick}
    />
  );
}
