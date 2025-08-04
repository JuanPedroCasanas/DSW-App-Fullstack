import { Entity, PrimaryKey, Property, OneToMany, ManyToMany } from '@mikro-orm/core';
import { Appointment } from './Appointment';
import { Professional } from './Professional';
import { Patient } from './Patient';
import { Collection } from '@mikro-orm/core';

@Entity()
export class HealthInsurance {
  @PrimaryKey()
  idHealthInsurance!: number;

  @Property()
  name!: string;


  @OneToMany(() => Appointment, appointment => appointment.healthInsurance)
  appointments = new Collection<Appointment>(this);


  @ManyToMany(() => Professional, professional => professional.healthInsurances)
  professionals = new Collection<Professional>(this);


  @ManyToMany(() => Patient, patient => patient.healthInsurances)
  patients = new Collection<Patient>(this);


constructor(name: string) {
    this.name = name;
}

}
