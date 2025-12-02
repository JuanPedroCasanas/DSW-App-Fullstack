import { z } from "zod";

export const updateHealthInsuranceSchema = z.object({
  body: z.object({
      idHealthInsurance: z
      .number({
        required_error: "Se requiere la id de la obra social a modificar",
        invalid_type_error: "La id de la obra social debe ser de tipo numerico"
      })
      .int() 
      .positive(),

    name: z
      .string({
        required_error: "Se requiere el nuevo nombre de la obra social a modificar",
        invalid_type_error: "La descripcion de la obra social debe ser de tipo texto"
      })
  })
});