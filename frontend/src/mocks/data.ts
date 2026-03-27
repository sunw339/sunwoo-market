import type { Product, Order } from "@/types";

// todo0050 - 백엔드 API 완성 후 mock 데이터 제거
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    productInfoId: "1",
    name: "Classic White T-Shirt",
    description:
      "A comfortable 100% cotton t-shirt perfect for everyday wear. Available in all sizes.",
    price: 29900,
    currency: "KRW",
    imageUrl: "https://placehold.co/400x400/e2e8f0/475569?text=T-Shirt",
    stock: 50,
    category: "clothing",
  },
  {
    id: "prod-2",
    productInfoId: "2",
    name: "Wireless Bluetooth Earbuds",
    description:
      "High-quality sound with 24-hour battery life. Active noise cancellation included.",
    price: 79900,
    currency: "KRW",
    imageUrl: "https://placehold.co/400x400/e2e8f0/475569?text=Earbuds",
    stock: 30,
    category: "electronics",
  },
  {
    id: "prod-3",
    productInfoId: "3",
    name: "Stainless Steel Water Bottle",
    description:
      "Keeps drinks cold for 24h, hot for 12h. 750ml capacity. BPA free.",
    price: 24900,
    currency: "KRW",
    imageUrl: "https://placehold.co/400x400/e2e8f0/475569?text=Bottle",
    stock: 100,
    category: "lifestyle",
  },
  {
    id: "prod-4",
    productInfoId: "4",
    name: "Leather Crossbody Bag",
    description:
      "Compact genuine leather bag with adjustable strap. Perfect for travel.",
    price: 119900,
    currency: "KRW",
    imageUrl: "https://placehold.co/400x400/e2e8f0/475569?text=Bag",
    stock: 15,
    category: "accessories",
  },
  {
    id: "prod-5",
    productInfoId: "5",
    name: "Running Shoes Pro",
    description:
      "Lightweight and breathable running shoes with superior cushioning.",
    price: 89900,
    currency: "KRW",
    imageUrl: "https://placehold.co/400x400/e2e8f0/475569?text=Shoes",
    stock: 25,
    category: "clothing",
  },
  {
    id: "prod-6",
    productInfoId: "6",
    name: "Smart Watch Series X",
    description:
      "Track your fitness, receive notifications, and more with a stunning AMOLED display.",
    price: 199900,
    currency: "KRW",
    imageUrl: "https://placehold.co/400x400/e2e8f0/475569?text=Watch",
    stock: 20,
    category: "electronics",
  },
];

export const mockOrders: Order[] = [
  {
    id: "order-1001",
    idempotencyKey: "mock-key-1",
    items: [
      {
        productId: "prod-1",
        productName: "Classic White T-Shirt",
        price: 29900,
        currency: "KRW",
        quantity: 2,
      },
      {
        productId: "prod-3",
        productName: "Stainless Steel Water Bottle",
        price: 24900,
        currency: "KRW",
        quantity: 1,
      },
    ],
    totalAmount: 84700,
    currency: "KRW",
    status: "DELIVERED",
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "order-1002",
    idempotencyKey: "mock-key-2",
    items: [
      {
        productId: "prod-2",
        productName: "Wireless Bluetooth Earbuds",
        price: 79900,
        currency: "KRW",
        quantity: 1,
      },
    ],
    totalAmount: 79900,
    currency: "KRW",
    status: "SHIPPED",
    createdAt: "2026-02-15T14:30:00Z",
  },
];
