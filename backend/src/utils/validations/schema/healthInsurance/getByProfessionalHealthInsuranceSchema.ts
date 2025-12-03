import { z } from "zod";
import { idProfessional } from "../../schemaProps/params/idProfessionalParam";

export const getByProfessionalHealthInsuranceSchema = z.object({
  params: z.object({ idProfessional })
});