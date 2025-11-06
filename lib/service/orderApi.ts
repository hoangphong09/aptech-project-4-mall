import { axiosAuth } from "../axios" // your authenticated Axios instance
import type { AxiosResponse } from "axios"

// --- DTOs matching your backend ---

export interface CheckoutRequest {
  address: string
  phone: string
  note?: string
}

export interface UpdateOrderStatusRequest {
  status: string
}

export interface OrderItemResponse {
  id: number
  productId: number
  productName: string
  quantity: number
  price: number
  imageUrl?: string
}

export interface OrderResponse {
  id: number
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  updatedAt: string
  items?: OrderItemResponse[]
  userId?: number
}

export interface PaginatedOrders {
  orders: OrderResponse[]
  currentPage: number
  totalItems: number
  totalPages: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// --- Main Order API service ---
export const OrderApi = {
  /**
   * Create an order from the cart (checkout)
   * POST /api/orders/checkout?userId={userId}
   */
  checkout: async (userId: number, request: CheckoutRequest): Promise<ApiResponse<OrderResponse>> => {
    const res: AxiosResponse<ApiResponse<OrderResponse>> = await axiosAuth.post(
      `/orders/checkout`,
      request,
      { params: { userId } }
    )
    return res.data
  },

  /**
   * Get paginated orders for a user
   * GET /api/orders?userId={userId}&page={page}&size={size}
   */
  getUserOrders: async (
    userId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PaginatedOrders>> => {
    const res: AxiosResponse<ApiResponse<PaginatedOrders>> = await axiosAuth.get(`/orders`, {
      params: { userId, page, size },
    })
    return res.data
  },

  /**
   * Get a specific order’s detail by ID
   * GET /api/orders/{orderId}?userId={userId}
   */
  getOrderDetail: async (userId: number, orderId: number): Promise<ApiResponse<OrderResponse>> => {
    const res: AxiosResponse<ApiResponse<OrderResponse>> = await axiosAuth.get(`/orders/${orderId}`, {
      params: { userId },
    })
    return res.data
  },

  /**
   * Get order detail by order number
   * GET /api/orders/number/{orderNumber}?userId={userId}
   */
  getOrderByNumber: async (userId: number, orderNumber: string): Promise<ApiResponse<OrderResponse>> => {
    const res: AxiosResponse<ApiResponse<OrderResponse>> = await axiosAuth.get(
      `/orders/number/${orderNumber}`,
      { params: { userId } }
    )
    return res.data
  },

  /**
   * Update an order’s status (admin or self)
   * PUT /api/orders/{orderId}/status?userId={userId}
   */
  updateOrderStatus: async (
    userId: number,
    orderId: number,
    request: UpdateOrderStatusRequest
  ): Promise<ApiResponse<OrderResponse>> => {
    const res: AxiosResponse<ApiResponse<OrderResponse>> = await axiosAuth.put(
      `/orders/${orderId}/status`,
      request,
      { params: { userId } }
    )
    return res.data
  },

  /**
   * Cancel an order (only if PENDING)
   * DELETE /api/orders/{orderId}?userId={userId}
   */
  cancelOrder: async (userId: number, orderId: number): Promise<ApiResponse<OrderResponse>> => {
    const res: AxiosResponse<ApiResponse<OrderResponse>> = await axiosAuth.delete(
      `/orders/${orderId}`,
      { params: { userId } }
    )
    return res.data
  },
}
