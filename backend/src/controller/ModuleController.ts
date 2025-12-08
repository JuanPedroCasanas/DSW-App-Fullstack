import { Request, Response } from 'express';
import ModuleService from '../services/ModuleService';
import { BaseHttpError } from '../utils/errors/BaseHttpError';
import { safeSerialize } from '../utils/helpers/safeSerialize';

export default class ModuleController {

    static async addModules(req: Request, res: Response) {

        let {
            day,
            startTime,
            endTime,
            validMonth,
            validYear,
            idProfessional,
            idConsultingRoom
        } = req.body;

        try {
            const modules = await ModuleService.addModules(
                day,
                startTime,
                endTime,
                Number(validMonth),
                Number(validYear),
                Number(idProfessional),
                Number(idConsultingRoom)
            );

            return res.status(201).json({
                message: 'Modulos correctamente añadidos',
                modules: safeSerialize(modules)
            });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al crear los modulos' });
            }
        }
    }

    static async getModule(req: Request, res: Response) {
        const idModule = Number(req.params.idModule);

        try {
            const module = await ModuleService.getModule(idModule);
            return res.status(200).json(safeSerialize(module));

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar modulo' });
            }
        }
    }

    static async getModules(req: Request, res: Response) {
        try {
            const modules = await ModuleService.getModules();
            return res.status(200).json(safeSerialize(modules));
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar modulos' });
        }
    }

    static async getCurrentMonthModulesByConsultingRoom(req: Request, res: Response) {
        const idConsultingRoom = Number(req.params.idConsultingRoom);

        try {
            const modules = await ModuleService.getCurrentMonthModulesByConsultingRoom(idConsultingRoom);
            return res.status(200).json(safeSerialize(modules));

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error buscar modulo' });
            }
        }
    }
}
