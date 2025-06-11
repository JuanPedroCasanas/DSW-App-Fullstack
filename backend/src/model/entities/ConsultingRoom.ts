import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ConsultingRoom {
  @PrimaryKey()
  idConsultingRoom!: number;

  @Property()
  description!: string;

  constructor(description: string) {
    this.description = description;
  }
}
