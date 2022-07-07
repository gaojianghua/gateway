import { CacheModule, Module } from '@nestjs/common';
import { PageModule } from '@/modules/page/page.module';
import { AuthModule } from './auth/auth.module';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfig } from './utils';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as redisStore from 'cache-manager-redis-store';
/**
 * @nestjs/config 默认会从项目根目录载入并解析一个 .env 文件
 * 从 .env 文件和 process.env 合并环境变量键值对
 * 并将结果存储到一个可以通过 ConfigService 访问的私有结构。
 * forRoot() 方法注册了 ConfigService 提供者
 * 后者提供了一个 get() 方法来读取这些解析/合并的配置变量。
 */

@Module({
  /**
   * ignoreEnvFile，禁用默认读取 .env 的规则
   */
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: getConfig('REDIS_CONFIG').host,
      port: getConfig('REDIS_CONFIG').port,
      auth_pass: getConfig('REDIS_CONFIG').auth,
      db: getConfig('REDIS_CONFIG').db
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,  //全局注册
      load: [getConfig]
    }),
    AuthModule,
    PageModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ]
})
export class AppModule { }
