import { z } from "zod";
import { description, idConsultingRoom } from "../../schemaProps/bodies/consultingRoomBody";


export const updateConsultingRoomSchema = z.object({
  body: z.object({
      idConsultingRoom,
      description
  })
});