import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Professional } from './Professional';

@Entity()
export class Appointment {
  @PrimaryKey()
  id!: number;

  @Property()
  description!: string;

  @ManyToOne()
  professional!: Professional;

  constructor(description: string) {
    this.description = description;
  }
}
