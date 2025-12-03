import { z } from "zod";

    
export const idConsultingRoom = z
    .string({ required_error: "Se requiere la id del consultorio" })
    .min(1, "Se requiere la id del consultorio")
    .regex(/^\d+$/, "La id del consultorio debe ser numérica");