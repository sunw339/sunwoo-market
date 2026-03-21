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

export interface ShippingAddress {
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
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
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  shippingAddress: ShippingAddress;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface CheckoutRequest {
  items: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
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
