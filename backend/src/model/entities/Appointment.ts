import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Professional } from './Professional';
import { Patient } from './Patient';
import { HealthInsurance } from './HealthInsurance';

@Entity()
export class Appointment {
  @PrimaryKey()
  id!: number;

  @Property()
  description!: string;

  @ManyToOne()
  professional!: Professional;

  @ManyToOne(() => Patient)
  patient!: Patient;


  @ManyToOne(() => HealthInsurance, { nullable: true })
  healthInsurance?: HealthInsurance;



  constructor(description: string) {
    this.description = description;
  }
}
