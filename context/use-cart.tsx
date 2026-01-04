"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types/cart";
import { getProductById } from "@/lib/api/services/product.service";
import { Product } from "@/types/product";

interface CartContextType {
  items: (CartItem & { product: Product })[];
  addToCart: (
    productId: string,
    quantity?: number,
    compatibilityNote?: string
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<(CartItem & { product: Product })[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (!savedCart) return;
        console.log(savedCart)

        const cartItems: CartItem[] = JSON.parse(savedCart);

        const itemsWithProducts = await Promise.all(
          cartItems.map(async (item) => {
            try {
              const product = await getProductById(item.productId);
              console.log(product);
              return product
                ? { ...item, product }
                : {
                    ...item,
                    product: {
                      id: item.productId,
                      name: "Unknown Product",
                      sku: "N/A",
                      price: item.price,
                      images: ["/img.jpg"],
                      brand: "",
                    } as Product,
                  };
            } catch {
              return {
                ...item,
                product: {
                  id: item.productId,
                  name: "Unavailable Product",
                  sku: "N/A",
                  price: item.price,
                  images: ["/img.jpg"],
                  brand: "",
                } as Product,
              };
            }
          })
        );

        setItems(itemsWithProducts);
      } catch (err) {
        console.error("Failed to restore cart:", err);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const cartItems = items.map(({ product, ...item }) => item);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [items]);

  useEffect(() => {
    console.log("Cart items in state:", items);
    console.log("LocalStorage snapshot:", localStorage.getItem("cart"));
  }, [items]);

  const addToCart = async (
    productId: string,
    quantity = 1,
    compatibilityNote?: string
  ) => {
    try {
      const product = await getProductById(productId);
      console.log(product);
      if (!product) return;

      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.productId === productId
        );

        if (existingItem) {
          return prevItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem: CartItem & { product: Product } = {
            productId,
            quantity,
            price: product.price,
            compatibilityNote,
            addedAt: new Date(),
            product,
          };
          return [...prevItems, newItem];
        }
      });
    } catch (e) {}
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
