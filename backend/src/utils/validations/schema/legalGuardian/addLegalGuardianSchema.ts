import { z } from "zod";
import { birthdate, firstName, lastName, telephone } from "../../schemaProps/bodies/legalGuardianBody";
import { idHealthInsurance } from "../../schemaProps/bodies/healthInsuranceBody";
import { mail, password } from "../../schemaProps/bodies/userBody";

export const addLegalGuardianSchema = z.object({
  body: z.object({
    firstName,
    lastName,
    birthdate,
    telephone,
    mail,
    password,
    idHealthInsurance,
  })
});
