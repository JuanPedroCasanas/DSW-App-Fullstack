import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Appointment } from './Appointment';
import { Collection, OneToMany, ManyToMany, ManyToOne, OneToOne } from '@mikro-orm/core';
import { HealthInsurance } from './HealthInsurance';
import { LegalGuardian } from './LegalGuardian';
import { User } from './User';

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
  telephone!: string;

  @Property()
  mail!: string;

  @OneToMany(() => Appointment, (appointment: Appointment) => appointment.patient)
  appointments = new Collection<Appointment>(this);

  @ManyToMany(() => HealthInsurance, (healthInsurance: HealthInsurance) => healthInsurance.patients, {owner: true})
  healthInsurances = new Collection<HealthInsurance>(this);

  @ManyToOne(() => LegalGuardian, { nullable: true })
  legalGuardian?: LegalGuardian;

  constructor(firstName: string, lastName: string, birthdate: Date, telephone: string, mail: string, legalGuardian?: LegalGuardian) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.telephone = telephone;
    this.mail = mail;
    this.legalGuardian = legalGuardian
}



}