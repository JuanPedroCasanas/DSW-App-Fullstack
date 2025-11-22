import { z } from "zod";

export const getByProfessionalHealthInsuranceSchema = z.object({
  params: z.object({
    idProfessional: z
      .string({
        required_error: "Se requiere la id del profesional"
      }).min(1, "Se requiere la id del profesional")
  })
});