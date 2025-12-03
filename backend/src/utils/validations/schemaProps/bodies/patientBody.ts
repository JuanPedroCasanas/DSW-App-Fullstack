import { z } from "zod";


export const idPatient = z
      .number({
        required_error: "Se requiere el id del paciente a asignar",
        invalid_type_error: "El id del paciente debe ser de tipo numerico"
      })
      .int()
      .positive()