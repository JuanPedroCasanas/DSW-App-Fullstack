import { getORM } from '../orm/db';
import { ConsultingRoom } from '../model/entities/ConsultingRoom';
import { BaseHttpError, NotFoundError } from '../utils/errors/BaseHttpError';
import { Module } from '../model/entities/Module';
import { ModuleStatus } from '../utils/enums/ModuleStatus';
import { Appointment } from '../model/entities/Appointment';
import { AppointmentStatus } from '../utils/enums/AppointmentStatus';

export class ConsultingRoomService {

    static async addConsultingRoom(description: string) {
        const consultingRoom = new ConsultingRoom(description);
        
        const em = await getORM().em.fork();
        await em.persistAndFlush(consultingRoom);

        return consultingRoom;
    }

    static async updateConsultingRoom(idConsultingRoom: number, description: string) {
        const em = await getORM().em.fork();
        const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });

        if(!consultingRoom|| !consultingRoom?.isActive)
        {
            throw new NotFoundError('Consultorio');
        }

        consultingRoom.description = description;

        await em.flush();

        return consultingRoom;
    }

    static async getConsultingRoom(idConsultingRoom: number) {
        const em = await getORM().em.fork();
        const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });
        if (!consultingRoom|| !consultingRoom?.isActive) {
            throw new NotFoundError('Consultorio');
        }
        return consultingRoom;
    }

    static async getConsultingRooms(includeInactive: boolean) {
        const whereCondition = (includeInactive) ? {} : {isActive: true};

        const em = await getORM().em.fork();
        const consultingRooms = await em.find(ConsultingRoom, whereCondition);

        return consultingRooms;
    }

    static async deleteConsultingRoom(idConsultingRoom: number) {
        const em = await getORM().em.fork();
        const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });

        if (!consultingRoom || !consultingRoom?.isActive) {
            throw new NotFoundError('Consultorio')
        }
        
        consultingRoom.isActive = false;

        const consultingRoomModules = await em.find(Module, { consultingRoom : consultingRoom })

        if (consultingRoomModules.length != 0) {
            for (const module of consultingRoomModules) {
                module.status = ModuleStatus.Canceled;

                await module.appointments.init();

                for (const appointment of module.appointments) {
                    appointment.status = AppointmentStatus.Canceled;
                }
            }
        }
        
        await em.flush();

        return consultingRoom;
    }
}
