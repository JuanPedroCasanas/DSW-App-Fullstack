import { z } from "zod";
import { idOccupation, name } from "../../schemaProps/bodies/occupationBody";


export const updateOccupationSchema = z.object({
  body: z.object({
    idOccupation,
    name,
  })
});