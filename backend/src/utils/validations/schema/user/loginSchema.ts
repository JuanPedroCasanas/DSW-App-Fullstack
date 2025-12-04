import { z } from "zod";
import { mail, password } from "../../schemaProps/bodies/userBody";



export const loginSchema = z.object({
  body: z.object({
    mail,
    password
  })
});
