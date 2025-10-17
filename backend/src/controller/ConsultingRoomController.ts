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

        if (!description) {
            return res.status(400).json({ message: 'Se requiere una descripción, ej: Consultorio 1' });
        }

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

        if(!idConsultingRoom)
        {
            return res.status(400).json({ message: 'Se requiere una id de consultorio' });
        }
        if(!description)
        {
            return res.status(400).json({ message: 'Se requiere una nueva descripción de consultorio' });
        }

        try {
            const em = await getORM().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });

            if(!consultingRoom)
            {
                throw new NotFoundError('Consultorio');
            }

            consultingRoom.description = description;

            await em.flush();

            return res.status(201).json({ message: 'ConsultingRoom actualizado', consultingRoom });
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
        const idConsultingRoom = Number(req.params.id);

        if (!idConsultingRoom) {
            return res.status(400).json({ message: 'Se requiere una id de consultorio' });
        }

        try {
            const em = await getORM().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });
            if (!consultingRoom) {
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
        try {
            const em = await getORM().em.fork();
            const consultingRooms = await em.find(ConsultingRoom, {});
            return res.status(200).json(consultingRooms);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar consultorios' });
        }
    }

    static async deleteConsultingRoom(req: Request, res: Response) {
        const idConsultingRoom = Number(req.params.idConsultingRoom);


        if (!idConsultingRoom) {
            return res.status(400).json({ message: 'Se requiere una id de consultorio' });
        }
        try {

            const em = await getORM().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom, { id: idConsultingRoom });

            if (!consultingRoom) {
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