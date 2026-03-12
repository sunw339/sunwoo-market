/*
  Warnings:

  - You are about to drop the column `idempotency_id` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `order_info` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `order_info` table. All the data in the column will be lost.
  - You are about to drop the column `stock_qty` on the `product_info` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idempotency_key]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idempotency_key` to the `order` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `product_info_id` to the `order_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snapshot_price` to the `order_info` table without a default value. This is not possible if the table is not empty.
  - Made the column `amount` on table `order_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency` on table `order_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `order_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `order_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `product_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency` on table `product_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount_rate` on table `product_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `product_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `product_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `product_info` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `order_info` DROP FOREIGN KEY `order_info_product_id_fkey`;

-- DropIndex
DROP INDEX `order_info_product_id_fkey` ON `order_info`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `idempotency_id`,
    ADD COLUMN `idempotency_key` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    MODIFY `currency` ENUM('KRW', 'USD') NOT NULL DEFAULT 'KRW',
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `order_info` DROP COLUMN `product_id`,
    DROP COLUMN `total_price`,
    ADD COLUMN `product_info_id` INTEGER NOT NULL,
    ADD COLUMN `snapshot_price` INTEGER NOT NULL,
    MODIFY `amount` INTEGER NOT NULL DEFAULT 1,
    MODIFY `currency` ENUM('KRW', 'USD') NOT NULL DEFAULT 'KRW',
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `product_info` DROP COLUMN `stock_qty`,
    ADD COLUMN `name` VARCHAR(191) NULL,
    MODIFY `price` INTEGER NOT NULL,
    MODIFY `currency` ENUM('KRW', 'USD') NOT NULL DEFAULT 'KRW',
    MODIFY `discount_rate` INTEGER NOT NULL DEFAULT 0,
    MODIFY `status` ENUM('ACTIVE', 'INACTIVE', 'SOLD_OUT') NOT NULL DEFAULT 'INACTIVE',
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_info_id` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL DEFAULT 0,
    `version` INTEGER NOT NULL DEFAULT 0,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `stock_product_info_id_key`(`product_info_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `order_idempotency_key_key` ON `order`(`idempotency_key`);

-- CreateIndex
CREATE UNIQUE INDEX `user_email_key` ON `user`(`email`);

-- AddForeignKey
ALTER TABLE `order_info` ADD CONSTRAINT `order_info_product_info_id_fkey` FOREIGN KEY (`product_info_id`) REFERENCES `product_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock` ADD CONSTRAINT `stock_product_info_id_fkey` FOREIGN KEY (`product_info_id`) REFERENCES `product_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
