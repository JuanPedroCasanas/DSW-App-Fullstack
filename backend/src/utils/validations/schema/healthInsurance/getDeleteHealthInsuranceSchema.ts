import { z } from "zod";
import { idHealthInsurance } from "../../schemaProps/params/idHealthInsuranceParam";

export const getDeleteHealthInsuranceSchema = z.object({
  params: z.object({
    idHealthInsurance
  })
});