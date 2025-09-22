import { BeforeCreate, BeforeUpdate, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Collection, OneToMany, ManyToMany, ManyToOne, OneToOne } from '@mikro-orm/core';
import { LegalGuardian } from './LegalGuardian';
import { Patient } from './Patient';
import { Professional } from './Professional';

@Entity()
export class User {
  @PrimaryKey()
  idUser!: number;

  @Property()
  mail!: string;

  @Property ()
  password!: string;

  @OneToOne(() => Patient, { nullable: true })
  patient?: Patient;

  @OneToOne(() => LegalGuardian, { nullable: true })
  legalGuardian?: LegalGuardian;
  
  @OneToOne(() => Professional, { nullable: true })
  professional?: Professional;

  
  @BeforeCreate()
  @BeforeUpdate()
  checkRole() {
    if (!this.patient && !this.legalGuardian && !this.professional) {
      throw new Error("El usuario debe tener al menos un rol asignado.");
    }
  }
  
}
