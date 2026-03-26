import { API_BASE_URL } from "./constants";
import { transformProduct, transformUser } from "./transform";
import type {
  LoginRequest,
  SignupRequest,
  Product,
  User,
  Order,
  CheckoutRequest,
  BackendAuthResponse,
  BackendProduct,
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
// Order API (미구현 - 백엔드 Order 모듈 추가 시 연결)
// ============================================================

export async function createOrder(
  _body: CheckoutRequest,
  _idempotencyKey: string
): Promise<Order> {
  throw { message: "Order API not implemented", status: 501 };
}

export async function getOrders(): Promise<Order[]> {
  throw { message: "Order API not implemented", status: 501 };
}

export async function getOrder(_id: string): Promise<Order> {
  throw { message: "Order API not implemented", status: 501 };
}
