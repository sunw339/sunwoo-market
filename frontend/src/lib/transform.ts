import type { BackendOrder, BackendProduct, BackendUser, Order, Product, User } from "@/types";

// 백엔드 Product → 프론트엔드 Product 변환
export function transformProduct(bp: BackendProduct): Product {
  const activeInfos = bp.product_infos.filter(
    (info) => info.status === "ACTIVE"
  );
  const firstInfo = activeInfos[0] ?? bp.product_infos[0];
  const rawPrice = firstInfo?.price ?? 0;
  const discountRate = firstInfo?.discount_rate ?? 0;
  const price = Math.round(rawPrice * (1 - discountRate / 100));
  const currency = firstInfo?.currency ?? "KRW";
  const totalStock = bp.product_infos.reduce(
    (sum, info) => sum + (info.stock?.qty ?? 0),
    0
  );

  return {
    id: String(bp.id),
    productInfoId: firstInfo ? String(firstInfo.id) : "",
    name: bp.name,
    description: bp.description ?? "",
    price,
    currency,
    imageUrl:
      bp.image_url ??
      `https://placehold.co/400x400/e2e8f0/475569?text=${encodeURIComponent(bp.name)}`,
    stock: totalStock,
    category: bp.code ?? "",
  };
}

// 백엔드 Order → 프론트엔드 Order 변환
export function transformOrder(bo: BackendOrder): Order {
  return {
    id: String(bo.id),
    idempotencyKey: bo.idempotency_key,
    items: bo.order_infos.map((info) => ({
      productId: String(info.product_info_id),
      productName: "",
      price: info.snapshot_price,
      currency: info.currency,
      quantity: info.amount,
    })),
    totalAmount: bo.total_price,
    currency: bo.currency,
    status: bo.status,
    createdAt: bo.created_at,
  };
}

// 백엔드 User → 프론트엔드 User 변환
export function transformUser(bu: BackendUser): User {
  return {
    id: String(bu.id),
    name: bu.name,
    email: bu.email,
    role: bu.role === "ADMIN" ? "admin" : "user",
  };
}
