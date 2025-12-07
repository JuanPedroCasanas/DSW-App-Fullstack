import {Professional, Patient, LegalGuardian} from '@/common/types';


export enum UserRole {
  Patient = "patient",
  LegalGuardian = "legalGuardian",
  Professional = "professional",
}

export type User = {
  id?: number;

  mail?: string;

  password?: string;  

  isActive?: boolean;

  role?: UserRole; // este probablemente desaparezca en cuanto tengamos roles

  professional?: Professional;

  patient?: Patient;

  legalGuardian?: LegalGuardian;
}