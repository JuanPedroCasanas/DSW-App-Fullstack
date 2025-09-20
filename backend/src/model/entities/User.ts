import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Collection, OneToMany, ManyToMany, ManyToOne, OneToOne } from '@mikro-orm/core';
import { LegalGuardian } from './LegalGuardian';
import { Patient } from './Patient';
import { Professional } from './Professional';


export class User {
  @PrimaryKey()
  idUser!: number;

  @Property()
  mail!: string;

  @Property ()
  password!: string;

  @OneToOne(() => Patient)
  patient!: Patient;

  @OneToOne(() => LegalGuardian)
  legalGuardian!: LegalGuardian;
  
  @OneToOne(() => Professional)
  professional!: Professional;    
    
  }
