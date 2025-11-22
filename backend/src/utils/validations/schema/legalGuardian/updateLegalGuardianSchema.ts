import { z } from "zod";

export const updateLegalGuardianSchema = z.object({
  body: z.object({
    idLegalGuardian: z.number({
      required_error: "Se requiere id del responsable legal",
      invalid_type_error: "El id del responsable legal debe ser de tipo numerico"
    }),

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
        invalid_type_error: "La fecha de nacimiento del responsable legal debe ser de tipo texto"
      })
      .refine((value) => !isNaN(Date.parse(value)), {
        message: "La fecha de nacimiento debe ser una fecha válida"
      }),

    telephone: z.string({
      required_error: "Se requiere telefono del responsable legal",
      invalid_type_error: "El telefono del responsable legal debe ser de tipo texto"
    }),

    idHealthInsurance: z.number({
      required_error: "Se requiere obra social del responsable legal",
      invalid_type_error: "El id de la obra social del responsable legal debe ser de tipo numerico"
    })
  })
});
