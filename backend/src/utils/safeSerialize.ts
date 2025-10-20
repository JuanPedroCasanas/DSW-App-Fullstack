
//El proposito de esta función es esconder las dependencias circulares de la clase User
//Ya que como mikroorm automaticamente puebla las relaciones Uno a Uno se generan loops circulares al
//Enviar el .json al front, lo que tilda el backend
import { AnyEntity } from '@mikro-orm/core';

export function safeSerialize(entityOrArray: AnyEntity | AnyEntity[], populate: string[] = []): any {
  
  //Si mandamos un arreglo, iterar la funcion sobre todos los elementos del arreglo y finalmente devolver el arreglo
    if (Array.isArray(entityOrArray)) {
        return entityOrArray.map(e => safeSerialize(e, populate));
    }

  const hidden: string[] = [];

  //Escondemos las dependencias circulares
  if (populate.includes('user')) {
    hidden.push('user.professional', 'user.patient', 'user.legalGuardian');
    }

  return entityOrArray.toJSON({ populate, hidden });
}