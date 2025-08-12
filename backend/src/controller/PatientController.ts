import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Patient } from '../model/entities/Patient';

export class PatientController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de pacientes!');
    }

    static async addPatient(req: Request, res: Response) {
        const { name, lastName, birthdate, telephone, mail, type } = req.body;

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
        if (!type) {
            return res.status(400).json({ message: 'Type is required' });
        }

        try {
            const patient = new Patient(name);
            
            const em = await getORM().em.fork();
            await em.persistAndFlush(patient);

            res.status(201).json({ message: 'Patient added', patient });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add Patient' });
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
            return res.status(400).json({ message: 'Patient id is required' });
        }
        if(!name)
        {
            return res.status(400).json({ message: 'Patient new name is required' });
        }
        if(!lastName)
        {
            return res.status(400).json({ message: 'Patient new last name is required' });
        }
        if(!birthdate)
        {
            return res.status(400).json({ message: 'Patient new birthdate is required' });
        }
        if(!telephone)
        {
            return res.status(400).json({ message: 'Patient new telephone is required' });
        }
        if(!mail)
        {
            return res.status(400).json({ message: 'Patient new mail is required' });
        }
        if(!type)
        {
            return res.status(400).json({ message: 'Patient new type is required' });
        }
        const em = await getORM().em.fork();
        const patient = await em.findOne(Patient, {idPatient: id});

        if(!Patient)
        {
            return res.status(400).json({ message: 'Patient not found' });
        }

        Patient.firstName = name;
        Patient.lastName = lastName;
        Patient.birthdate = birthdate;
        Patient.telephone = telephone;
        Patient.mail = mail;
        Patient.type = type;

        await em.persistAndFlush(Patient);

        res.status(201).json({ message: 'Patient updated', Patient });
    }

    static async getPatient(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Patient id is required' });
        }
        try {
            const em = await getORM().em.fork();
            const patient = await em.findOne(Patient, { idPatient: id });
            if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
            }
            res.json(Patient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Patient' });
        }
    }

    static async getPatients(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const Patients = await em.find(Patient, {});
            res.json(Patients);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Patients' });
        }
    }

    static async deletePatient(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Patient id is required' });
        }
        try {

            const em = await getORM().em.fork();
            const patient = await em.findOne(Patient, { idPatient : id });

            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }

            await em.removeAndFlush(Patient);
            res.json(Patient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete Patient' });
        }
    }


}