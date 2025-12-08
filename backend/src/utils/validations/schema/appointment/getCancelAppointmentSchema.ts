import { z } from "zod";
import { idAppointment } from "../../schemaProps/params/idAppointmentParam";

export const getCancelAppointmentSchema = z.object({
  params: z.object({
    idAppointment
  })
});