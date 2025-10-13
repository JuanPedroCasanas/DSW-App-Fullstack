import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { BaseHttpError, NotFoundError } from '../model/errors/BaseHttpError';

export class HealthInsuranceController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de Obras Sociales!');
    }

    static async addHealthInsurance(req: Request, res: Response) {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Se requiere un nombre de obra social' });
        }
        try {
        const em = await getORM().em.fork(); 
        const healthinsurance = new HealthInsurance(name);
        await em.persistAndFlush(healthinsurance);
            res.status(201).json({ message: 'Obra social añadida: ', healthinsurance });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: 'Error al añadir obra social' });
        }
    }
    
    static async updateHealthInsurance(req: Request, res: Response) {
        
        const {id, name } = req.body;
    
        if (!id) {
            return res.status(400).json({ message: 'Se requiere un id de obra social' });
        }

        if (!name) {
        return res.status(400).json({ message: 'Se requiere un nombre de obra social' });
        }
        try {

        const em = await getORM().em.fork();
        const healthinsurance = await em.findOne(HealthInsurance, { id: id});

        if (!healthinsurance) {
            throw new NotFoundError('Obra Social');
        }

        res.status(200).json({ message: 'Obra social actualizada: ', healthinsurance });

        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al actualizar Obra Social' });
            }
        }
    }

    static async getHealthInsurance(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Se requiere un id de obra social' });
        }
        try {
            const em = await getORM().em.fork();
            const healthinsurance = await em.findOne(HealthInsurance, { id: id });
            if (!healthinsurance) {
                throw new NotFoundError('Obra Social');
            }
            res.json(healthinsurance);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al buscar Obra Social' });
            }
        }
    }

    static async getHealthInsurances(reque: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const healthinsurances = await em.findAll(HealthInsurance);
            res.json(healthinsurances);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al buscar Obras Sociales' });
        }
    }

    static async deleteHealthInsurance(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere un id de obra social' });
        }
        try {
            const em = await getORM().em.fork();
            const healthInsurance = await em.findOne(HealthInsurance, { id : id });

            if (!healthInsurance) {
                throw new NotFoundError('Obra Social');
            }

            healthInsurance.isActive = false; //No cascadeamos los resultados porque sería demasiado, en el negocio se arreglaria entre paciente y prof
            res.json(healthInsurance);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al eliminar Obra Social' });
            }
        }
    }

}

