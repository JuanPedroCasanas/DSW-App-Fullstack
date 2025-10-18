import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Occupation } from '../model/entities/Occupation';
import { NotFoundError } from '@mikro-orm/core';
import { BaseHttpError } from '../model/errors/BaseHttpError';

export class OccupationController {

    static home(req: Request, res: Response) {
        return res.send('Soy el controlador de ocupaciones!');
    }

    static async addOccupation(req: Request, res: Response) {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Se requiere nombre de la especialidad' });
        }

        try {
            const occupation = new Occupation(name);
            
            const em = await getORM().em.fork();
            await em.persistAndFlush(occupation);

            return res.status(201).json({ message: 'Especialidad añadida', occupation });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al añadir la especialidad' });
        }
    }

    static async updateOccupation(req: Request, res: Response) {
        const { id } = req.body;
        const { name } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Se requiere el ID de la especialidad' });
        }
        if(!name)
        {
            return res.status(400).json({ message: 'Se requiere el nombre de la especialidad' });
        }

        try {

            const em = await getORM().em.fork();
            const occupation = await em.findOne(Occupation, { id: id });

            if(!occupation)
            {
                throw new  NotFoundError('Especialidad');
            }

            occupation.name = name;

            await em.flush();

            return res.status(201).json({ message: 'Especialidad actualizada', occupation });

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
        const idOccupation = Number(req.params.id);

        if (!idOccupation) {
            return res.status(400).json({ message: 'Se requiere el ID de la especialidad' });
        }
        try {
            const em = await getORM().em.fork();
            const occupation = await em.findOne(Occupation, { id : idOccupation });

            if (!occupation) {
                throw new NotFoundError('Especialidad');
            }

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

            const em = await getORM().em.fork();
            const occupations = await em.findAll(Occupation);
            
            return res.status(200).json(occupations);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al buscar especialidades' });
        }
    }


    static async deleteOccupation(req: Request, res: Response) {
        const idOccupation = Number(req.params.id);
        if (!idOccupation) {
            return res.status(400).json({ message: 'Se requiere ID de la especialidad' });
        }
        try {
            const em = await getORM().em.fork();
            const occupation = await em.findOne(Occupation, { id: idOccupation });

            if (!occupation) {
                throw new NotFoundError('Especialidad')
            }

            await em.removeAndFlush(occupation); //No vemos necesidad de borrado logico aca, tampoco necesidad de cascade, es un caso muy extremo en terminos de negocio

            return res.status(200).json({message: 'Especialidad eliminada', occupation});
            
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