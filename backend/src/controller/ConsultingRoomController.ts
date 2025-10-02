import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { ConsultingRoom } from '../model/entities/ConsultingRoom';

export class ConsultingRoomController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de ocupaciones!');
    }

    static async addConsultingRoom(req: Request, res: Response) {
        const { description } = req.body;

        if (!description) {
            return res.status(400).json({ message: 'Name is required' });
        }

        try {
            const consultingRoom = new ConsultingRoom(description);
            
            const em = await getORM().em.fork();
            await em.persistAndFlush(consultingRoom);

            res.status(201).json({ message: 'ConsultingRoom added', consultingRoom });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add consulting room' });
        }
    }

    static async updateConsultingRoom(req: Request, res: Response) {
        const { idConsultingRoom } = req.body;
        const { description } = req.body;

        if(!idConsultingRoom)
        {
            return res.status(400).json({ message: 'Consulting Room id is required' });
        }
        if(!description)
        {
            return res.status(400).json({ message: 'Consulting Room new name is required' });
        }

        const em = await getORM().em.fork();
        const consultingRoom = await em.findOne(ConsultingRoom, { idConsultingRoom: idConsultingRoom });

        if(!consultingRoom)
        {
            return res.status(400).json({ message: 'Consulting Room not found' });
            // throw new Error("Ocupacion no encontrada");
        }

        consultingRoom.description = description;

        await em.persistAndFlush(ConsultingRoom);

        res.status(201).json({ message: 'ConsultingRoom updated', consultingRoom });
    }

    static async getConsultingRoom(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'ConsultingRoom id is required' });
        }
        try {
            const em = await getORM().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom, { idConsultingRoom: id });
            if (!consultingRoom) {
            return res.status(404).json({ message: 'ConsultingRoom not found' });
            }
            res.json(consultingRoom);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch ConsultingRoom' });
        }
    }

    static async getConsultingRooms(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const consultingRooms = await em.find(ConsultingRoom, {});
            res.json(consultingRooms);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch ConsultingRooms' });
        }
    }

    static async deleteConsultingRoom(req: Request, res: Response) {
        const idConsultingRoom = Number(req.params.idConsultingRoom);
        if (!idConsultingRoom) {
            return res.status(400).json({ message: 'ConsultingRoom id is required' });
        }
        try {

            const em = await getORM().em.fork();
            const consultingRoom = await em.findOne(ConsultingRoom, { idConsultingRoom : idConsultingRoom });

            if (!consultingRoom) {
                return res.status(404).json({ message: 'ConsultingRoom not found' });
            }

            await em.removeAndFlush(consultingRoom);
            res.json(consultingRoom);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete ConsultingRoom' });
        }
    }


}