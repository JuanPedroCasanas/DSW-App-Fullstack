import { z } from "zod";
import { idUser, newPassword, oldPassword } from "../../schemaProps/bodies/userBody";

export const updatePasswordSchema = z.object({
  body: z.object({
    idUser,
    oldPassword,
    newPassword
  })
});
