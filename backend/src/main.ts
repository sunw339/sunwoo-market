import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  dotenv.config();
  // 1. 일반적인 HTTP 웹 서버 생성
  const app = await NestFactory.create(AppModule);

  await app.listen(Number(process.env.PORT_NUMBER));
}

bootstrap();
