"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function OrderCompleteContent() {
  const searchParams = useSearchParams();
  // todo0061 - orderId로 실제 주문 상세 정보 조회
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
      {orderId && (
        <p className="text-sm text-gray-400 mb-8">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/orders">
          <Button variant="secondary">View Orders</Button>
        </Link>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderCompletePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderCompleteContent />
    </Suspense>
  );
}
