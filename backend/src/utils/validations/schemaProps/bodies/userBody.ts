import { z } from "zod";

export const idUser = z
      .number({
        required_error: "Se requiere el id del usuario",
        invalid_type_error: "El id del usuario debe ser de tipo numerico"
      })
      .int()
      .positive()

export const mail = z
  .string({ 
    required_error: "Se requiere el email del usuario",
    invalid_type_error: "El email del usuario debe ser de tipo texto"
  })
  .email("El email del usuario debe ser válido");

export const password = z
  .string({ 
    required_error: "Se requiere la contraseña del usuario",
    invalid_type_error: "La contraseña del usuario debe ser de tipo texto"
  })
  .min(1, "Se requiere contraseña del usuario");

export const oldPassword = z
  .string({ 
    required_error: "Se requiere la contraseña actual de la cuenta del usuario",
    invalid_type_error: "La contraseña actual del usuario debe ser de tipo texto"
  })
  .min(1, "Se requiere la contraseña actual de la cuenta del usuario");

export const newPassword = z
  .string({ 
    required_error: "Se requiere la nueva contraseña de la cuenta del usuario",
    invalid_type_error: "La nueva contraseña del usuario debe ser de tipo texto"
  })
  .min(1, "Se requiere la nueva contraseña de la cuenta del usuario");