import { Entity, PrimaryKey, Property, ManyToOne, Enum, OneToMany, Collection} from '@mikro-orm/core';
import { Professional } from './Professional';
import { ConsultingRoom } from './ConsultingRoom';
import { ModuleType } from './ModuleType';
import { DayOfWeek } from '../enums/DayOfWeek';
import { ModuleStatus } from '../enums/ModuleStatus';
import { Appointment } from './Appointment';

@Entity()
export class Module {
  @PrimaryKey()
  idModule!: number;

  @Enum(() => ModuleStatus)
  status!: ModuleStatus

  @Enum(() => DayOfWeek)
  day!: DayOfWeek; 

  @Property({ columnType: 'time' })
  startTime!: string; // Sería strings de formato 11:00 con formate 24hs (Sin AM PM)

  @Property({ columnType: 'time' })
  endTime!: string;

  @Property()
  validMonth!: number; // mes de vigencia

  @Property()
  validYear!: number //Año de vigencia

  @OneToMany(() => Appointment, appointment => appointment.module)
  appointments = new Collection<Appointment>(this);

  @ManyToOne(() => Professional)
  professional!: Professional;

  @ManyToOne(() => ConsultingRoom)
  consultingRoom!: ConsultingRoom;

  @ManyToOne(() => ModuleType)
  moduleType!: ModuleType;

  private calculateEndTime(moduleType: ModuleType, startTime: string): string {
    let endTime: string;
    let duration = moduleType.duration;

    let [hours, minutes] = startTime.split(':').map(Number);
    hours = (hours + duration) % 24; //No debería pasarse de 24hs pero por las dudas
    endTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
    return endTime;
  }

  constructor(day: DayOfWeek, startTime: string, validMonth: number, validYear: number, professional: Professional, consultingRoom: ConsultingRoom, moduleType: ModuleType) {
    this.day = day;
    this.startTime = startTime;
    this.endTime = this.calculateEndTime(moduleType, startTime);
    this.validMonth = validMonth;
    this.validYear = validYear;
    this.professional = professional;
    this.consultingRoom = consultingRoom;
    this.moduleType = moduleType;
    this.status = ModuleStatus.Paid;
    }
}

