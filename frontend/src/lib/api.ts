import { API_BASE_URL } from "./constants";
import { transformProduct, transformOrder, transformUser } from "./transform";
import type {
  LoginRequest,
  SignupRequest,
  Product,
  User,
  Order,
  CreateOrderRequest,
  ConfirmPaymentRequest,
  BackendAuthResponse,
  BackendProduct,
  BackendOrder,
  BackendUser,
  CreateProductInput,
} from "@/types";

// ============================================================
// 공통 fetch 래퍼
// ============================================================

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      message: errorBody.message || "An error occurred",
      status: response.status,
    };
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return response.json();
}

// ============================================================
// Auth API
// ============================================================

export async function login(body: LoginRequest): Promise<BackendAuthResponse> {
  return fetchApi<BackendAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function signup(body: SignupRequest): Promise<void> {
  await fetchApi<BackendUser>("/users", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function refreshToken(
  token: string
): Promise<BackendAuthResponse> {
  return fetchApi<BackendAuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: token }),
  });
}

// ============================================================
// User API
// ============================================================

export async function getMe(): Promise<User> {
  const data = await fetchApi<BackendUser>("/users/me");
  return transformUser(data);
}

// ============================================================
// Product API
// ============================================================

export async function getProducts(): Promise<Product[]> {
  const data = await fetchApi<BackendProduct[]>("/products");
  return data.map(transformProduct);
}

export async function getProduct(id: string): Promise<Product> {
  const data = await fetchApi<BackendProduct>(`/products/${id}`);
  return transformProduct(data);
}

// ============================================================
// Admin API
// ============================================================

export async function createProduct(body: CreateProductInput): Promise<Product> {
  const data = await fetchApi<BackendProduct>("/products", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return transformProduct(data);
}

export async function updateProduct(
  id: string,
  body: Partial<CreateProductInput>
): Promise<Product> {
  const data = await fetchApi<BackendProduct>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return transformProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  await fetchApi<void>(`/products/${id}`, { method: "DELETE" });
}

// ============================================================
// Order API
// ============================================================

export async function createOrder(body: CreateOrderRequest): Promise<Order> {
  const data = await fetchApi<BackendOrder>("/order", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return transformOrder(data);
}

export async function getOrders(): Promise<Order[]> {
  const data = await fetchApi<BackendOrder[]>("/order");
  return data.map(transformOrder);
}

export async function getOrder(id: string): Promise<Order> {
  const data = await fetchApi<BackendOrder>(`/order/${id}`);
  return transformOrder(data);
}

// ============================================================
// Payment API
// ============================================================

export async function confirmPayment(body: ConfirmPaymentRequest): Promise<Order> {
  const data = await fetchApi<BackendOrder>("/payment/confirm", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return transformOrder(data);
}
