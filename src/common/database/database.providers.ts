import { DataSource, DataSourceOptions } from 'typeorm';
// import { Page } from '@/page/page.mongo.entity';
// import { PageConfig } from '@/page/page-config/page-config.mongo.entity';

// 设置数据库类型
const databaseType: DataSourceOptions['type'] = 'mongodb';
import { getConfig } from 'src/utils/index'
const path = require('path');
const { MONGODB_CONFIG } = getConfig()

const MONGODB_DATABASE_CONFIG = {
  ...MONGODB_CONFIG,
  type: databaseType,
  entities: [path.join(__dirname, `../../**/*.${MONGODB_CONFIG.entities}.entity{.ts,.js}`)],
}

const MONGODB_CONNECTION = new DataSource(MONGODB_DATABASE_CONFIG)

// 数据库注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_CONNECTION',
    useFactory: async () => {
      await MONGODB_CONNECTION.initialize()
      return MONGODB_CONNECTION
    }
  }
];