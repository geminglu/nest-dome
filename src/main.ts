import { NestFactory } from '@nestjs/core';
import { VersioningType, Logger, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { ResInterception } from 'src/common/response';
import { HttpFilter, ExcepFilter } from 'src/common/filter';
import winstonLogger from 'src/common/logger';
import loggerMiddleware from 'src/middleware/logger';
import { STATIC_PATH, STATIC_UP_PATH } from './utils/constant';
import config from './config';
import { generateDisplayBox } from './utils';

const { port, swagger, graphqlIde } = config();

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
  app.useStaticAssets(STATIC_UP_PATH, {
    prefix: STATIC_PATH,
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
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
    }),
  );

  if (swagger) {
    // swagger配置
    const config = new DocumentBuilder()
      .setTitle('Nestjs-dome')
      .setDescription('dome')
      .setVersion('1.0')
      .setExternalDoc('JSON', `http://localhost:${port}/api-docs-json`)
      .addBearerAuth()
      .build();
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('/api-docs', app, document);
  }

  await app.listen(port);
}

void bootstrap().then(() => {
  const urls = [`API：\x1b[34mhttp://localhost:${port}\x1b[0m`];
  if (swagger) {
    urls.push(`swagger：\x1b[34mhttp://localhost:${port}/api-docs\x1b[0m`);
  }
  if (graphqlIde) {
    urls.push(`graphql：\x1b[34mhttp://localhost:${port}/graphql\x1b[0m`);
  }

  Logger.verbose(generateDisplayBox(urls), 'main');
});
