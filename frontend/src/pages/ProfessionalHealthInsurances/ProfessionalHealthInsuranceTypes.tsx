/** Modelo simple: viene del backend */
export type HealthInsurance={
  id:number;
  name:string;
 };
export type Professional ={
  id: number;
  firstName: string;
  lastName: string;
  occupation: Occupation; 
  telephone?: string;
  isActive: boolean;
  healthInsurances: HealthInsurance[];
  
 }
export  type Occupation = {
  id:string;
  name: string;
 }