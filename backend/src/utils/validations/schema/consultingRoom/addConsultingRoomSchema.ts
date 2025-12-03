import { z } from "zod";
import { description } from "../../schemaProps/bodies/consultingRoomBody";

export const addConsultingRoomSchema = z.object({
  body: z.object({
    description
  })
});