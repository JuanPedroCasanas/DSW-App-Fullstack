import { z } from "zod";
import { idPatient } from "../../schemaProps/params/idPatientParam";

export const getDeletePatientSchema = z.object({
  params: z.object({
    idPatient
  })
});
