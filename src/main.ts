import { TransformInterceptor } from './transform.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main App');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`App running on port ${port}`);
}
bootstrap();
