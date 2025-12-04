import { z } from "zod";
import { idLegalGuardian } from "../../schemaProps/params/idLegalGuardianParam";

export const getByLegalGuardianPatientSchema = z.object({
  params: z.object({
    idLegalGuardian
  })
});
