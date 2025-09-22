import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Patient } from '../model/entities/Patient';
import { LegalGuardian } from '../model/entities/LegalGuardian';

export class PatientController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de pacientes!');
    }

    static async addPatient(req: Request, res: Response) {
        const { name, lastName, birthdate, telephone, mail, legalGuardianId } = req.body;

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

        try {            
            
            let legalGuardian: LegalGuardian | undefined;
            const em = await getORM().em.fork();
            if(legalGuardianId) {
                const legalGuardianIdNum = Number(legalGuardianId);
                legalGuardian = await em.findOne(LegalGuardian, { idLegalGuardian: legalGuardianIdNum }) ?? undefined; //Si devuelve null lo paso a undefined para que no se queje TS
                if(!legalGuardian) {
                    return res.status(404).json({ message: 'ID del responsable legal invalida.' });
                }
            }

            const patient = new Patient(name, lastName, birthdate, telephone, mail, legalGuardian);
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

        if(!patient)
        {
            return res.status(400).json({ message: 'Patient not found' });
        }

        patient.firstName = name;
        patient.lastName = lastName;
        patient.birthdate = birthdate;
        patient.telephone = telephone;
        patient.mail = mail;

        await em.persistAndFlush(patient);

        res.status(201).json({ message: 'Patient updated', patient });
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
            res.json(patient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch Patient' });
        }
    }

    static async getPatients(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const patients = await em.find(Patient, {});
            res.json(patients);

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

            await em.removeAndFlush(patient);
            res.json(patient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete Patient' });
        }
    }


}