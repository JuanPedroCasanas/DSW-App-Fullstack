import { z } from "zod";


export const idPatient = z
    .string({ required_error: "Se requiere la id del paciente" })
    .min(1, "Se requiere la id del paciente")
    .regex(/^\d+$/, "La id del paciente debe ser numérica")
;