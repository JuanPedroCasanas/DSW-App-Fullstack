import { z } from "zod";
import { birthdate, firstName, idLegalGuardian, lastName, telephone } from "../../schemaProps/bodies/legalGuardianBody";
import { idHealthInsurance } from "../../schemaProps/bodies/healthInsuranceBody";

export const updateLegalGuardianSchema = z.object({
  body: z.object({
    idLegalGuardian,
    firstName,
    lastName,
    birthdate,
    telephone,
    idHealthInsurance,
  })
});
