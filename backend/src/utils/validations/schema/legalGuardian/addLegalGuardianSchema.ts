import { z } from "zod";

export const addLegalGuardianSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: "Se requiere nombre del responsable legal",
      invalid_type_error: "El nombre del responsable legal debe ser de tipo texto"
    }),
    lastName: z.string({
      required_error: "Se requiere apellido del responsable legal",
      invalid_type_error: "El apellido del responsable legal debe ser de tipo texto"
    }),
    birthdate: z
    .string({
        required_error: "Se requiere fecha de nacimiento del responsable legal",
        invalid_type_error: "La fecha de nacimiento del responsable legal debe  ser de tipo texto texto"
    })
    .refine((value) => !isNaN(Date.parse(value)), {
        message: "La fecha de nacimiento debe ser una fecha válida"
    }),
    telephone: z.string({
      required_error: "Se requiere telefono del responsable legal",
      invalid_type_error: "El telefono del responsable legal debe ser de tipo texto"
    }),
    mail: z.string({
      required_error: "Se requiere email del responsable legal",
      invalid_type_error: "El email del responsable legal debe ser de tipo texto"
    }),
    password: z.string({
      required_error: "Se requiere contraseña de la cuenta del responsable legal",
      invalid_type_error: "La contraseña del responsable legal debe ser de tipo texto"
    }),
    idHealthInsurance: z.number({
      required_error: "Se requiere obra social del responsable legal",
      invalid_type_error: "El id de la obra social del responsable legal debe ser de tipo numerico"
    })
  })
});
