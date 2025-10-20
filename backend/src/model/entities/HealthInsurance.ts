import { Entity, PrimaryKey, Property, OneToMany, ManyToMany } from '@mikro-orm/core';
import { Appointment } from './Appointment';
import { Professional } from './Professional';
import { Patient } from './Patient';
import { Collection } from '@mikro-orm/core';
import { LegalGuardian } from './LegalGuardian';

@Entity()
export class HealthInsurance {
  @PrimaryKey()
  id!: number;

  @Property()
  isActive!: boolean;

  @Property()
  name!: string;

  @OneToMany(() => Appointment, appointment => appointment.healthInsurance)
  appointments = new Collection<Appointment>(this);

  @ManyToMany(() => Professional, professional => professional.healthInsurances)
  professionals = new Collection<Professional>(this);

  @OneToMany(() => Patient, patient => patient.healthInsurance)
  patients = new Collection<Patient>(this);

  @OneToMany(() => LegalGuardian, legalGuardian => legalGuardian.healthInsurance)
  legalGuardians = new Collection<LegalGuardian>(this);

  constructor(name: string) {
    this.name = name;
    this.isActive = true;
  }

}
