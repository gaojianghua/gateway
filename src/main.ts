import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { generateDocument } from './doc';
import fastify from 'fastify';
import * as cookieParser from 'cookie-parser';
import { FastifyLogger } from './common/logger';
import fastifyCookie from '@fastify/cookie';
import { catchError } from './common/logger/catchError';
declare const module: any;
catchError()
/**
 * Fastify框架在QPS(并发处理请求)的效率上要远超其他框架
 * 达到了几乎两倍的基准测试结果
 * 安装依赖: @nestjs/platform-fastify
 */
async function bootstrap() {
  // 初始化 fastify 
  const fastifyInstance = fastify({
    logger: FastifyLogger,
    // logger: true
  })

  // fastify hook 拦截器
  // fastHook(fastifyInstance)

  // 初始化nest实例
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance)
  );

  // 配置cookie签名
  app.register(fastifyCookie, {
    secret: 'wolffy'
  });

  // 设置全局接口前缀
  app.setGlobalPrefix('api');

  // 格式化 cookie
  app.use(cookieParser());

  // 统一响应体格式
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  
  // 接口版本化管理
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 配置Swagger创建文档
  generateDocument(app)

  // 启动全局字段校验，保证请求接口字段校验正确。
  app.useGlobalPipes(new ValidationPipe());

  // 启动服务
  await app.listen(3000);

  /**
   * 开启热重载
   * yarn add webpack-node-externals run-script-webpack-plugin webpack
   * 注意：Webpack并不会自动将（例如 graphql 文件）复制到 dist 文件夹中。
   * 同理，Webpack 与全局静态路径（例如中的 entities 属性 TypeOrmModule ）不兼容。
   * 所以直接配置了 TypeOrmModule 中的 entities
   * 反过来再直接配置热重载会导致启动失败
   */
   if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
