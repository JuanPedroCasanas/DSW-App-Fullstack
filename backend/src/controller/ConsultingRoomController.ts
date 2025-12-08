import { Request, Response } from 'express';
import { ConsultingRoomService } from '../services/ConsultingRoomService';
import { BaseHttpError } from '../utils/errors/BaseHttpError';

export class ConsultingRoomController {

    static async addConsultingRoom(req: Request, res: Response) {
        const { description } = req.body;

        try {
            const consultingRoom = await ConsultingRoomService.addConsultingRoom(description);

            return res.status(201).json({
                message: 'Se agrego correctamente el consultorio',
                consultingRoom
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al añadir el consultorio' });
        }
    }

    static async updateConsultingRoom(req: Request, res: Response) {
        const { idConsultingRoom } = req.body;
        const { description } = req.body;

        try {
            const consultingRoom = await ConsultingRoomService.updateConsultingRoom(
                idConsultingRoom,
                description
            );

            return res.status(201).json({
                message: 'Consultorio actualizado',
                consultingRoom
            });
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
            const consultingRoom = await ConsultingRoomService.getConsultingRoom(idConsultingRoom);

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
        }

        try {
            const consultingRooms = await ConsultingRoomService.getConsultingRooms(includeInactive);

            return res.status(200).json(consultingRooms);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar consultorios' });
        }
    }

    static async deleteConsultingRoom(req: Request, res: Response) {
        const idConsultingRoom = Number(req.params.idConsultingRoom);

        try {
            const consultingRoom = await ConsultingRoomService.deleteConsultingRoom(idConsultingRoom);

            return res.status(200).json({
                message: "Consultorio eliminado correctamente",
                consultingRoom
            });

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
