import { z } from "zod";
import { idConsultingRoom } from "../../schemaProps/params/idConsultingRoomParam";

export const getCurrentMonthModulesByConsultingRoomModuleSchema = z.object({
  params: z.object({
    idConsultingRoom
  })
});
