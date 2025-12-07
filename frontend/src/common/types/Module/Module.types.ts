import {Professional, ModuleType, ConsultingRoom} from '@/common/types';

export type Module = {
    id: string;
    validMonth: string;

    professional: Professional;
    moduleType: ModuleType;
    consultingRoom: ConsultingRoom;
}