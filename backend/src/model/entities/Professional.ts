import {
  Entity, PrimaryKey, Property, ManyToOne, OneToMany, ManyToMany
} from '@mikro-orm/core';
import { Specialty } from './specialty';
import { ConsultingRoom } from './consulting-room';
import { Appointment } from './appointment'; 

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
  specialty!: Specialty;

  @ManyToMany()
  consultingRoom!: ConsultingRoom;

  @OneToMany(() => Appointment, (appointment) => appointment.professional)
  appointments = new Collection<Appointment>(this);
}
