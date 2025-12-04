import { z } from "zod";
import { idProfessional } from "../../schemaProps/bodies/professionalBody";
import { idHealthInsurance } from "../../schemaProps/bodies/healthInsuranceBody";



export const allowForbidHealthInsuranceSchema = z.object({
  body: z.object({
    idProfessional,
    idHealthInsurance
  })
});
