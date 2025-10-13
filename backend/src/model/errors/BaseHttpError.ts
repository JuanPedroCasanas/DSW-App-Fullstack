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

export class NotFoundError extends BaseHttpError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `El recurso '${resource}' no pudo ser encontrado`);
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

export class NotConfigured extends BaseHttpError {
  constructor(resource: string) {
    super(404, 'NOT_FOUND', `El recurso '${resource}' aún no posee valores configurados por un admin`);
  }
}

export class AppointmentNotAvailableError extends BaseHttpError {
  constructor(reason: string = 'El turno seleccionado no esta disponible') {
    super(409, 'APPOINTMENT_UNAVAILABLE', reason);
  }
}