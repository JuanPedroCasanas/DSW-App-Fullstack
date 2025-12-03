import { z } from "zod";
import { idModule } from "../../schemaProps/params/idModuleParam";

export const getModuleSchema = z.object({
  params: z.object({
    idModule
  })
});
