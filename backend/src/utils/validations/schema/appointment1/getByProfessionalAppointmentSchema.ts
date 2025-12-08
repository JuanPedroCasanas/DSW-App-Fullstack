import { z } from "zod";
import { idProfessional } from "../../schemaProps/params/idProfessionalParam";

export const getByProfessionalAppointmentSchema = z.object({
  params: z.object({
    idProfessional
  })
});