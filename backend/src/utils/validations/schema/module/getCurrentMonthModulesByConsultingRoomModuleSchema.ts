import { z } from "zod";

export const getCurrentMonthModulesByConsultingRoomModuleSchema = z.object({
  params: z.object({
    idConsultingRoom: z
      .string({
        required_error: "Se requiere el id de consultorio"
      })
      .min(1, "Se requiere el id de consultorio")
  })
});
