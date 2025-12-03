import { z } from "zod";

export const description = z
    .string({
    required_error: "Se requiere la descripcion del consultorio, ej: Consultorio 1",
    invalid_type_error: "La descripcion del consultorio debe ser de tipo texto"
    });

    export const idConsultingRoom = z
    .number({
    required_error: "Se requiere la id del consultorio a modificar",
    invalid_type_error: "La id del consultorio debe ser de tipo numerico"
    })
    .int() 
    .positive();