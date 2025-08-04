import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Appointment } from './Appointment';


@Entity()
export class Persona {
  @PrimaryKey()
  idPatient!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  birthdate!: Date;

  @Property()
  telephone!: number;

  @Property()
  mail!: string;

  @Property()
  type!: string; //type: responsable legal o paciente

  @OneToMany(() => Appointment, Appointment => Appointment.patient)
    Appointments = new Collection<Appointment>(this);

  
  @ManyToMany(() => HealthInsurance, healthInsurance => healthInsurance.patients)
  healthInsurances = new Collection<HealthInsurance>(this);

  //Relacion Recurisiva
  
  @ManyToOne(() => Patient, patient => patient.dependents, { nullable: true })
  legalGuardian?: Patient;

  @OneToMany(() => Patient, patient => patient.legalGuardian)
  dependents = new Collection<Patient>(this);



  constructor(name: string)
  {
    this.firstName = name;
  }
}