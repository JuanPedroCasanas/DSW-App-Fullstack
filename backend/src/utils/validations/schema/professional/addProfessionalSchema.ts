import { z } from "zod";
import { idOccupation } from "../../schemaProps/bodies/occupationBody";
import { firstName, lastName, telephone } from "../../schemaProps/bodies/professionalBody";
import { mail, password } from "../../schemaProps/bodies/userBody";



export const addProfessionalSchema = z.object({
  body: z.object({
    firstName,
    lastName,
    telephone,
    mail,
    password,
    idOccupation
  })
});
