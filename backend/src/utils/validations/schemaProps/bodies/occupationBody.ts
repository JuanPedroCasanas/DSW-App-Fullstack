import { z } from "zod";

// Campo individual
export const idOccupation = z
    .number({
    required_error: "Se requiere el id de la especialidad a asignar",
    invalid_type_error: "El id de la especialidad debe ser de tipo numerico"
    })
    .int()
    .positive()

export const name = z
  .string({ 
    required_error: "Se requiere el nombre de la especialidad",
    invalid_type_error: "El nombre de la especialidad debe ser de tipo texto"
  })
  .min(1, "Se requiere el nombre de la especialidad");
