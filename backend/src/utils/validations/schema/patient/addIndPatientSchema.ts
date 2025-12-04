import { z } from "zod";
import { birthdate, firstName, lastName, telephone } from "../../schemaProps/bodies/patientBody";
import { mail, password } from "../../schemaProps/bodies/userBody";
import { idHealthInsurance } from "../../schemaProps/bodies/healthInsuranceBody";


export const addIndPatientSchema = z.object({
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
