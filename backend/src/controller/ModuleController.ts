import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Module } from '../model/entities/Module';
import { Professional } from '../model/entities/Professional';
import { ConsultingRoom } from '../model/entities/ConsultingRoom';
import { ModuleType } from '../model/entities/ModuleType';


export default class ModuleController  {
    static home(req: Request, res: Response) {
        res.send('Soy el controlador de modulos!');
    }

    static async addModule(req: Request, res: Response) {
    const { day, startTime, validMonth, professionalId, consultingRoomId, moduleTypeId } = req.body;

    // Validaciones básicas
    if (!day || !startTime || !validMonth || !professionalId || !consultingRoomId || !moduleTypeId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const em = await getORM().em.fork();

        // Buscar entidades relacionadas
        const professional = await em.findOne(Professional, { id: professionalId });
        const consultingRoom = await em.findOne(ConsultingRoom, { idConsultingRoom: consultingRoomId });
        const moduleType = await em.findOne(ModuleType, { idModuleType: moduleTypeId });

            res.status(201).json({ message: 'Module added', module });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add module' });
        }
    }

    static async updateModule(req: Request, res: Response) {
        const { day,startTime,validMonth, professionalId, consultingRoom, moduleType} = req.body;

        if(!day)
        {
            return res.status(400).json({ message: 'Module day is required' });
        }
        if(!startTime)
        {
            return res.status(400).json({ message: 'Module start time is required' });
        }
        if(!validMonth)
        {
            return res.status(400).json({ message: 'Module valid month is required' });
        }
        if(!professionalId)
        {
            return res.status(400).json({ message: 'Module professional id is required' });
        }
        if(!consultingRoom)
        {
            return res.status(400).json({ message: 'Module consulting room is required' });
        }
        if(!moduleType)
        {
            return res.status(400).json({ message: 'Module type is required' });
        }
    
        const em = await getORM().em.fork();
        const idModule = Number(req.params.idModule);
        const module = await em.findOne(Module, { idModule });


        if(!module)
        {
            return res.status(400).json({ message: 'Module not found' });
            // throw new Error("Modulo no encontrado");
        }

        await em.persistAndFlush(module);

        res.status(201).json({ message: 'Module updated', module });
    }

    static async getModule(req: Request, res: Response) {
        const { idModule } = req.params;

        if(!idModule)
        {
            return res.status(400).json({ message: 'Module id is required' });
        }

        const em = await getORM().em.fork();
        const module = await em.findOne(Module, { idModule: parseInt(idModule) });

        if(!module) 
        {
            return res.status(400).json({ message: 'Module not found' });
            // throw new Error("Modulo no encontrado");
        }

        res.status(200).json(module);
    }

    static async getModules(req: Request, res: Response) {
            try {
                const em = await getORM().em.fork();
                const modules = await em.find(Module, {});
                res.json(modules);
    
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Failed to fetch modules' });
            }
        }
    
        static async deleteModule(req: Request, res: Response) {
            const idModule = Number(req.params.id);
            if (!idModule) {
                return res.status(400).json({ message: 'Appointment id is required' });
            }
            try {
    
                const em = await getORM().em.fork();
                const module = await em.findOne(Module, { idModule: idModule });
    
                if (!module) {
                    return res.status(404).json({ message: 'Module not found' });
                }
    
                await em.removeAndFlush(module);
                res.json(module);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Failed to delete module' });
            }
        }
    
    
    }