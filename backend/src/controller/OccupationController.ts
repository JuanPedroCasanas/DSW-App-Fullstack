import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Occupation } from '../model/entities/Occupation';

export class OccupationController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de ocupaciones!');
    }

    static async addOccupation(req: Request, res: Response) {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        try {
            const occupation = new Occupation(name);
            
            const em = await getORM().em.fork();
            await em.persistAndFlush(occupation);

            res.status(201).json({ message: 'Occupation added', occupation });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add occupation' });
        }
    }

    static async updateOccupation(req: Request, res: Response) {
        const { id } = req.body;
        const { name } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Occupation id is required' });
        }
        if(!name)
        {
            return res.status(400).json({ message: 'Occupation new name is required' });
        }

        const em = await getORM().em.fork();
        const occupation = await em.findOne(Occupation, { id: id });

        if(!occupation)
        {
            return res.status(400).json({ message: 'Occupation not found' });
            // throw new Error("Ocupacion no encontrada");
        }

        occupation.name = name;

        await em.persistAndFlush(occupation);

        res.status(201).json({ message: 'Occupation updated', occupation });
    }

    static async getOccupation(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Occupation id is required' });
        }
        try {
            const em = await getORM().em.fork();
            const occupation = await em.findOne(Occupation, { id: id });
            if (!occupation) {
            return res.status(404).json({ message: 'Occupation not found' });
            }
            res.json(occupation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch occupation' });
        }
    }

    static async getOccupations(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const occupations = await em.find(Occupation, {});
            res.json(occupations);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch occupations' });
        }
    }

    static async deleteOccupation(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Occupation id is required' });
        }
        try {

            const em = await getORM().em.fork();
            const occupation = await em.findOne(Occupation, id);

            if (!occupation) {
                return res.status(404).json({ message: 'Occupation not found' });
            }

            await em.removeAndFlush(occupation);
            res.json(occupation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete occupation' });
        }
    }


}