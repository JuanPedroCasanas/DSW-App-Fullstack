import { z } from "zod";

export const getDeleteConsultingRoomSchema = z.object({
  params: z.object({
    idConsultingRoom: z
      .string({
        required_error: "Se requiere la id del consultorio"
      }).min(1, "Se requiere la id del consultorio")
  })
});