import { Request, Response } from 'express';
import { OccupationService } from '../services/OccupationService';
import { BaseHttpError } from '../utils/errors/BaseHttpError';

export class OccupationController {

    static async addOccupation(req: Request, res: Response) {
        const { name } = req.body;

        try {
            const occupation = await OccupationService.addOccupation(name);

            return res.status(201).json({
                message: 'Especialidad añadida',
                occupation
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al añadir la especialidad' });
        }
    }

    static async updateOccupation(req: Request, res: Response) {
        const { idOccupation, name } = req.body;

        try {
            const occupation = await OccupationService.updateOccupation(idOccupation, name);

            return res.status(201).json({
                message: 'Especialidad actualizada',
                occupation
            });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al modificar especialidad' });
            }
        }
    }

    static async getOccupation(req: Request, res: Response) {
        const idOccupation = Number(req.params.idOccupation);

        try {
            const occupation = await OccupationService.getOccupation(idOccupation);

            return res.status(200).json(occupation);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar especialidad' });
            }
        }
    }

    static async getOccupations(req: Request, res: Response) {
        try {
            const occupations = await OccupationService.getOccupations();

            return res.status(200).json(occupations);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar especialidades' });
        }
    }

    static async deleteOccupation(req: Request, res: Response) {
        const idOccupation = Number(req.params.idOccupation);

        try {
            const occupation = await OccupationService.deleteOccupation(idOccupation);

            return res.status(200).json({
                message: 'Especialidad eliminada',
                occupation
            });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al eliminar especialidad' });
            }
        }
    }
}
