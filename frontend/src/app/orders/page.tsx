"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrders } from "@/lib/api";
import { mockOrders } from "@/mocks/data";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Order } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import Link from "next/link";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    async function fetchOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch {
        // todo0050 - 백엔드 연결 후 mock fallback 제거
        setOrders(mockOrders);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  if (isLoading) return <LoadingSpinner />;

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-500 mb-6">
          You haven&apos;t placed any orders yet.
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium font-mono text-sm">{order.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  statusColors[order.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span>
                ${order.totalAmount.toFixed(2)} {order.currency}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
