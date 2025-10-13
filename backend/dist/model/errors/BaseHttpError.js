"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentNotAvailableError = exports.NotConfigured = exports.WeakPasswordError = exports.InvalidEmailFormatError = exports.EmailAlreadyExistsError = exports.ModuleScheduleConflictError = exports.NotFoundError = exports.BaseHttpError = void 0;
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
class ModuleScheduleConflictError extends BaseHttpError {
    constructor(startTime, endTime) {
        super(409, 'MODULE_SCHEDULE_CONFLICT', `Ya existe un modulo alquilado que conflitua con la hora inicio - fin: '${startTime} - ${endTime}'`);
    }
}
exports.ModuleScheduleConflictError = ModuleScheduleConflictError;
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
class NotConfigured extends BaseHttpError {
    constructor(resource) {
        super(404, 'NOT_FOUND', `El recurso '${resource}' aún no posee valores configurados por un admin`);
    }
}
exports.NotConfigured = NotConfigured;
class AppointmentNotAvailableError extends BaseHttpError {
    constructor(reason = 'El turno seleccionado no esta disponible') {
        super(409, 'APPOINTMENT_UNAVAILABLE', reason);
    }
}
exports.AppointmentNotAvailableError = AppointmentNotAvailableError;
//# sourceMappingURL=BaseHttpError.js.map