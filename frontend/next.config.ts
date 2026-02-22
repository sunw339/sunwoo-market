import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // todo0070 - 실제 상품 이미지 호스트 도메인 추가
    ],
  },
};

export default nextConfig;
