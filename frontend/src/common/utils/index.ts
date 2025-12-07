//exports de handle responses para comodidad

// el genérico
export * from './HandleResponse/HandleErrorResponse';

// el archivo y la funcion estan con H mayuscula
// somehow acá está con h minuscula y funciona??? si lo pongo en mayuscula tira error??? no lo logré arreglar
export * from './HandleResponse/HandleOccupationControllerResponse';

// consultorios
export * from './HandleResponse/HandleConsultingRoomControllerResponse';

// modulos
export * from './HandleResponse/HandleModuleControllerResponse';

// responsable legal
export * from './HandleResponse/HandleLegalGuardianControllerResponse';

// tipo de modulo
export * from './HandleResponse/HandleModuleTypeControllerResponse';

// paciente
export * from './HandleResponse/HandlePatientControllerResponse';

// profesional
export * from './HandleResponse/HandleProfessionalControllerResponse';

// user
export * from './HandleResponse/HandleUserControllerResponse';

// turnos
export * from './HandleResponse/HandleAppointmentControllerResponse';

// obra sociale
export * from './HandleResponse/HandleHealthInsuranceControllerResponse';