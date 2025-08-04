import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Module } from './Module';

@Entity()
export class ConsultingRoom {
  @PrimaryKey()
  idConsultingRoom!: number;

  @Property()
  description!: string;

  
  @OneToMany(() => Module, module => module.consultingRoom)
  modules = new Collection<Module>(this);

  constructor(description: string) {
    this.description = description;
  }
}
