import { Entity, PrimaryKey, Property, ManyToOne} from '@mikro-orm/core';
import { Professional } from './Professional';
import { ConsultingRoom } from './ConsultingRoom';
import { ModuleType } from './ModuleType';

@Entity()
export class Module {
  @PrimaryKey()
  idModule!: number;

  @Property()
  day!: string; 

  @Property()
  startTime!: string; // o Date si querés manejar hora exacta

  @Property()
  validMonth!: number; // mes de vigencia

  @ManyToOne(() => Professional)
  professional!: Professional;

  @ManyToOne(() => ConsultingRoom)
  consultingRoom!: ConsultingRoom;

  @ManyToOne(() => ModuleType)
  moduleType!: ModuleType;
}

