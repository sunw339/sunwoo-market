"use client";

import { useState, useEffect } from "react";
import { createProduct, getProducts } from "@/lib/api";
import { mockProducts } from "@/mocks/data";
import { formatPrice } from "@/lib/format";
import AdminGuard from "@/components/layout/AdminGuard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { Product } from "@/types";

// ── 탭 타입 ──
type Tab = "register" | "list";

// ── 상품 등록 폼 ──
interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
}

const initialForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  imageUrl: "",
};

// ── 상품 상세 모달 ──
function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-3">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            {product.description}
          </p>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-semibold">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500">
              재고: {product.stock}개
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 상품 리스트 탭 ──
function ProductListTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">
        등록된 상품이 없습니다.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4">이미지</th>
              <th className="pb-3 pr-4">상품명</th>
              <th className="pb-3 pr-4">카테고리</th>
              <th className="pb-3 pr-4 text-right">가격</th>
              <th className="pb-3 text-right">재고</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="py-3 pr-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="py-3 pr-4 font-medium">{product.name}</td>
                <td className="py-3 pr-4 text-gray-500">{product.category}</td>
                <td className="py-3 pr-4 text-right">
                  {formatPrice(product.price)}
                </td>
                <td className="py-3 text-right">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

// ── 상품 등록 탭 ──
function ProductRegisterTab() {
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field: keyof ProductForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await createProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        currency: "KRW",
        category: form.category,
        stock: Number(form.stock),
        imageUrl:
          form.imageUrl ||
          `https://placehold.co/400x400/e2e8f0/475569?text=${encodeURIComponent(form.name)}`,
      });
      setSuccess("상품이 등록되었습니다.");
      setForm(initialForm);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "상품 등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="상품명"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
      />

      <div className="w-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          상품 설명
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          label="가격 (원)"
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          required
          min="0"
        />
        <Input
          id="stock"
          label="재고"
          type="number"
          value={form.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          required
          min="0"
        />
      </div>

      <Input
        id="category"
        label="카테고리"
        value={form.category}
        onChange={(e) => handleChange("category", e.target.value)}
        required
      />

      <Input
        id="imageUrl"
        label="이미지 URL (선택)"
        value={form.imageUrl}
        onChange={(e) => handleChange("imageUrl", e.target.value)}
        placeholder="https://example.com/image.jpg"
      />

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 text-center">{success}</p>
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        className="w-full mt-4"
      >
        상품 등록
      </Button>
    </form>
  );
}

// ── 메인 페이지 ──
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("list");

  const tabs: { key: Tab; label: string }[] = [
    { key: "list", label: "상품 리스트" },
    { key: "register", label: "상품 등록" },
  ];

  return (
    <AdminGuard>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>

        {/* 탭 네비게이션 */}
        <div className="flex border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === "list" && <ProductListTab />}
        {activeTab === "register" && <ProductRegisterTab />}
      </div>
    </AdminGuard>
  );
}
