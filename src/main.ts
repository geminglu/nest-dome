import { NestFactory } from '@nestjs/core';
import { VersioningType, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
