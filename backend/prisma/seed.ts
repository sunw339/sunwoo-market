import 'dotenv/config';
import mysql from 'mysql2/promise';
import * as bcrypt from 'bcrypt';

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);

  try {
    // 1. Admin 유저
    const adminPassword = await bcrypt.hash('admin1234', 10);
    await connection.execute(
      `INSERT INTO user (name, phone, email, password, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id=id`,
      ['관리자', '010-0000-0000', 'admin@sunwoo.com', adminPassword, 'ADMIN'],
    );

    // 2. 일반 유저
    const userPassword = await bcrypt.hash('user1234', 10);
    await connection.execute(
      `INSERT INTO user (name, phone, email, password, address, address_detail, role)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id=id`,
      ['홍길동', '010-1234-5678', 'user@sunwoo.com', userPassword, '서울시 강남구', '101동 202호', 'USER'],
    );

    // 3. 상품 1: 반팔 티셔츠
    const [p1] = await connection.execute<mysql.ResultSetHeader>(
      `INSERT INTO product (name, description, code, updated_at) VALUES (?, ?, ?, NOW())`,
      ['베이직 반팔 티셔츠', '편안한 착용감의 데일리 반팔 티셔츠', 'TSH-001'],
    );
    const p1Id = p1.insertId;

    for (const [name, price, qty] of [
      ['블랙 M', 29000, 100],
      ['블랙 L', 29000, 50],
      ['화이트 M', 29000, 80],
    ]) {
      const [info] = await connection.execute<mysql.ResultSetHeader>(
        `INSERT INTO product_info (product_id, name, price, status, updated_at) VALUES (?, ?, ?, 'ACTIVE', NOW())`,
        [p1Id, name, price],
      );
      await connection.execute(
        `INSERT INTO stock (product_info_id, qty, updated_at) VALUES (?, ?, NOW())`,
        [info.insertId, qty],
      );
    }

    // 4. 상품 2: 청바지
    const [p2] = await connection.execute<mysql.ResultSetHeader>(
      `INSERT INTO product (name, description, code, updated_at) VALUES (?, ?, ?, NOW())`,
      ['슬림핏 청바지', '클래식한 슬림핏 데님 팬츠', 'JNS-001'],
    );
    const p2Id = p2.insertId;

    for (const [name, price, discountRate, qty] of [
      ['인디고 30', 49000, 0, 60],
      ['인디고 32', 49000, 0, 40],
      ['블랙 30', 52000, 10, 30],
    ]) {
      const [info] = await connection.execute<mysql.ResultSetHeader>(
        `INSERT INTO product_info (product_id, name, price, discount_rate, status, updated_at) VALUES (?, ?, ?, ?, 'ACTIVE', NOW())`,
        [p2Id, name, price, discountRate],
      );
      await connection.execute(
        `INSERT INTO stock (product_info_id, qty, updated_at) VALUES (?, ?, NOW())`,
        [info.insertId, qty],
      );
    }

    // 5. 상품 3: 스니커즈
    const [p3] = await connection.execute<mysql.ResultSetHeader>(
      `INSERT INTO product (name, description, code, updated_at) VALUES (?, ?, ?, NOW())`,
      ['캔버스 스니커즈', '가볍고 편한 캔버스 스니커즈', 'SHO-001'],
    );
    const p3Id = p3.insertId;

    for (const [name, price, status, qty] of [
      ['화이트 260', 39000, 'ACTIVE', 25],
      ['블랙 270', 39000, 'SOLD_OUT', 0],
    ]) {
      const [info] = await connection.execute<mysql.ResultSetHeader>(
        `INSERT INTO product_info (product_id, name, price, status, updated_at) VALUES (?, ?, ?, ?, NOW())`,
        [p3Id, name, price, status],
      );
      await connection.execute(
        `INSERT INTO stock (product_info_id, qty, updated_at) VALUES (?, ?, NOW())`,
        [info.insertId, qty],
      );
    }

    console.log('Seed 완료: 유저 2명, 상품 3개 생성');
  } finally {
    await connection.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
