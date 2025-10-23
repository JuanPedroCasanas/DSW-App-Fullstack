/** Modelo simple: viene del backend */
export type Occupation = {
  id: number;
  name: string 
};

export type Professional = {
  id: string;
  firstName: string;
  lastName: string;
  occupation: Occupation; // ID de especialidad (string por ahora)
  telephone?: string;
  isActive: boolean;
};