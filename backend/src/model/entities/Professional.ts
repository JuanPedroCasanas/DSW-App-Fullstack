import {
  Entity, PrimaryKey, Property, ManyToOne, OneToMany, ManyToMany, OneToOne, 
  Collection
} from '@mikro-orm/core';
import { ConsultingRoom } from './ConsultingRoom';
import { Appointment } from './Appointment';
import { Occupation } from './Occupation';
import { Module } from './Module';
import { HealthInsurance } from './HealthInsurance';
import { User } from './User';
@Entity()
export class Professional {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  telephone!: string;

  @Property()
  isActive!: boolean;

  @ManyToOne()
  occupation!: Occupation;

  @OneToMany(() => Module, module => module.professional)
  modules = new Collection<Module>(this);

  @OneToMany(() => Appointment, (appointment) => appointment.professional)
  appointments = new Collection<Appointment>(this);

  @ManyToMany(() => HealthInsurance, healthInsurance => healthInsurance.professionals, {owner: true})
  healthInsurances = new Collection<HealthInsurance>(this);

  @OneToOne(() => User, (u) => u.professional)
  user!: User;
  
  
  constructor(firstName: string, lastName: string, telephone: string, occupation: Occupation) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.telephone = telephone;
      this.occupation = occupation
      this.isActive = true;

  }
}
