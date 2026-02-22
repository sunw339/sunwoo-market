"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();

  // XXXXADMIN - admin 체크 임시 비활성화
  // useEffect(() => {
  //   if (!isAuthenticated || !isAdmin()) {
  //     router.push("/products");
  //   }
  // }, [isAuthenticated, isAdmin, router]);

  // if (!isAuthenticated || !isAdmin()) {
  //   return null;
  // }

  return <>{children}</>;
}
