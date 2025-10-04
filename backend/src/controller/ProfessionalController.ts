import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Professional } from '../model/entities/Professional';
import { Occupation } from '../model/entities/Occupation'; 
export class ProfessionalController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de profesional!');
    }

    static async addProfessional(req: Request, res: Response) {
        const { name, lastName, birthdate, telephone, mail, occupation} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Last name is required' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Birthdate is required' });
        }   
        if (!telephone) {
            return res.status(400).json({ message: 'Telephone is required' });
        }
        if (!mail) {
            return res.status(400).json({ message: 'Mail is required' });
        }
        if (!occupation){
            return res.status(400).json({message:'Ocupation is required'});
        }

        try {            
            
            let occupation: Occupation | undefined;
            const em = await getORM().em.fork();
            if(occupation) {
                const occupationIdNum = Number(occupation);
                occupation = await em.findOne(Occupation, { id : occupationIdNum }) ?? undefined; //Si devuelve null lo paso a undefined para que no se queje TS
                if(!occupation) {
                    return res.status(404).json({ message: 'ID de la especialidad invalida.' });
                }
            }
        

        const professional = new Professional(name, lastName, birthdate, telephone, mail);
            await em.persistAndFlush(professional);

            res.status(201).json({ message: 'Professional added', professional });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add professional' });
        }
    }
    
    static async updateProfessional(req: Request, res: Response) {
        const { id } = req.body;
        const { name } = req.body;
        const {lastName} = req.body;   
        const {telephone} = req.body;
        const {mail} = req.body;
        const {occupation} = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Professional id is required' });
        }
        if(!name)
        {
            return res.status(400).json({ message: 'Professional new name is required' });
        }
        if(!lastName)
        {
            return res.status(400).json({ message: 'Professional new last name is required' });
        }
        
        
        if(!telephone)
        {
            return res.status(400).json({ message: 'Professional new telephone is required' });
        }
        if(!mail)
        {
            return res.status(400).json({ message: 'Professional new mail is required' });
        }
        if(!occupation)
        {
            return res.status(400).json({ message: 'Professional new type is required' });
        }
        const em = await getORM().em.fork();
        const professional = await em.findOne(Professional, {id: id});

        if(!professional)
        {
            return res.status(400).json({ message: 'Professional not found' });
        }

        professional.firstName = name;
        professional.lastName = lastName;
        professional.telephone = telephone;
        professional.email = mail;
        professional.occupation = occupation;

        await em.persistAndFlush(professional);

        res.status(201).json({ message: 'Professional updated', professional });
    }

    static async getProfessional(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Professional id is required' });
        }
        try {
            const em = await getORM().em.fork();
            const professional = await em.findOne(Professional, { id: id });
            if (!professional) {
            return res.status(404).json({ message: 'Professional not found' });
            }
            res.json(professional);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Professional' });
        }
    }

    static async getProfessionals(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const professionals = await em.find(Professional, {});
            res.json(professionals);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Professionals' });
        }
    }

    static async deleteProfessional(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Professional id is required' });
        }
        try {

            const em = await getORM().em.fork();
            const profesional = await em.findOne(Professional, { id : id });

            if (!profesional) {
                return res.status(404).json({ message: 'Professional not found' });
            }

            await em.removeAndFlush(profesional);
            res.json(profesional);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete Professional' });
        }
    }
}