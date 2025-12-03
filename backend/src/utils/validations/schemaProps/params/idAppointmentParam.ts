import { z } from "zod";


export const idAppointment = z
    .string({ required_error: "Se requiere la id del turno" })
    .min(1, "Se requiere la id del turno")
    .regex(/^\d+$/, "La id del turno debe ser numérica")
;