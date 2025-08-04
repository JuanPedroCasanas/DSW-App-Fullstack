import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Appointment } from './Appointment';
import { Collection, OneToMany, ManyToMany, ManyToOne } from '@mikro-orm/core';
import { HealthInsurance } from './HealthInsurance';


@Entity()
export class Patient {
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

 @OneToMany(() => Appointment, (appointment: Appointment) => appointment.patient)
appointments = new Collection<Appointment>(this);

@ManyToMany(() => HealthInsurance, (healthInsurance: HealthInsurance) => healthInsurance.patients)
healthInsurances = new Collection<HealthInsurance>(this);

@ManyToOne(() => Patient, { nullable: true })
legalGuardian?: Patient;

@OneToMany(() => Patient, (patient: Patient) => patient.legalGuardian)
dependents = new Collection<Patient>(this);




  constructor(name: string)
  {
    this.firstName = name;
  }
}