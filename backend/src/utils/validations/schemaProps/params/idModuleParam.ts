import { z } from "zod";

    
export const idModule = z
    .string({ required_error: "Se requiere la id del modulo" })
    .min(1, "Se requiere la id del modulo")
    .regex(/^\d+$/, "La id del modulo debe ser numérica");