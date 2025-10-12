// app/providers.tsx
'use client';

import { CartProvider } from '@/context/use-cart';

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
