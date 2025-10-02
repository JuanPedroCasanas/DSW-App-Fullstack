import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { HealthInsurance } from '../model/entities/HealthInsurance';

export class HealthInsuranceController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de pacientes!');
    }

    static async addHealthInsurance(req: Request, res: Response) {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        try {
        const em = await getORM().em.fork(); 
        const healthinsurance = new HealthInsurance(name);
        await em.persistAndFlush(healthinsurance);

            res.status(201).json({ message: 'Health insurance added', healthinsurance });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add Health insurance' });
        }
    }
    
    static async updateHealthInsurance(req: Request, res: Response) {
        
        const {id, name } = req.body;
    
        if (!id) {
            return res.status(400).json({ message: 'Health insurance id is required' });
        }

        if (!name) {
        return res.status(400).json({ message: 'Name are required' });
        }

        const em = await getORM().em.fork();
        const healthinsurance = await em.findOne(HealthInsurance, { idHealthInsurance: id});

        if (!healthinsurance) {
        return res.status(404).json({ message: 'Health insurance not found' });
    }

        res.status(200).json({ message: 'Health insurance updated', healthinsurance });
    }

    static async getHealthInsurance(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Health insurance id is required' });
        }
        try {
            const em = await getORM().em.fork();
            const healthinsurance = await em.findOne(HealthInsurance, { idHealthInsurance: id });
            if (!healthinsurance) {
            return res.status(404).json({ message: 'Health insurance not found' });
            }
            res.json(healthinsurance);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch health insurance' });
        }
    }

    static async deleteHealthInsurance(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Health insurance id is required' });
        }
        try {

            const em = await getORM().em.fork();
            const healthinsurance = await em.findOne(HealthInsurance, { idHealthInsurance : id });

            if (!healthinsurance) {
                return res.status(404).json({ message: 'Health insurance not found' });
            }

            await em.removeAndFlush(healthinsurance);
            res.json(healthinsurance);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete Health insurance' });
        }
    }

}

