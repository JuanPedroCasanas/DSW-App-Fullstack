import { z } from "zod";

//No modularice aca porque es la unica instancia en la que se valida una cookie con refresh token
export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z
      .string({ 
        required_error: "Se requiere refresh token",
        invalid_type_error: "El refresh token debe ser texto"
      })
      .min(1, "No se encontró refresh token. Por favor loguearse nuevamente")
  })
});