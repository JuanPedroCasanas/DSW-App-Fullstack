import { z } from "zod";


export const idLegalGuardian = z
    .string({ required_error: "Se requiere la id del responsable legal" })
    .min(1, "Se requiere la id del responsable legal")
    .regex(/^\d+$/, "La id del responsable legal debe ser numérica")
;