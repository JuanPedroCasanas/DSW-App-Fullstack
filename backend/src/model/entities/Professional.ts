import {
  Entity, PrimaryKey, Property, ManyToOne, OneToMany, ManyToMany
} from '@mikro-orm/core';
import { Specialty } from './Specialty';
import { ConsultingRoom } from './ConsultingRoom';
import { Appointment } from './Appointment'; 

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
