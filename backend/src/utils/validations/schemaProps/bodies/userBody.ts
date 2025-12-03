import { z } from "zod";


export const mail = z
  .string({ 
    required_error: "Se requiere email del usuario a registrar",
    invalid_type_error: "El email del usuario a registrar debe ser de tipo texto"
  })
  .email("El email del usuario a registrar debe ser válido");

export const password = z
  .string({ 
    required_error: "Se requiere contraseña de la cuenta del usuario a registrar",
    invalid_type_error: "La contraseña del usuario a registrar debe ser de tipo texto"
  })
  .min(1, "Se requiere contraseña del usuario a registrar");