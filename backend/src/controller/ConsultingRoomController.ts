import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { ConsultingRoom } from '../model/entities/ConsultingRoom';
import { BaseHttpError, NotFoundError } from '../model/errors/BaseHttpError';
import { Module } from '../model/entities/Module';
import { ModuleStatus } from '../model/enums/ModuleStatus';
import { Appointment } from '../model/entities/Appointment';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';

export class ConsultingRoomController {

    static home(req: Request, res: Response) {
        return res.send('Soy el controlador de consultorios!');
    }

    static async addConsultingRoom(req: Request, res: Response) {
        const { description } = req.body;

        try {
            const consultingRoom = new ConsultingRoom(description);
            
            const em = await getORM().em.fork();
            await em.persistAndFlush(consultingRoom);

            return res.status(201).json({ message: 'Se agrego correctamente el consultorio', consultingRoom });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al añadir el consultorio' });
        }
    }

    static async updateConsultingRoom(req: Request, res: Response) {

        const { idConsultingRoom } = req.body;
        const { description } = req.body;

        try {
            const em = await getORM().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });

            if(!consultingRoom|| !consultingRoom?.isActive)
            {
                throw new NotFoundError('Consultorio');
            }

            consultingRoom.description = description;

            await em.flush();

            return res.status(201).json({ message: 'Consultorio actualizado', consultingRoom });
            } catch (error) {
                console.error(error);
                if (error instanceof BaseHttpError) {
                    return res.status(error.status).json(error.toJSON());
                }
                else {
                    return res.status(500).json({ message: 'Error al agregar consultorio' });
                }
            }
    }

    static async getConsultingRoom(req: Request, res: Response) {
        const idConsultingRoom = Number(req.params.idConsultingRoom);

        try {
            const em = await getORM().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });
            if (!consultingRoom|| !consultingRoom?.isActive) {
                throw new NotFoundError('Consultorio');
            }
            return res.status(200).json(consultingRoom);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar consultorio' });
            }
        }
    }

    static async getConsultingRooms(req: Request, res: Response) {
        let includeInactive:boolean;

        if (req.query.includeInactive === undefined) {
            includeInactive = true;
        } else {
            includeInactive = req.query.includeInactive === 'true'; 
            // true si el string es 'true', false si es cualquier otra cosa
        }

        try {

            const whereCondition = (includeInactive) ? {} : {isActive: true};

            const em = await getORM().em.fork();
            const consultingRooms = await em.find(ConsultingRoom, whereCondition);
            return res.status(200).json(consultingRooms);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar consultorios' });
        }
    }

    static async deleteConsultingRoom(req: Request, res: Response) {
        const idConsultingRoom = Number(req.params.idConsultingRoom);
        try {

            const em = await getORM().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });

            if (!consultingRoom || !consultingRoom?.isActive) {
                throw new NotFoundError('Consultorio')
            }
            
            consultingRoom.isActive = false;

            const consultingRoomModules = await em.find(Module, { consultingRoom : consultingRoom })

            //Se cancelan todos los modulos asociados al consultorio y por ende todos los turnos asociados a cada modulo asociado al consultorio
            if (consultingRoomModules.length != 0) {
                for (const module of consultingRoomModules) {
                    module.status = ModuleStatus.Canceled;

                    await module.appointments.init(); // Las colecciones entiendo son lazy loaded, espero a que carguen

                    for (const appointment of module.appointments) {
                    appointment.status = AppointmentStatus.Canceled;
                    }
                }
            }
            
            await em.flush();
            return res.status(200).json({ message: "Consultorio eliminado correctamente", consultingRoom });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al borrar consultorio' });
            }
        }
    }

}