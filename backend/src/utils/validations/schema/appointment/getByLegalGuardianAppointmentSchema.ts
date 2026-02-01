import { z } from "zod";
import { idLegalGuardian } from "../../schemaProps/params/idLegalGuardianParam";

export const getByLegalGuardianAppointmentSchema = z.object({
  params: z.object({
    idLegalGuardian
  })
});