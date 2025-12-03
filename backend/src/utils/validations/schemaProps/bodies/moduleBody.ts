import { z } from "zod";

// Campos individuales
export const day = z
  .number({ 
    required_error: "Se requiere especificar el día.",
    invalid_type_error: "El día debe ser de tipo numérico"
  })
  .min(1, "El día debe estar entre 1 (Lunes) y 6 (Sabado)")
  .max(6, "El día debe estar entre 1 (Lunes) y 6 (Sabado)")
  .int()
  .positive();

export const startTime = z
  .string({ 
    required_error: "Se requiere especificar la hora de inicio.",
    invalid_type_error: "La hora de inicio debe ser de tipo texto."
  })
  .min(1, "Se requiere especificar la hora de inicio.");

export const endTime = z
  .string({ 
    required_error: "Se requiere especificar la hora de fin.",
    invalid_type_error: "La hora de fin debe ser de tipo texto."
  })
  .min(1, "Se requiere especificar la hora de fin.");

export const validMonth = z
  .number({ 
    required_error: "Se requiere especificar el mes de validez para el/los módulo(s).",
    invalid_type_error: "El mes de validez debe ser de tipo numérico"
  })
  .min(1, "El mes debe estar entre 1 y 12.")
  .max(12, "El mes debe estar entre 1 y 12.")
  .int()
  .positive()


export const validYear = z
  .number({ 
    required_error: "Se requiere especificar el año de validez para el/los módulo(s).",
    invalid_type_error: "El año debe ser de tipo numérico"
  })
  .min(1, "Se requiere especificar el año.")
  .int()
  .positive();

