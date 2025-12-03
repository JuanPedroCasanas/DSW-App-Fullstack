import { z } from "zod";
import { idPatient } from "../../schemaProps/params/idPatientParam";

export const getByPatientAppointmentSchema = z.object({
  params: z.object({
    idPatient
  })
});