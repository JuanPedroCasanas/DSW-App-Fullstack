import { MikroORM } from '@mikro-orm/postgresql';
import { User } from '../../src/model/entities/User';

let orm: MikroORM | undefined;

export const initTestORM = async () => {
  if (!orm) {
    orm = await MikroORM.init({
      entities: [User],
      dbName: 'postgres',
      clientUrl: process.env.DATABASE_URL, // tu DB de test
      debug: false,
      allowGlobalContext: true,
    });
  }
  return orm;
};

export const getTestORM = () => {
  if (!orm) throw new Error('Test ORM not initialized');
  return orm;
};

export const closeTestORM = async () => {
  if (orm) {
    await orm.close(true);
    orm = undefined;
  }
};
