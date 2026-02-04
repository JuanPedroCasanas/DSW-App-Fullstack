import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { User } from '../../src/model/entities/User';
import { UserService } from '../../src/services/UserService';
import { createUserData } from '../../src/utils/helpers/createUserData';
import { initTestORM, getTestORM, closeTestORM } from '../utils/testOrm';

describe('UserService.login (integration)', () => {
  let mail: string | undefined;

  beforeAll(async () => {
    await initTestORM(); // inicializa solo el ORM de test
  });

  afterEach(async () => {
    if (!mail) return;
    const em = getTestORM().em.fork(); // uso directo del test ORM
    await em.nativeDelete(User, { mail });
    mail = undefined;
  });

  afterAll(async () => {
    await closeTestORM(); // cierra solo el ORM de test
  });

  it('login exitoso devuelve userDto y accessToken', async () => {
    const em = getTestORM().em.fork(); // directo del test ORM

    mail = `login_${Date.now()}@test.com`;
    const password = '123456';

    const user = await createUserData(mail, password);
    user.isActive = true;

    await em.persistAndFlush(user);

    const result = await UserService.login(mail, password);

    expect(result.userDto.mail).toBe(mail);
    expect(result.accessToken).toBeDefined();
  });
});
