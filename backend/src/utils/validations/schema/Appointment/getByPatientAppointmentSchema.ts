import { z } from "zod";

export const getByPatientAppointmentSchema = z.object({
  params: z.object({
    idPatient: z.string({ //Los params siempre se mandan como string
      required_error: "Se requiere el id del paciente"
    }).min(1, "Se requiere el id del paciente")
  })
});