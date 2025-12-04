import { z } from "zod";

export const idPatient = z
      .number({
        required_error: "Se requiere el id del paciente a asignar",
        invalid_type_error: "El id del paciente debe ser de tipo numerico"
      })
      .int()
      .positive()

export const firstName = z
  .string({ 
    required_error: "Se requiere nombre del paciente",
    invalid_type_error: "El nombre del paciente debe ser de tipo texto"
  })
  .min(1, "Se requiere nombre del paciente");

export const lastName = z
  .string({ 
    required_error: "Se requiere apellido del paciente",
    invalid_type_error: "El apellido del paciente debe ser de tipo texto"
  })
  .min(1, "Se requiere apellido del paciente");

export const birthdate = z
  .string({ 
    required_error: "Se requiere fecha de nacimiento del paciente",
    invalid_type_error: "La fecha de nacimiento del paciente debe ser de tipo texto"
  })
  .refine((value) => !isNaN(Date.parse(value)), {
    message: "La fecha de nacimiento debe ser una fecha válida"
  });

export const telephone = z
  .string({ 
    required_error: "Se requiere telefono del paciente",
    invalid_type_error: "El telefono del paciente debe ser de tipo texto"
  })
  .min(1, "Se requiere telefono del paciente");