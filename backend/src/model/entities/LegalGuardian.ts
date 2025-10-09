import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Appointment } from './Appointment';
import { Collection, OneToMany, ManyToMany, ManyToOne, OneToOne } from '@mikro-orm/core';
import { HealthInsurance } from './HealthInsurance';
import { Patient } from './Patient';
import { User } from './User';


@Entity()
export class LegalGuardian {
  @PrimaryKey()
  idLegalGuardian!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  birthdate!: Date;

  @Property()
  telephone!: string;

  @Property()
  isActive!: boolean;

  @OneToMany(() => Appointment, (appointment: Appointment) => appointment.legalGuardian)
  appointments = new Collection<Appointment>(this);

  @ManyToOne(() => HealthInsurance)
  healthInsurance!: HealthInsurance

  @OneToMany(() => Patient, (patient: Patient) => patient.legalGuardian)
  guardedPatients = new Collection<Patient>(this);

  @OneToOne(() => User, (u) => u.legalGuardian)
  user!: User 

  constructor(firstName: string, lastName: string, birthdate: Date, telephone: string, healthInsurance: HealthInsurance)
  {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.telephone = telephone;
    this.isActive = true;
    this.healthInsurance = healthInsurance
  }
}