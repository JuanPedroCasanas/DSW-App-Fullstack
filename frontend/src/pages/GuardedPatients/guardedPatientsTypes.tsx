export type Patient = {
  id?: number;
  firstName: string;
  lastName: string;
  /**yyyy/mm/dd */
  birthdate: string;
  isActive?: boolean;
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