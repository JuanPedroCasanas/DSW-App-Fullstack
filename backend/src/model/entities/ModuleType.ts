import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { Module } from './Module';


// Tipo de módulo
// id, nombre, duracion en horas
@Entity()
export class ModuleType {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  duration!: number; //Lo manejo en numero ya que puede ser 1, 3 o 6 horas.
  
  @OneToMany(() => Module, module => module.moduleType)
  modules = new Collection<Module>(this);
  

  constructor(name: string, duration: number) {
    this.name = name;
    this.duration = duration;
  }
}