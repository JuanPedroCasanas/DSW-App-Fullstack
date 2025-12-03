import { z } from "zod";

export const idOccupation = z
    .string({ required_error: "Se requiere la id de la especialidad" })
    .min(1, "Se requiere la id de la especialidad")
    .regex(/^\d+$/, "La id de la especialidad debe ser numérica")
;