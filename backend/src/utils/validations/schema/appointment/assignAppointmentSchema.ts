import { z } from "zod";
import { idAppointment } from "../../schemaProps/bodies/appointmentBody";
import { idPatient } from "../../schemaProps/bodies/patientBody";

export const assignAppointmentSchema = z.object({
  body: z.object({
    idAppointment,
    idPatient
  })
});