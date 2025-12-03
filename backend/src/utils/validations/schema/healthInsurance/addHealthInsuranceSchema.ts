import { z } from "zod";
import { name } from "../../schemaProps/bodies/healthInsuranceBody";

export const addHealthInsuranceSchema = z.object({
  body: z.object({
      name
  })
});