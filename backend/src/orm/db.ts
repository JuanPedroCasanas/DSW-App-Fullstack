import { MikroORM } from '@mikro-orm/postgresql';
import 'dotenv/config';
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


      pool: {
        min: 0,
        max: 1,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 10000,
        reapIntervalMillis: 1000
      },
      schemaGenerator: { ignoreSchema: ['auth', 'storage', 'realtime', 'vault', 'cron'] }
    });
  } else {
    const conn = global.__ORM__.em.getConnection();
    try {
      await conn.execute('SELECT 1'); // verifica si la conexión sigue viva
    } catch {
      console.log('[ORM] Conexión cerrada, reconectando...');
      await global.__ORM__.connect();
    }
  }

  return global.__ORM__;
};

export const getORM = () => {
  if (!global.__ORM__) throw new Error('ORM not initialized!');
  return global.__ORM__;
};




export const syncSchema = async () => {
    const generator = getORM().getSchemaGenerator();
    
    await generator.dropSchema()
    await generator.createSchema()
    
    await generator.updateSchema()
}