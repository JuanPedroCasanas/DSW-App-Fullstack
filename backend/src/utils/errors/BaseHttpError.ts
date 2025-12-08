export class BaseHttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
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

export class InvalidParameterError extends BaseHttpError {
  constructor(parameter: string) {
    super(400, 'INVALID_PARAMETER', `El parametro '${parameter}' no es valido`);
  }
}

export class InvalidStatusChangeError extends BaseHttpError {
  constructor(entity: string, currentStatus: string, newStatus: string) {
    super(400, 'INVALID_STATUS_CHANGE', `El estado de ${entity} no puede pasar de ${currentStatus} a ${newStatus}`);
  }
}
export class NotFoundError extends BaseHttpError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `El recurso '${resource}' no pudo ser encontrado o se encuentra deshabilitado`);
  }
}

export class EntityAlreadyExistsError extends BaseHttpError {
    constructor(resource: string) {
    super(409, 'ENTITY_ALREADY_EXISTS', `El recurso '${resource}' ya fue agregado con anterioridad`);
  }
}

export class EntityDisabledError extends BaseHttpError {
  constructor(resource: string, id: string) {
    super(403, 'ENTITY_DISABLED', `El recurso '${resource}' de id '${id}' se encuentra deshabilitado`);
  }
}


export class ModuleScheduleConflictError extends BaseHttpError {
  constructor(startTime: string, endTime: string) {
    super(409, 'MODULE_SCHEDULE_CONFLICT', `Ya existe un modulo alquilado que conflitua con la hora inicio - fin: '${startTime} - ${endTime}'`);
  }
}

export class EmailAlreadyExistsError extends BaseHttpError {
  constructor(email: string) {
    super(409, 'EMAIL_TAKEN', `El email '${email}' ya se encuentra registrado con una cuenta activa`);
  }
}

export class InvalidEmailFormatError extends BaseHttpError {
  constructor(email: string) {
    super(400, 'INVALID_EMAIL', `'${email}' no es una direccion valida de email`);
  }
}

export class WeakPasswordError extends BaseHttpError {
  constructor(reason: string = 'La contraseña no es lo suficientemente segura') {
    super(400, 'WEAK_PASSWORD', reason);
  }
}

export class InvalidPasswordError extends BaseHttpError {
  constructor(reason: string = 'La contraseña ingresada no es valida') {
    super(401, 'INVALID_PASSWORD', reason);
  }
}

export class ExpiredTokenError extends BaseHttpError {
  constructor(reason: string = 'Refresh token expirado, por favor intente reingresar a su cuenta con usuario y contraseña') {
    super(401, 'EXPIRED_TOKEN', reason);
  }
}

export class InvalidTokenError extends BaseHttpError {
  constructor(reason: string = 'Refresh token inválido, por favor intente reingresar a su cuenta con usuario y contraseña') {
    super(401, 'INVALID_TOKEN', reason);
  }
}
export class NotConfiguredError extends BaseHttpError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `El recurso '${resource}' aún no posee valores configurados por un admin`);
  }
}

export class AppointmentNotAvailableError extends BaseHttpError {
  constructor(reason: string = 'El turno seleccionado no esta disponible') {
    super(409, 'APPOINTMENT_UNAVAILABLE', reason);
  }
}