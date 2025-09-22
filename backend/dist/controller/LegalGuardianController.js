"use strict";
/*import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { LegalGuardian } from '../model/entities/LegalGuardian';

export class LegalGuardianController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de Responsable Legal!');
    }

    static async addLegalGuardian(req: Request, res: Response) {
        const { firstName, lastName, birthdate, telephone, mail} = req.body;

        if (!firstName) {
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
        

        try {
            const legalGuardian = new LegalGuardian(firstName);
            
            const em = await getORM().em.fork();
            await em.persistAndFlush(LegalGuardian);

            res.status(201).json({ message: 'LegalGuardian added', LegalGuardian });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add LegalGuardian' });
        }
    }

    static async updatePatient(req: Request, res: Response) {
        const { id } = req.body;
        const { name } = req.body;
        const {lastName} = req.body;
        const {birthdate} = req.body;
        const {telephone} = req.body;
        const {mail} = req.body;
        const {type} = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'LegalGuardian id is required' });
        }
        if(!name)
        {
            return res.status(400).json({ message: 'LegalGuardian new name is required' });
        }
        if(!lastName)
        {
            return res.status(400).json({ message: 'LegalGuardian new last name is required' });
        }
        if(!birthdate)
        {
            return res.status(400).json({ message: 'LegalGuardian new birthdate is required' });
        }
        if(!telephone)
        {
            return res.status(400).json({ message: 'LegalGuardian new telephone is required' });
        }
        if(!mail)
        {
            return res.status(400).json({ message: 'LegalGuardian new mail is required' });
        }
        if(!type)
        {
            return res.status(400).json({ message: 'LegalGuardian new type is required' });
        }
        const em = await getORM().em.fork();
        const LegalGuardian = await em.findOne(LegalGuardian, {idPatient: id});

        if(!LegalGuardian)
        {
            return res.status(400).json({ message: 'LegalGuardian not found' });
        }

        LegalGuardian.firstName = name;
        LegalGuardian.lastName = lastName;
        LegalGuardian.birthdate = birthdate;
        LegalGuardian.telephone = telephone;
        LegalGuardian.mail = mail;
        LegalGuardian.type = type;

        await em.persistAndFlush(LegalGuardian);

        res.status(201).json({ message: 'LegalGuardian updated', LegalGuardian });
    }

    static async getPatient(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'LegalGuardian id is required' });
        }
        try {
            const em = await getORM().em.fork();
            const LegalGuardian = await em.findOne(LegalGuardian, { idPatient: id });
            if (!LegalGuardian) {
            return res.status(404).json({ message: 'LegalGuardian not found' });
            }
            res.json(LegalGuardian);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch LegalGuardian' });
        }
    }

    static async getPatients(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const Patients = await em.find(LegalGuardian, {});
            res.json(Patients);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Patients' });
        }
    }

    static async deletePatient(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'LegalGuardian id is required' });
        }
        try {

            const em = await getORM().em.fork();
            const LegalGuardian = await em.findOne(LegalGuardian, { idPatient : id });

            if (!LegalGuardian) {
                return res.status(404).json({ message: 'LegalGuardian not found' });
            }

            await em.removeAndFlush(LegalGuardian);
            res.json(LegalGuardian);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete LegalGuardian' });
        }
    }


}
    */ 
//# sourceMappingURL=LegalGuardianController.js.map