import { z } from "zod";
import { idOccupation } from "../../schemaProps/params/idOccupationParam";

export const getProfessionalsByOccupationSchema = z.object({
  params: z.object({
    idOccupation
  })
});
