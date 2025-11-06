"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import { cartApi, type AddToCartPayload } from "@/lib/service/cartApi";

export interface CartItem {
  id: string
  title: string
  titleTranslations?: {
    vi: string
    en: string
    zh: string
  }
  price: string
  image: string
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeFromCart: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const { data:session } = useSession();

  useEffect(() => {
    const fetchCarts = async () => {
      if (!session?.user.id) return;
      const savedCart = await cartApi.getCart(session?.user.id);

      if (savedCart) {
      try {
        setItems(savedCart.items)
      } catch (error) {
        console.error("[v0] Failed to load cart:", error)
      }
    }
    setIsLoaded(true)
    }

    fetchCarts();
  }, [session])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addToCart = async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const payload: AddToCartPayload = { 
      productId: item.id, 
      quantity: item.quantity || 1,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor
    };

    if (session?.user?.id) {
      const cart = await cartApi.addToCart(session.user.id, payload);
      setItems(cart.items);
    } else {
      setItems(prev => [...prev, { ...item, quantity: item.quantity || 1 }]);
    }
  }

  const updateQuantity = async (index: number, quantity: number) => {
    const item = items[index];
    if (!item) return;
    if (!session?.user?.id) {
      // fallback
      setItems(prev => prev.map((it, i) => (i === index ? { ...it, quantity } : it)));
      return;
    }

    const cart = await cartApi.updateItem(session.user.id, item.id, { quantity });
    setItems(cart.items);
  };

  const removeFromCart = async (index: number) => {
    const item = items[index];
    if (!item) return;
    if (!session?.user?.id) {
      setItems(prev => prev.filter((_, i) => i !== index));
      return;
    }

    const cart = await cartApi.removeItem(session.user.id, item.id);
    setItems(cart.items);
  };

  const clearCart = async () => {
    if (!session?.user?.id) {
      setItems([]);
      return;
    }

    const cart = await cartApi.clearCart(session.user.id);
    setItems(cart.items);
  };


  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = Number.parseFloat(item.price.replace(/[^\d.]/g, ""))
      return total + price * item.quantity
    }, 0)
  }

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
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
