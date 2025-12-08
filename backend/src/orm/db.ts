import { MikroORM } from '@mikro-orm/postgresql';
import path from 'path';

declare global {
  var __ORM__: MikroORM | undefined;
}

export const initORM = async () => {
  if (!global.__ORM__) {
    global.__ORM__ = await MikroORM.init({
      baseDir: path.resolve(__dirname, '..'),
      entities: ['./model/entities'],
      entitiesTs: ['./model/entities'],
      dbName: 'postgres',
      clientUrl: process.env.DATABASE_URL,
      debug: true,
      pool: { min: 0, max: 1, idleTimeoutMillis: 30000 }, // << importante: max 1 en serverless
      schemaGenerator: { ignoreSchema: ['auth', 'storage', 'realtime', 'vault'] },
    });
  }
  return global.__ORM__;
};

export const getORM = () => {
  if (!global.__ORM__) throw new Error('ORM not initialized!');
  return global.__ORM__;
};
