import { NestFactory } from '@nestjs/core';
import { VersioningType, Logger, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { ResInterception } from 'src/common/response';
import { HttpFilter, ExcepFilter } from 'src/common/filter';
import winstonLogger from 'src/common/logger';
import loggerMiddleware from 'src/middleware/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonLogger,
    }),
    cors: false,
  });

  // 版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });
  // 全局守卫
  // app.useGlobalGuards(new AuthGuard());
  // 响应拦截器
  app.useGlobalInterceptors(new ResInterception());
  // 异常拦截
  app.useGlobalFilters(new HttpFilter());
  app.useGlobalFilters(new ExcepFilter());
  // 跨域处理
  app.use(cors());

  // 日志管理
  app.use(loggerMiddleware);

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
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
