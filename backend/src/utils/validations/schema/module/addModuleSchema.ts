import { z } from "zod";

export const addModuleSchema = z.object({
  body: z.object({
    day: z
      .string({
        required_error: "Se requiere especificar el día.",
        invalid_type_error: "El día debe ser de tipo texto."
      })
      .min(1, "Se requiere especificar el día."),

    startTime: z
      .string({
        required_error: "Se requiere especificar la hora de inicio.",
        invalid_type_error: "La hora de inicio debe ser de tipo texto."
      })
      .min(1, "Se requiere especificar la hora de inicio."),

    endTime: z
      .string({
        required_error: "Se requiere especificar la hora de fin.",
        invalid_type_error: "La hora de fin debe ser de tipo texto."
      })
      .min(1, "Se requiere especificar la hora de fin."),

    validMonth: z
      .number({
        required_error: "Se requiere especificar el mes de validez para el/los módulo(s).",
        invalid_type_error: "El mes de validez debe ser numérico."
      })
      .int()
      .min(1, "El mes debe estar entre 1 y 12.")
      .max(12, "El mes debe estar entre 1 y 12."),

    validYear: z
      .number({
        required_error: "Se requiere especificar el año de validez para el/los módulo(s).",
        invalid_type_error: "El año de validez debe ser numérico."
      })
      .int(),

    idProfessional: z
      .number({
        required_error: "Se requiere el ID del profesional asignado al/los módulo(s).",
        invalid_type_error: "El ID del profesional debe ser numérico."
      })
      .int(),

    idConsultingRoom: z
      .number({
        required_error: "Se requiere el ID del consultorio asignado al/los módulo(s).",
        invalid_type_error: "El ID del consultorio debe ser numérico."
      })
      .int()
  })
});
