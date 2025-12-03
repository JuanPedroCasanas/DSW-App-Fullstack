import { z } from "zod";


export const idProfessional = z
  .number({
    required_error: "Se requiere id del profesional",
    invalid_type_error: "El id del profesional debe ser de tipo numerico"
})
.int()
.positive();
