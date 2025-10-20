"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeSerialize = void 0;
function safeSerialize(entityOrArray, populate = []) {
    //Si mandamos un arreglo, iterar la funcion sobre todos los elementos del arreglo y finalmente devolver el arreglo
    if (Array.isArray(entityOrArray)) {
        return entityOrArray.map(e => safeSerialize(e, populate));
    }
    const hidden = [];
    //Escondemos las dependencias circulares
    if (populate.includes('user')) {
        hidden.push('user.professional', 'user.patient', 'user.legalGuardian');
    }
    return entityOrArray.toJSON({ populate, hidden });
}
exports.safeSerialize = safeSerialize;
//# sourceMappingURL=safeSerialize.js.map