# 🛍️ Sunwoo Market

> 패션 커머스 플랫폼 백엔드 · NestJS · TypeScript · AWS  
> 재고 동시성 제어부터 분산 락, 결제 연동, 부하테스트까지 실무 수준의 커머스 백엔드를 구현합니다.

---

## 📐 시스템 아키텍처

![architecture](https://github.com/user-attachments/assets/728c795c-99a0-4beb-93e5-25e6fd7248c9)

### 주문 처리 플로우

```
주문 요청
  → 로드밸런서
  → 애플리케이션 서버
      1. Redis로 재고 확인 + 차감 (Lua Script, 원자적 처리)
      2. 재고 차감 완료
      3. DB에 주문 생성 (pending)
      4. 주문 생성 완료
      5. PG사 결제 요청
      6. 결제 성공 → 주문 상태 confirmed / 실패 → failed + Redis 재고 복구
      7. 주문 상태 업데이트
      8. 결제 완료 알림 → 메시지 큐
```

---

## 🛠 Tech Stack

| 분류 | 기술 |
|------|------|
| Runtime | Node.js + TypeScript |
| Framework | NestJS |
| ORM | Prisma |
| Database | MySQL |
| Cache | Redis |
| Storage | AWS S3 |
| Infra | AWS EC2, GitHub Actions |
| Test | Jest, Supertest, k6 |

---

## 🗂 프로젝트 구조

```
backend/
├── prisma/
├── src/
│   └── modules/
│       ├── auth/        # JWT 인증
│       ├── user/        # 유저 관리
│       ├── product/     # 상품 관리
│       ├── stock/       # 재고 관리
│       ├── order/       # 주문 처리
│       ├── payment/     # 결제 (Toss Payments)
│       └── prisma/      # Prisma 모듈
└── test/
```

---

## ⚙️ Getting Started

```bash
git clone https://github.com/sunw339/sunwoo-market.git
cd sunwoo-market/backend

npm install
cp .env.example .env

npx prisma migrate dev
npm run start:dev
```

---

## 🗺 Milestones

### Phase 1 · DB 락 기반

| 단계 | 내용 | 상태 |
|------|------|------|
| v0.1 | 프로젝트 초기 세팅 (NestJS, Prisma, 인증) | ✅ 완료 |
| v0.2 | 상품 / 재고 / 주문 API | 🔨 진행중 |
| v0.3 | 결제 연동 (Toss Payments) | ⬜ 예정 |
| v0.4 | 낙관적 락 vs 비관적 락 동시성 제어 비교 | ⬜ 예정 |
| v0.5 | k6 부하테스트 - DB 락 성능 측정 | ⬜ 예정 |
| v1.0 | 배포 (EC2 + GitHub Actions) | ⬜ 예정 |

### Phase 2 · Redis 도입

| 단계 | 내용 | 상태 |
|------|------|------|
| v1.1 | Redis Lua Script 재고 차감 전환 | ⬜ 예정 |
| v1.2 | 선착순 쿠폰 (Redis INCR 원자적 처리) | ⬜ 예정 |
| v1.3 | k6 부하테스트 - DB 락 vs Redis 성능 비교 | ⬜ 예정 |

### Phase 3 · Redis Active-Active (CRDB)

| 단계 | 내용 | 상태 |
|------|------|------|
| v2.0 | Redis Active-Active 멀티 리전 구성 | 🔭 목표 |
| v2.1 | CRDT 기반 데이터 충돌 해소 전략 | 🔭 목표 |
