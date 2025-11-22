import { z } from "zod";

export const addConsultingRoomSchema = z.object({
  body: z.object({
    description: z
      .string({
        required_error: "Se requiere la descripcion del consultorio a crear, ej: Consultorio 1",
        invalid_type_error: "La descripcion del consultorio debe ser de tipo texto"
      })
  })
});