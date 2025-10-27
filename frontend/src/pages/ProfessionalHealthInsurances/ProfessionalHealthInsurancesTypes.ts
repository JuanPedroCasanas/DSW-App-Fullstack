export type HealthInsurance = {
  id: number;
  name: string;
}

export type Professional = {
  id: number;
  firstName: string;
  lastName: string;
  healthInsurances: HealthInsurance[];
};