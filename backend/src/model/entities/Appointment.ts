import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Professional } from './Professional';
import { Patient } from './Patient';
import { HealthInsurance } from './HealthInsurance';
import { LegalGuardian } from './LegalGuardian';
import { AppointmentStatus } from '../enums/AppointmentStatus';

@Entity()
export class Appointment {
  @PrimaryKey()
  id!: number;

  @Property()
  startTime!: Date;

  @Property() //Calculado, siempre será startTime + 1 hora
  endTime!: Date;

  @Enum(() => AppointmentStatus)
  status!: AppointmentStatus;

  @ManyToOne()
  professional!: Professional;

  @ManyToOne(() => Patient)
  patient!: Patient;

  @ManyToOne(() => LegalGuardian, { nullable: true })
  legalGuardian?: LegalGuardian;

  @ManyToOne(() => HealthInsurance, { nullable: true })
  healthInsurance?: HealthInsurance;



  constructor(startTime: Date, endTime: Date, professional: Professional, patient: Patient, status: AppointmentStatus, healthInsurance?: HealthInsurance, legalGuardian?: LegalGuardian) {
    this.startTime = startTime;
    this.endTime = endTime
    this.professional = professional;
    this.patient = patient;
    this. healthInsurance = healthInsurance;
    this.legalGuardian = legalGuardian
    this.status = status
  }
}
