export type Module = {
    id: string;
    validMonth: string;

   /* day: string;
    startTime: string;
    endTime: string; */

    professional: Professional;
    moduleType: ModuleType;
    consultingRoom: ConsultingRoom;
}

export type ConsultingRoom = {
    id: string;
    description: string
}

export type Professional = {
    id: string;
    firstName: string;
    lastName: string;
}

export type ModuleType = {
    id: string;
    name: string;
}