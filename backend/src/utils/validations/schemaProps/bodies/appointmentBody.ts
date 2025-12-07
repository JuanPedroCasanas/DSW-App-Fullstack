import { z } from "zod";


export const idAppointment = z
      .number({
        required_error: "Se requiere la id del consultorio",
        invalid_type_error: "La id del consultorio debe ser de tipo numerico"
      })
      .int() 
      .positive();

export const status = z
      .string({
        required_error: "Se requiere el estado del turno",
        invalid_type_error: "El estado del turno debe ser de tipo string"
      })