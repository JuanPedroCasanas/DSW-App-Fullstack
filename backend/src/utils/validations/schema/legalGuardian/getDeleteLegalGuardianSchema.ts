import { z } from "zod";
import { idLegalGuardian } from "../../schemaProps/params/idLegalGuardianParam";

export const getDeleteLegalGuardianSchema = z.object({
  params: z.object({
    idLegalGuardian
  })
});
