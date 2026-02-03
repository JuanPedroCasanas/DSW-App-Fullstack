import { it, expect } from 'vitest';
import { safeSerialize } from "../../src/utils/helpers/safeSerialize.ts"

it('oculta dependencias circulares cuando se serializa un User', () => {

  // Objeto que simula una entidad de MikroORM, con un metodo toJSON mockupeado
  const user: any = {
    toJSON: (options: any) => {
      return {
        mail: 'test@mail.com',
        hiddenApplied: options.hidden
      };
    }
  };

  // Ejecutamos el helper indicando que se va a popular "user"
  const result = safeSerialize(user, ['user']);

  // Verificamos que el JSON base se mantenga
  expect(result.mail).toBe('test@mail.com');

  // Verificamos que safeSerialize haya definido correctamente
  // las relaciones que deben ocultarse para evitar ciclos
  expect(result.hiddenApplied).toContain('user.patient');
  expect(result.hiddenApplied).toContain('user.professional');
  expect(result.hiddenApplied).toContain('user.legalGuardian');

  //En una operacion real, los resultados en hiddenApplied
  //se aplican como parametro hidden al metodo toJSON de una entiendad de mikroORM evitando la renderizacion de las mismas y por ende de las deps circulares
});
