import { NestFactory } from '@nestjs/core';
import { VersioningType, Logger, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
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

  // 版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // 跨域处理
  app.use(cors());

  // 日志管理
  app.use(loggerMiddleware);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
    }),
  );

  // swagger配置
  const config = new DocumentBuilder()
    .setTitle('Nestjs-dome')
    .setDescription('dome')
    .setVersion('1.0')
    .setExternalDoc('JSON', `http://localhost:${process.env.PORT || 3000}/api-docs-json`)
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap().then(() => {
  Logger.log(`API：http://localhost:${process.env.PORT || 3000}`, 'main.js');
  Logger.log(`swagger：http://localhost:${process.env.PORT || 3000}/api-docs`, 'main.js');
});
