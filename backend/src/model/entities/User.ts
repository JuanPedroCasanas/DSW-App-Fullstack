import { BeforeCreate, BeforeUpdate, Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { OneToOne } from '@mikro-orm/core';
import { LegalGuardian } from './LegalGuardian';
import { Patient } from './Patient';
import { Professional } from './Professional';
import { UserRole } from '../enums/UserRole';

@Entity()
export class User {
  @PrimaryKey()
  idUser!: number;

  @Property()
  mail!: string;

  @Property ()
  password!: string;

  @Enum(() => UserRole)
  role!: UserRole;

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

  /*@BeforeCreate()
  @BeforeUpdate()
  generateRole() {
    if (this.patient) this.role = UserRole.Patient
    else if (this.legalGuardian) this.role = UserRole.LegalGuardian
    else if (this.professional) this.role = UserRole.Professional
    else throw new Error("El usuario debe tener al menos un rol asignado.");
  }*/
  
}
