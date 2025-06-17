import { Entity, PrimaryKey, Property } from '@mikro-orm/core';


// Tipo de módulo
// id, nombre, duracion en horas
@Entity()
export class ModuleType {
  @PrimaryKey()
  idModuleType!: number;

  @Property()
  name!: string;

  @Property()
  duration!: number; //Lo manejo en numero ya que puede ser 1, 3 o 6 horas.

  constructor(name: string) {
    this.name = name;
  }
}