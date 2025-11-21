import { z } from "zod";

export const assignAppointmentSchema = z.object({
  body: z.object({
    idAppointment: z
      .number({
        required_error: "Se requiere el id de turno a asignar",
        invalid_type_error: "El id de turno debe ser de tipo numerico"
      })
      .int()
      .positive(),

    idPatient: z
      .number({
        required_error: "Se requiere el id de paciente a asignar",
        invalid_type_error: "El id de paciente debe ser de tipo numerico"
      })
      .int()
      .positive()
  })
});