import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { User } from '../../src/model/entities/User';
import { Patient } from '../../src/model/entities/Patient';
import { HealthInsurance } from '../../src/model/entities/HealthInsurance';
import { UserService } from '../../src/services/UserService';
import { createUserData } from '../../src/utils/helpers/createUserData';
import { initORM, getORM } from '../../src/orm/db';

describe('UserService.login (integration)', () => {
  let mail: string | undefined;

  beforeAll(async () => {
    await initORM();
  });

  afterEach(async () => {
    if (!mail) return;
    const em = getORM().em.fork();
    await em.nativeDelete(User, { mail });
    mail = undefined;
  });

  afterAll(async () => {
    await getORM().close(true);
  });

  it('login exitoso devuelve userDto y accessToken', async () => {
    const em = getORM().em.fork();

    mail = `login_${Date.now()}@test.com`;
    const password = '123456';

    const user = await createUserData(mail, password);
    user.isActive = true;
    
    // Obtener una obra social existente de la base de datos
    const healthInsurance = await em.findOne(HealthInsurance, { isActive: true });
    if (!healthInsurance) {
      throw new Error('No hay obras sociales activas en la base de datos para el test');
    }
    
    const patient = new Patient('Test', 'User', new Date('2000-01-01'), healthInsurance);
    user.patient = patient;

    await em.persistAndFlush(user);

    const result = await UserService.login(mail, password);

    expect(result.userDto.mail).toBe(mail);
    expect(result.accessToken).toBeDefined();
  });
});
