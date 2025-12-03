import { z } from "zod";
import { idHealthInsurance, name } from "../../schemaProps/bodies/healthInsuranceBody";

export const updateHealthInsuranceSchema = z.object({
  body: z.object({
      idHealthInsurance,
      name
  })
});