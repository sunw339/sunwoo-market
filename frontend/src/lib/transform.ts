import type { BackendProduct, BackendUser, Product, User } from "@/types";

// 백엔드 Product → 프론트엔드 Product 변환
export function transformProduct(bp: BackendProduct): Product {
  const activeInfos = bp.product_infos.filter(
    (info) => info.status === "ACTIVE"
  );
  const firstInfo = activeInfos[0] ?? bp.product_infos[0];
  const price = firstInfo?.price ?? 0;
  const currency = firstInfo?.currency ?? "KRW";
  const totalStock = bp.product_infos.reduce(
    (sum, info) => sum + (info.stock?.qty ?? 0),
    0
  );

  return {
    id: String(bp.id),
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

// 백엔드 User → 프론트엔드 User 변환
export function transformUser(bu: BackendUser): User {
  return {
    id: String(bu.id),
    name: bu.name,
    email: bu.email,
    role: bu.role === "ADMIN" ? "admin" : "user",
  };
}
