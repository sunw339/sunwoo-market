"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/useCartStore";
import CartItem from "@/components/cart/CartItem";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const router = useRouter();
  const { items, totalAmount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-0">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${totalAmount().toFixed(2)}</span>
        </div>

        <Button
          size="lg"
          className="w-full mt-6"
          onClick={() => router.push("/checkout")}
        >
          Proceed to Checkout
        </Button>

        <Link
          href="/products"
          className="block text-center text-sm text-gray-500 hover:text-gray-900 mt-4"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
