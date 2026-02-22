"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { mockProducts } from "@/mocks/data";
import type { Product } from "@/types";
import ProductGrid from "@/components/product/ProductGrid";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        // todo0050 - 백엔드 연결 후 mock fallback 제거
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {isLoading ? <LoadingSpinner /> : <ProductGrid products={products} />}
    </div>
  );
}
