import { axiosAuth } from "@/lib/axios";
import type { CartItem } from "@/contexts/cart-context";

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface UpdateCartPayload {
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  totalPrice: number;
}

export const cartApi = {
  getCart: async (userId: string) => {
    const res = await axiosAuth.get<{ data: CartResponse }>(`/api/cart?userId=${userId}`);
    return res.data.data;
  },
  addToCart: async (userId: string, payload: AddToCartPayload) => {
    const res = await axiosAuth.post<{ data: CartResponse }>(`/api/cart/items?userId=${userId}`, payload);
    return res.data.data;
  },
  updateItem: async (userId: string, itemId: string, payload: UpdateCartPayload) => {
    const res = await axiosAuth.put<{ data: CartResponse }>(
      `/api/cart/items/${itemId}?userId=${userId}`,
      payload
    );
    return res.data.data;
  },
  removeItem: async (userId: string, itemId: string) => {
    const res = await axiosAuth.delete<{ data: CartResponse }>(
      `/api/cart/items/${itemId}?userId=${userId}`
    );
    return res.data.data;
  },
  clearCart: async (userId: string) => {
    const res = await axiosAuth.delete<{ data: CartResponse }>(`/api/cart/clear?userId=${userId}`);
    return res.data.data;
  },
};
