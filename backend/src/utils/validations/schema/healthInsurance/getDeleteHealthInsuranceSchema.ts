import { z } from "zod";

export const getDeleteHealthInsuranceSchema = z.object({
  params: z.object({
    idHealthInsurance: z
      .string({
        required_error: "Se requiere la id de la obra social"
      }).min(1, "Se requiere la id de la obra social")
  })
});