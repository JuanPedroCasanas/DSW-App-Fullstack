import { z } from "zod";
import { firstName, idProfessional, lastName, telephone } from "../../schemaProps/bodies/professionalBody";



export const updateProfessionalSchema = z.object({
  body: z.object({
    idProfessional,
    firstName,
    lastName,
    telephone
  })
});
