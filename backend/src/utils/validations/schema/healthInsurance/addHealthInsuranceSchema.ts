import { z } from "zod";

export const addHealthInsuranceSchema = z.object({
  body: z.object({
    description: z
      .string({
        required_error: "Se requiere el nombre de la obra social a dar de alta",
        invalid_type_error: "El nombre de la obra social debe ser de tipo texto"
      })
  })
});