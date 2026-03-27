"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

declare global {
  interface Window {
    TossPayments: (clientKey: string) => TossPaymentsInstance;
  }
}

interface TossPaymentsInstance {
  widgets: (options: { customerKey: string }) => TossWidgets;
}

interface TossWidgets {
  setAmount: (amount: { currency: string; value: number }) => Promise<void>;
  renderPaymentMethods: (options: {
    selector: string;
    variantKey?: string;
  }) => Promise<void>;
  renderAgreement: (options: {
    selector: string;
    variantKey?: string;
  }) => Promise<void>;
  requestPayment: (options: {
    orderId: string;
    orderName: string;
    customerName?: string;
    customerEmail?: string;
    successUrl: string;
    failUrl: string;
  }) => Promise<void>;
}

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

function PaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const amount = Number(searchParams.get("amount") || "0");
  const orderName = searchParams.get("orderName") || "주문";

  const widgetsRef = useRef<TossWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId || !amount) return;

    const initWidget = () => {
      if (typeof window.TossPayments === "undefined") {
        setTimeout(initWidget, 200);
        return;
      }

      try {
        const tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
        const customerKey = crypto.randomUUID();
        const widgets = tossPayments.widgets({ customerKey });

        widgets
          .setAmount({ currency: "KRW", value: amount })
          .then(() =>
            Promise.all([
              widgets.renderPaymentMethods({
                selector: "#payment-method",
                variantKey: "DEFAULT",
              }),
              widgets.renderAgreement({
                selector: "#agreement",
                variantKey: "AGREEMENT",
              }),
            ])
          )
          .then(() => {
            widgetsRef.current = widgets;
            setReady(true);
          })
          .catch((err: Error) => {
            setError(err.message || "결제 위젯을 불러오는데 실패했습니다.");
          });
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e.message || "TossPayments 초기화에 실패했습니다.");
      }
    };

    initWidget();
  }, [orderId, amount]);

  const handlePayment = async () => {
    if (!widgetsRef.current) return;

    try {
      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "결제 요청에 실패했습니다.");
    }
  };

  if (!orderId || !amount) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-red-500">잘못된 접근입니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">결제</h1>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">주문명</span>
          <span className="font-medium">{orderName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">결제 금액</span>
          <span className="font-semibold text-lg">
            {amount.toLocaleString("ko-KR")}원
          </span>
        </div>
      </div>

      <div id="payment-method" className="mb-4" />
      <div id="agreement" className="mb-6" />

      {error && (
        <p className="text-sm text-red-500 text-center mb-4">{error}</p>
      )}

      <button
        onClick={handlePayment}
        disabled={!ready}
        className="w-full py-3 rounded-lg text-white font-semibold text-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600"
      >
        {ready ? "결제하기" : "결제 수단 로딩 중..."}
      </button>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentContent />
    </Suspense>
  );
}
