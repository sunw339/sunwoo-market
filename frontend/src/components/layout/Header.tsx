"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";

export default function Header() {
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/products" className="text-xl font-bold text-gray-900">
            Sunwoo Market
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="text-sm text-gray-600 hover:text-gray-900 relative"
            >
              Cart
              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-4 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/orders"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Orders
                </Link>
                {/* XXXXADMIN - isAdmin() && ( */}
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Admin
                </Link>
                {/* XXXXADMIN ) */}
                <span className="text-sm text-gray-500">
                  {user?.name || "User"}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
