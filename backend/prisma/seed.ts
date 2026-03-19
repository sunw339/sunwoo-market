import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

// @ts-expect-error prisma v7 타입은 adapter를 요구하지만 prisma.config.ts에서 datasource URL을 제공
const prisma = new PrismaClient();

async function main() {
  // 1. Admin 유저
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sunwoo.com' },
    update: {},
    create: {
      name: '관리자',
      phone: '010-0000-0000',
      email: 'admin@sunwoo.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // 2. 일반 유저
  const userPassword = await bcrypt.hash('user1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@sunwoo.com' },
    update: {},
    create: {
      name: '홍길동',
      phone: '010-1234-5678',
      email: 'user@sunwoo.com',
      password: userPassword,
      address: '서울시 강남구',
      address_detail: '101동 202호',
      role: 'USER',
    },
  });

  // 3. 상품 + 옵션 + 재고
  const product1 = await prisma.product.create({
    data: {
      name: '베이직 반팔 티셔츠',
      description: '편안한 착용감의 데일리 반팔 티셔츠',
      code: 'TSH-001',
      product_infos: {
        create: [
          {
            name: '블랙 M',
            price: 29000,
            status: 'ACTIVE',
            stock: { create: { qty: 100 } },
          },
          {
            name: '블랙 L',
            price: 29000,
            status: 'ACTIVE',
            stock: { create: { qty: 50 } },
          },
          {
            name: '화이트 M',
            price: 29000,
            status: 'ACTIVE',
            stock: { create: { qty: 80 } },
          },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: '슬림핏 청바지',
      description: '클래식한 슬림핏 데님 팬츠',
      code: 'JNS-001',
      product_infos: {
        create: [
          {
            name: '인디고 30',
            price: 49000,
            status: 'ACTIVE',
            stock: { create: { qty: 60 } },
          },
          {
            name: '인디고 32',
            price: 49000,
            status: 'ACTIVE',
            stock: { create: { qty: 40 } },
          },
          {
            name: '블랙 30',
            price: 52000,
            discount_rate: 10,
            status: 'ACTIVE',
            stock: { create: { qty: 30 } },
          },
        ],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: '캔버스 스니커즈',
      description: '가볍고 편한 캔버스 스니커즈',
      code: 'SHO-001',
      product_infos: {
        create: [
          {
            name: '화이트 260',
            price: 39000,
            status: 'ACTIVE',
            stock: { create: { qty: 25 } },
          },
          {
            name: '블랙 270',
            price: 39000,
            status: 'SOLD_OUT',
            stock: { create: { qty: 0 } },
          },
        ],
      },
    },
  });

  console.log('Seed 완료:', {
    users: [admin.email, user.email],
    products: [product1.name, product2.name, product3.name],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
