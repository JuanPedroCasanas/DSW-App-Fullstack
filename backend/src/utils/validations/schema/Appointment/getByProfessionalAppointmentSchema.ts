import { z } from "zod";

export const getByProfessionalAppointmentSchema = z.object({
  params: z.object({
    idProfessional: z.string({ //Los params siempre se mandan como string
      required_error: "Se requiere el id del profesional"
    }).min(1, "Se requiere el id del profesional")
  })
});