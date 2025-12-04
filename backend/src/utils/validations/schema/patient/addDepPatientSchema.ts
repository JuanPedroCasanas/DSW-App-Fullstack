import { z } from "zod";
import { birthdate, firstName, lastName } from "../../schemaProps/bodies/patientBody";
import { idLegalGuardian } from "../../schemaProps/bodies/legalGuardianBody";

export const addDepPatientSchema = z.object({
  body: z.object({
    firstName,
    lastName,
    birthdate,
    idLegalGuardian
  })
});
