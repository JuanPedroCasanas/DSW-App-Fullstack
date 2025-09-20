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
  mail!: string;

  @OneToMany(() => Appointment, (appointment: Appointment) => appointment.patient)
  appointments = new Collection<Appointment>(this);

  @ManyToMany(() => HealthInsurance, (healthInsurance: HealthInsurance) => healthInsurance.patients, {owner: true})
  healthInsurances = new Collection<HealthInsurance>(this);

 
  @OneToMany(() => Patient, patient => patient.legalGuardian)
    patients!: Patient[];

  @OneToOne(() => User)
  user!: User;  


  @OneToMany(() => Patient, (patient: Patient) => patient.legalGuardian)
  dependents = new Collection<Patient>(this);
    static type: any;
    static mail: any;
    static telephone: any;
    static birthdate: any;
    static lastName: any;
    static firstName: any;

  constructor(name: string)
  {
    this.firstName = name;
  }
}