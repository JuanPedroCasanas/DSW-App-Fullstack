export type Patient = {
  id?: number;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  healthInsurance?: number;
  /**yyyy/mm/dd */
  birthdate?: string;
  isActive?: boolean;
};