import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Specialty {
  @PrimaryKey()
  idSpecialty!: number;

  @Property()
  name!: string;

  constructor(name: string) {
    this.name = name;
  }
}
