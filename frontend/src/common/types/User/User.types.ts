import {Professional, Patient, LegalGuardian} from '@/common/types';


export enum UserRole {
  Patient = "patient",
  LegalGuardian = "legalGuardian",
  Professional = "professional",
  Admin = "admin"
}

export type User = {
  id?: number;

  mail?: string;

  password?: string;  

  isActive?: boolean;

  role?: UserRole;

  professional?: Professional;

  patient?: Patient;

  legalGuardian?: LegalGuardian;
}