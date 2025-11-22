import { z } from "zod";

export const getModuleSchema = z.object({
  params: z.object({
    idModule: z
      .string({
        required_error: "Se requiere el id de modulo"
      })
      .min(1, "Se requiere el id de modulo")
  })
});
