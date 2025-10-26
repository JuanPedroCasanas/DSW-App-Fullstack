export type Occupation = {
  id: number;
  name: string 
};

export type HealthInsurance = {
  id: number;
  name: string;
  isActive: boolean;
};

export type LegalGuardian = {
  id: number;
  firstName: string;
  lastName: string;
  birthdate: string;
  telephone: string;
  user: number;
  healthInsurance: number;
  isActive?: boolean;
}

export type Professional = {
  id: number;
  firstName: string;
  lastName: string;
  occupation: Occupation; // ID de especialidad (string por ahora)
  telephone?: string;
  isActive: boolean;
};

export enum UserRole {
  Patient = "patient",
  LegalGuardian = "legalGuardian",
  Professional = "professional",
}

export type Patient = {
  id?: number;
  firstName: string;
  lastName: string;
  telephone: string;
  healthInsurance: number;
  /**yyyy/mm/dd */
  birthdate: string;
  isActive?: boolean;
};

export type User = {
  id: number;

  mail: string;

  password: string;

  isActive: boolean;

  role: UserRole;


  professional?: Professional;


  patient?: Patient;

  legalGuardian?: LegalGuardian;
}
  
  