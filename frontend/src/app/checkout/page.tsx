"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import { createOrder } from "@/lib/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount } = useCartStore();
  const idempotencyKey = useRef(crypto.randomUUID());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({ addressLine1: "", addressLine2: "" });

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleChange = (field: keyof typeof address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const total = totalAmount();
      const order = await createOrder({
        idempotency_key: idempotencyKey.current,
        total_price: total,
        items: items.map((item) => ({
          product_info_id: Number(item.product.productInfoId),
          snapshot_price: item.product.price,
          amount: item.quantity,
        })),
      });

      const orderName =
        items.length === 1
          ? items[0].product.name
          : `${items[0].product.name} 외 ${items.length - 1}건`;

      const params = new URLSearchParams({
        orderId: order.idempotencyKey,
        amount: String(total),
        orderName,
      });
      router.push(`/payment?${params.toString()}`);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "주문 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">주문서</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-semibold mb-2">배송지 정보</h2>

          <Input
            id="addressLine1"
            label="주소"
            value={address.addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value)}
            required
          />
          <Input
            id="addressLine2"
            label="상세주소 (선택)"
            value={address.addressLine2}
            onChange={(e) => handleChange("addressLine2", e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-4">
            결제하기
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">주문 요약</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-semibold">
              <span>합계</span>
              <span>{formatPrice(totalAmount())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
