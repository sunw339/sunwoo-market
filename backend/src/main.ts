import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  dotenv.config();
  // 1. 일반적인 HTTP 웹 서버 생성
  const app = await NestFactory.create(AppModule);
  // 2. 생성된 서버에 Redis 마이크로서비스 연결
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      retryAttempts: 3,
    },
  });

  await app.listen(8000);
}

bootstrap();
