import { z } from "zod";


export const idProfessional = z
  .number({
    required_error: "Se requiere id del profesional",
    invalid_type_error: "El id del profesional debe ser de tipo numerico"
})
.int()
.positive();

export const firstName = z
  .string({ 
    required_error: "Se requiere nombre del profesional",
    invalid_type_error: "El nombre del profesional debe ser de tipo texto"
  })
  .min(1, "Se requiere nombre del profesional");

export const lastName = z
  .string({ 
    required_error: "Se requiere apellido del profesional",
    invalid_type_error: "El apellido del profesional debe ser de tipo texto"
  })
  .min(1, "Se requiere apellido del profesional");


export const telephone = z
  .string({ 
    required_error: "Se requiere telefono del profesional",
    invalid_type_error: "El telefono del profesional debe ser de tipo texto"
  })
  .min(1, "Se requiere telefono del profesional");