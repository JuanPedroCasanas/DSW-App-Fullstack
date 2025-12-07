import {Professional, ModuleType, ConsultingRoom} from '@/common/types';

export type Module = {
    id?: number;
    validMonth?: string;

    professional?: Professional;
    moduleType?: ModuleType;
    consultingRoom?: ConsultingRoom;
}