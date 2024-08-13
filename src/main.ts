import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyLogger } from './utils/logger';

async function bootstrap() {
  const logger = new MyLogger();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger,
  });

  const config = app.get(ConfigService);
  const PORT = config.get<number>('PORT');

  await app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
}
bootstrap();
