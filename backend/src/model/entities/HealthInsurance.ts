import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class HealthInsurance {
  @PrimaryKey()
  idHealthInsurance!: number;

  @Property()
  name!: string;

constructor(name: string) {
    this.name = name;
}

}
