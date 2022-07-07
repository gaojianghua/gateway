import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from '@/utils';
import { UserModule } from './modules';
import { FeishuService } from '@/helper/feishu/feishu.service';
import { FeishuController } from '@/helper/feishu/feishu.controller';
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
    ConfigModule.forRoot({ 
      ignoreEnvFile: true,
      isGlobal: true,  //全局注册
      load: [getConfig]
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    UserModule
  ],
  controllers: [
    FeishuController
  ],
  providers: [FeishuService],
})
export class AppModule { }
