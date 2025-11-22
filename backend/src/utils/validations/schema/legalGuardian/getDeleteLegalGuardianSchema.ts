import { z } from "zod";

export const getDeleteLegalGuardianSchema = z.object({
  params: z.object({
    idLegalGuardian: z
      .string({
        required_error: "Se requiere Id del responsable legal"
      })
      .min(1, "Se requiere Id del responsable legal")
  })
});
