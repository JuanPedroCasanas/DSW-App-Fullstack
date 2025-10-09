"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeakPasswordError = exports.InvalidEmailFormatError = exports.EmailAlreadyExistsError = exports.NotFoundError = exports.BaseHttpError = void 0;
class BaseHttpError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code; // machine-readable (e.g., 'EMAIL_TAKEN')
        this.name = this.constructor.name;
    }
    toJSON() {
        return {
            error: this.name,
            code: this.code,
            message: this.message,
        };
    }
}
exports.BaseHttpError = BaseHttpError;
class NotFoundError extends BaseHttpError {
    constructor(resource) {
        super(404, 'NOT_FOUND', `El recurso '${resource}' no pudo ser encontrado`);
    }
}
exports.NotFoundError = NotFoundError;
class EmailAlreadyExistsError extends BaseHttpError {
    constructor(email) {
        super(409, 'EMAIL_TAKEN', `El email '${email}' ya se encuentra registrado con una cuenta activa`);
    }
}
exports.EmailAlreadyExistsError = EmailAlreadyExistsError;
class InvalidEmailFormatError extends BaseHttpError {
    constructor(email) {
        super(400, 'INVALID_EMAIL', `'${email}' no es una direccion valida de email`);
    }
}
exports.InvalidEmailFormatError = InvalidEmailFormatError;
class WeakPasswordError extends BaseHttpError {
    constructor(reason = 'La contraseña no es lo suficientemente segura') {
        super(400, 'WEAK_PASSWORD', reason);
    }
}
exports.WeakPasswordError = WeakPasswordError;
//# sourceMappingURL=BaseHttpError.js.map