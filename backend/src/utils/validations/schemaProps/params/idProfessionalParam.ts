import { z } from "zod";


export const idProfessional = z
    .string({ required_error: "Se requiere la id del profesional" })
    .min(1, "Se requiere la id del profesional")
    .regex(/^\d+$/, "La id del profesional debe ser numérica")
;