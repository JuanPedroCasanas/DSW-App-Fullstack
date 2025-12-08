import { BeforeCreate, BeforeUpdate, Cascade, Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { OneToOne } from '@mikro-orm/core';
import { LegalGuardian } from './LegalGuardian';
import { Patient } from './Patient';
import { Professional } from './Professional';
import { UserRole } from '../../utils/enums/UserRole';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  mail!: string;

  @Property ()
  password!: string;

  @Property()
  isActive!: boolean;

  @Enum(() => UserRole)
  role!: UserRole;

  //Cascade persist hace que cuando se haga un persiste de un User en mikroORM, se haga tambien un persiste de los pacientes, responsables legales
  // y profesionales en memoria asociados con dicha clase
  @OneToOne(() => Professional, (p) => p.user, { owner: true, nullable: true, cascade: [Cascade.PERSIST]})
  professional?: Professional;

  @OneToOne(() => Patient, (p) => p.user, { owner: true, nullable: true, cascade: [Cascade.PERSIST] })
  patient?: Patient;

  @OneToOne(() => LegalGuardian, (lg) => lg.user, { owner: true, nullable: true, cascade: [Cascade.PERSIST] })
  legalGuardian?: LegalGuardian;
  
  
  @BeforeCreate()
  @BeforeUpdate()
  assignAndCheckRole() {
    if (this.patient) this.role = UserRole.Patient
    else if (this.legalGuardian) this.role = UserRole.LegalGuardian
    else if (this.professional) this.role = UserRole.Professional
    else throw new Error("El usuario debe tener al menos un rol asignado.");
  }
  
    constructor(mail: string, password: string)
  {
    this.mail = mail;
    this.password = password;
    this.isActive = true;
  }

  
}
