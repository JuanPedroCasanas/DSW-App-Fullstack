import { Entity, PrimaryKey, Property } from '@mikro-orm/core';


@Entity()
export class Persona {
  @PrimaryKey()
  idPersona!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  birthdate!: Date;

  @Property()
  telephone!: number;

  @Property()
  mail!: string;

  @Property()
  type!: string; //type: responsable legal o paciente


  constructor(name: string)
  {
    this.firstName = name;
  }
}