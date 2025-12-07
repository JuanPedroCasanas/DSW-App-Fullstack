import { Occupation } from "@/common/types";

export type Professional = {
  id: number;
  firstName: string;
  lastName: string;
  occupation: Occupation; // ID de especialidad (string por ahora)
  telephone?: string;
  isActive: boolean;
};