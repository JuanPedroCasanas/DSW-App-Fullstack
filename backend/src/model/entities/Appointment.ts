import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Professional } from './Professional';
import { Patient } from './Patient';
import { HealthInsurance } from './HealthInsurance';
import { LegalGuardian } from './LegalGuardian';
import { AppointmentStatus } from '../enums/AppointmentStatus';
import { Module } from './Module';

@Entity()
export class Appointment {
  @PrimaryKey()
  id!: number;

  @Property({ columnType: 'timestamp without time zone' })
  startTime!: Date;

  @Property({ columnType: 'timestamp without time zone' }) //Calculado, siempre será startTime + 1 hora
  endTime!: Date;

  @Enum(() => AppointmentStatus)
  status!: AppointmentStatus;

  @ManyToOne()
  module!: Module

  @ManyToOne()
  professional!: Professional;

  @ManyToOne(() => Patient, { nullable: true })
  patient?: Patient;

  @ManyToOne(() => LegalGuardian, { nullable: true })
  legalGuardian?: LegalGuardian;

  @ManyToOne(() => HealthInsurance, { nullable: true })
  healthInsurance?: HealthInsurance;



  constructor(module: Module, startTime: Date, endTime: Date, professional: Professional, status: AppointmentStatus, healthInsurance?: HealthInsurance, patient?: Patient, legalGuardian?: LegalGuardian) {
    this.module = module;
    this.startTime = startTime;
    this.endTime = endTime
    this.professional = professional;
    this.patient = patient;
    this. healthInsurance = healthInsurance;
    this.legalGuardian = legalGuardian
    this.status = status
  }
}
