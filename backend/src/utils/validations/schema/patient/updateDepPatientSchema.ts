import { z } from "zod";
import { birthdate, firstName, idPatient, lastName } from "../../schemaProps/bodies/patientBody";

export const updateDepPatientSchema = z.object({
  body: z.object({
    idPatient,
    firstName,
    lastName,
    birthdate
  })
});
