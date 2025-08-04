import {
  Entity, PrimaryKey, Property, ManyToOne, OneToMany, ManyToMany,
  Collection
} from '@mikro-orm/core';
import { ConsultingRoom } from './ConsultingRoom';
import { Appointment } from './Appointment';
import { Occupation } from './Occupation';
import { Module } from './Module';

@Entity()
export class Professional {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  email!: string;

  @Property()
  phone!: string;

  @ManyToOne()
  occupation!: Occupation;

  @ManyToMany()
  consultingRoom!: ConsultingRoom;


  @OneToMany(() => Module, module => module.professional)
  modules = new Collection<Module>(this);


  @OneToMany(() => Appointment, (appointment) => appointment.professional)
  appointments = new Collection<Appointment>(this);
}