import { z } from "zod";


export const idHealthInsurance = z
    .string({ required_error: "Se requiere la id de la obra social" })
    .min(1, "Se requiere la id de la obra social")
    .regex(/^\d+$/, "La id de la obra social debe ser numérica")
;