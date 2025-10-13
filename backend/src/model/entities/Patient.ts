import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Appointment } from './Appointment';
import { Collection, OneToMany, ManyToMany, ManyToOne, OneToOne } from '@mikro-orm/core';
import { HealthInsurance } from './HealthInsurance';
import { LegalGuardian } from './LegalGuardian';
import { User } from './User';

@Entity()
export class Patient {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  birthdate!: Date;

  @Property({ nullable: true })
  telephone?: string;

  @Property()
  isActive!: boolean;

  @OneToMany(() => Appointment, (appointment: Appointment) => appointment.patient)
  appointments = new Collection<Appointment>(this);

  @ManyToOne(() => HealthInsurance)
  healthInsurance!: HealthInsurance

  @ManyToOne(() => LegalGuardian, { nullable: true })
  legalGuardian?: LegalGuardian;

  @OneToOne(() => User, (u) => u.patient)
  user?: User


  constructor(firstName: string, lastName: string, birthdate: Date, healthInsurance:HealthInsurance, telephone?: string, legalGuardian?: LegalGuardian) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.telephone = telephone;
    this.legalGuardian = legalGuardian;
    this.healthInsurance = healthInsurance;
    this.isActive = true;
}



}