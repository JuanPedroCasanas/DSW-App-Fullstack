import { z } from "zod";
import { idAppointment, status } from "../../schemaProps/bodies/appointmentBody";

export const updateStatusAppointmentSchema = z.object({
  body: z.object({
    idAppointment,
    status
  })
});