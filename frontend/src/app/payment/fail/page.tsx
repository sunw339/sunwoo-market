"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const message = searchParams.get("message") || "결제에 실패했습니다.";

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
      <p className="text-gray-500 mb-2">{message}</p>
      {code && (
        <p className="text-sm text-gray-400 mb-8">에러 코드: {code}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/cart">
          <Button variant="secondary">장바구니로 돌아가기</Button>
        </Link>
        <Link href="/products">
          <Button>쇼핑 계속하기</Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FailContent />
    </Suspense>
  );
}
