import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

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
