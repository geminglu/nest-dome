import { NestFactory } from '@nestjs/core';
import { VersioningType, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { HttpFilter } from 'src/common/filter';
import winstonLogger from 'src/common/logger';
import loggerMiddleware from 'src/middleware/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap().then(() => {
  Logger.log(`API：http://localhost:${process.env.PORT || 3000}`, 'main.js');
  Logger.log(
    `swagger：http://localhost:${process.env.PORT || 3000}/api-docs`,
    'main.js',
  );
});
