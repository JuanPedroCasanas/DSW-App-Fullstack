import { z } from "zod";
import { name } from "../../schemaProps/bodies/occupationBody";


export const addOccupationSchema = z.object({
  body: z.object({
    name,
  })
});