import { z } from "zod";
import { idOccupation } from "../../schemaProps/params/idOccupationParam";

export const getDeleteOccupationSchema = z.object({
  params: z.object({
    idOccupation
  })
});