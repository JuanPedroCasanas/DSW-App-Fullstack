import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Professional } from './Professional';
import { Patient } from './Patient';
import { HealthInsurance } from './HealthInsurance';
import { LegalGuardian } from './LegalGuardian';

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

  @ManyToOne(() => LegalGuardian, { nullable: true })
  legalGuardian?: LegalGuardian;

  @ManyToOne(() => HealthInsurance, { nullable: true })
  healthInsurance?: HealthInsurance;



  constructor(description: string, professional: Professional, patient: Patient, healthInsurance?: HealthInsurance, legalGuardian?: LegalGuardian) {
    this.description = description;
    this.professional = professional;
    this.patient = patient;
    this. healthInsurance = healthInsurance;
    this.legalGuardian = legalGuardian
  }
}
