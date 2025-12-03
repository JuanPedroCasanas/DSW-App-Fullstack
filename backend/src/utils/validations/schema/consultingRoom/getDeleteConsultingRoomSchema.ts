import { z } from "zod";
import { idConsultingRoom } from "../../schemaProps/params/idConsultingRoomParam";

export const getDeleteConsultingRoomSchema = z.object({
  params: z.object({
    idConsultingRoom
  })
});