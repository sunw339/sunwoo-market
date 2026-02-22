import { API_BASE_URL } from "./constants";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  Product,
  Order,
  CheckoutRequest,
} from "@/types";

// ============================================================
// 공통 fetch 래퍼 - 모든 API 호출은 이 함수를 통해 실행
// ============================================================

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // todo0002 - 백엔드 인증 방식에 맞게 토큰 처리 수정 (Bearer, cookie 등)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // todo0003 - 백엔드 에러 응답 형식에 맞게 수정
    const errorBody = await response.json().catch(() => ({}));
    throw {
      message: errorBody.message || "An error occurred",
      status: response.status,
    };
  }

  // todo0004 - 백엔드 응답 래핑 구조에 맞게 파싱 수정 (예: { data: T } → response.data)
  return response.json();
}

// ============================================================
// Auth API
// ============================================================

// todo0010 - 실제 로그인 엔드포인트 연결
export async function login(body: LoginRequest): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// todo0011 - 실제 회원가입 엔드포인트 연결
export async function signup(body: SignupRequest): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ============================================================
// Product API
// ============================================================

// todo0020 - 실제 상품 목록 엔드포인트 연결 + 페이지네이션/필터 파라미터 추가
export async function getProducts(): Promise<Product[]> {
  return fetchApi<Product[]>("/products");
}

// todo0021 - 실제 상품 상세 엔드포인트 연결
export async function getProduct(id: string): Promise<Product> {
  return fetchApi<Product>(`/products/${id}`);
}

// ============================================================
// Order API
// ============================================================

// todo0030 - 실제 주문 생성 엔드포인트 연결
export async function createOrder(body: CheckoutRequest): Promise<Order> {
  return fetchApi<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// todo0031 - 실제 주문 내역 엔드포인트 연결
export async function getOrders(): Promise<Order[]> {
  return fetchApi<Order[]>("/orders");
}

// todo0032 - 실제 주문 상세 엔드포인트 연결
export async function getOrder(id: string): Promise<Order> {
  return fetchApi<Order>(`/orders/${id}`);
}

// ============================================================
// Admin API
// ============================================================

// todo0022 - 실제 상품 등록 엔드포인트 연결
export async function createProduct(
  body: Omit<Product, "id">
): Promise<Product> {
  return fetchApi<Product>("/products", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
