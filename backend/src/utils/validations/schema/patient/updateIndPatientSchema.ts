import { z } from "zod";
import { birthdate, firstName, idPatient, lastName, telephone } from "../../schemaProps/bodies/patientBody";
import { idHealthInsurance } from "../../schemaProps/bodies/healthInsuranceBody";


export const updateIndPatientSchema = z.object({
  body: z.object({
    idPatient,
    firstName,
    lastName,
    birthdate,
    telephone,
    idHealthInsurance
  })
});
