"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPayment } from "@/lib/api";
import { useCartStore } from "@/stores/useCartStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);

  const paymentKey = searchParams.get("paymentKey") || "";
  const orderId = searchParams.get("orderId") || "";
  const amount = Number(searchParams.get("amount") || "0");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setErrorMessage("결제 정보가 올바르지 않습니다.");
      return;
    }

    confirmPayment({ paymentKey, orderId, amount })
      .then(() => {
        clearCart();
        setStatus("success");
      })
      .catch((err: unknown) => {
        const e = err as { message?: string };
        setErrorMessage(e.message || "결제 승인에 실패했습니다.");
        setStatus("error");
      });
  }, [paymentKey, orderId, amount, clearCart]);

  if (status === "loading") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500">결제를 확인하고 있습니다...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">결제 승인 실패</h1>
        <p className="text-gray-500 mb-8">{errorMessage}</p>
        <Link href="/cart">
          <Button>장바구니로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">결제가 완료되었습니다!</h1>
      <p className="text-gray-500 mb-2">감사합니다.</p>
      <p className="text-sm text-gray-400 mb-8">
        주문 ID: <span className="font-mono">{orderId}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/orders">
          <Button variant="secondary">주문 내역 보기</Button>
        </Link>
        <Link href="/products">
          <Button>쇼핑 계속하기</Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SuccessContent />
    </Suspense>
  );
}
