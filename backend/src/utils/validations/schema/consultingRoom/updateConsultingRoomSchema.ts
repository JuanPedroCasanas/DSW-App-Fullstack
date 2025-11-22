import { z } from "zod";

export const updateConsultingRoomSchema = z.object({
  body: z.object({
      idConsultingRoom: z
      .number({
        required_error: "Se requiere la id del consultorio a modificar",
        invalid_type_error: "La id del consultorio debe ser de tipo numerico"
      })
      .int() 
      .positive(),

    description: z
      .string({
        required_error: "Se requiere la nueva descripcion del consultorio a modificar",
        invalid_type_error: "La descripcion del consultorio debe ser de tipo texto"
      })
  })
});