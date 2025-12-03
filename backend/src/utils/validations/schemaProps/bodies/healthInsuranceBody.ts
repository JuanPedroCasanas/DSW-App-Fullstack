import { z } from "zod";

export const idHealthInsurance = z
      .number({
        required_error: "Se requiere la id de la obra social a modificar",
        invalid_type_error: "La id de la obra social debe ser de tipo numerico"
      })
      .int() 
      .positive();
      
export const name = z
    .string({
        required_error: "Se requiere el nombre de la obra social a dar de alta",
        invalid_type_error: "El nombre de la obra social debe ser de tipo texto"
    });