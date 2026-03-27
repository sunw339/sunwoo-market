// ============================================================
// Frontend Types (컴포넌트에서 사용하는 정규화된 타입)
// ============================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface Product {
  id: string;
  productInfoId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  stock: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface Order {
  id: string;
  idempotencyKey: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "FAILED" | "REFUNDED";
  createdAt: string;
}

export interface CreateOrderRequest {
  idempotency_key: string;
  total_price: number;
  items: {
    product_info_id: number;
    snapshot_price: number;
    amount: number;
  }[];
}

export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface ApiError {
  message: string;
  status: number;
}

// ============================================================
// Backend Response Types (API 응답 원본 타입)
// ============================================================

export interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface BackendUser {
  id: number;
  name: string;
  phone: string;
  email: string;
  address?: string | null;
  address_detail?: string | null;
  role: "USER" | "ADMIN";
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface BackendStock {
  id: number;
  qty: number;
}

export interface BackendProductInfo {
  id: number;
  product_id: number;
  name?: string | null;
  price: number;
  currency: "KRW" | "USD";
  discount_rate: number;
  status: "ACTIVE" | "INACTIVE" | "SOLD_OUT";
  stock?: BackendStock | null;
}

export interface BackendProduct {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  thumb_url?: string | null;
  code?: string | null;
  product_infos: BackendProductInfo[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface BackendOrderInfo {
  id: number;
  order_id: number;
  product_info_id: number;
  snapshot_price: number;
  amount: number;
  currency: "KRW" | "USD";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BackendOrder {
  id: number;
  user_id: number;
  idempotency_key: string;
  paymentKey: string | null;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "FAILED" | "REFUNDED";
  total_price: number;
  currency: "KRW" | "USD";
  address: string | null;
  address_detail: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  deleted_at: string | null;
  order_infos: BackendOrderInfo[];
}

// ============================================================
// Admin / Create Types
// ============================================================

export interface CreateProductInfoInput {
  name?: string;
  price: number;
  currency?: "KRW" | "USD";
  discountRate?: number;
  status?: "ACTIVE" | "INACTIVE" | "SOLD_OUT";
  stockQty: number;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  imageUrl?: string;
  thumbUrl?: string;
  code?: string;
  productInfos: CreateProductInfoInput[];
}
