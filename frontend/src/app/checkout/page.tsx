"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import { createOrder } from "@/lib/api";
import type { ShippingAddress } from "@/types";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartStore();
  const idempotencyKey = useRef(crypto.randomUUID());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState<ShippingAddress>({
    recipientName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // todo0060 - 결제 게이트웨이 연동 (Stripe 등) 추가
      const order = await createOrder(
        {
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          shippingAddress: address,
        },
        idempotencyKey.current,
      );
      clearCart();
      router.push(`/order-complete?orderId=${order.id}`);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>

          <Input
            id="recipientName"
            label="Recipient Name"
            value={address.recipientName}
            onChange={(e) => handleChange("recipientName", e.target.value)}
            required
          />
          <Input
            id="addressLine1"
            label="Address Line 1"
            value={address.addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value)}
            required
          />
          <Input
            id="addressLine2"
            label="Address Line 2 (Optional)"
            value={address.addressLine2}
            onChange={(e) => handleChange("addressLine2", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="city"
              label="City"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
              required
            />
            <Input
              id="state"
              label="State / Province"
              value={address.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="postalCode"
              label="Postal Code"
              value={address.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              required
            />
            <Input
              id="country"
              label="Country"
              value={address.country}
              onChange={(e) => handleChange("country", e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" size="lg" isLoading={isLoading} className="w-full mt-4">
            Place Order
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
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
              <span>Total</span>
              <span>{formatPrice(totalAmount())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
