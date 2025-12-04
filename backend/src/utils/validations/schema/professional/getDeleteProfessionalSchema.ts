import { z } from "zod";
import { idProfessional } from "../../schemaProps/params/idProfessionalParam";

export const getDeleteProfessionalSchema = z.object({
  params: z.object({
    idProfessional
  })
});
