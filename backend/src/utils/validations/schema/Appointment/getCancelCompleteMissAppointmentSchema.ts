import { z } from "zod";
import { idAppointment } from "../../schemaProps/params/idAppointmentParam";

export const getCancelCompleteMissAppointmentSchema = z.object({
  params: z.object({
    idAppointment
  })
});