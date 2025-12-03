import { z } from "zod";


export const idAppointment = z
      .number({
        required_error: "Se requiere la id del consultorio a modificar",
        invalid_type_error: "La id del consultorio debe ser de tipo numerico"
      })
      .int() 
      .positive();