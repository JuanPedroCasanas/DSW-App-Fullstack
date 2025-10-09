import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Patient } from '../model/entities/Patient';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { createUser } from '../services/UserCreationService';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { BaseHttpError, NotFoundError } from '../model/errors/BaseHttpError';

export class PatientController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de pacientes!');
    }

    //Para pacientes que no dependen de un responsable legal, se les crea usuario para acceder
    static async addIndependentPatient(req: Request, res: Response) {
        const { name, lastName, birthdate, password, telephone, mail, healthInsuranceId} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Se requiere nombre' });
        }
        if (!lastName) {
            return res.status(400).json({ message: 'Se requiere apellido' });
        }
        if (!birthdate) {
            return res.status(400).json({ message: 'Se requiere una fecha de nacimiento valida' });
        }   
        if (!telephone) {
            return res.status(400).json({ message: 'Se requiere un telefono valido' });
        }
        if (!mail) {
            return res.status(400).json({ message: 'Se requiere un email valido' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Se requiere una contraseña valida' });
        }
        if (!healthInsuranceId) {
            return res.status(400).json({ message: 'Se requiere una Id de obra social valida' });
        }


        try {            
            const em = await getORM().em.fork();

            const healthInsurance: HealthInsurance | undefined = await em.findOne(HealthInsurance, { idHealthInsurance: healthInsuranceId}) ?? undefined;
           
            if(!healthInsurance) {
                throw new NotFoundError("Obra social");
            }

            const patient = new Patient(name, lastName, birthdate, healthInsurance, telephone);
            const patUser = await createUser(mail, password);
            patient.user = patUser;
            patUser.patient = patient;
            await em.persistAndFlush(patUser);

            res.status(201).json({ message: 'Se agrego correctamente el paciente', patient });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al agregar el paciente' });
            }
        }
    }

    //Para pacientes que dependen de un responsable legal, sin usuario ni info de contacto
    static async addDependentPatient(req: Request, res: Response) {
            const { name, lastName, birthdate, legalGuardianId } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'Se requiere nombre' });
            }
            if (!lastName) {
                return res.status(400).json({ message: 'Se requiere apellido' });
            }
            if (!birthdate) {
                return res.status(400).json({ message: 'Se requiere una fecha de nacimiento valida' });
            }   
            if (!legalGuardianId) {
                return res.status(400).json({ message: 'Se requiere una ID de responsable legal valida' });
            }

            try {            
            
                const em = await getORM().em.fork();

                let legalGuardian = await em.findOne(LegalGuardian, { idLegalGuardian: legalGuardianId });
                if(!legalGuardian) {
                    throw new NotFoundError("Responsable legal");
                }

                const patient = new Patient(name, lastName, birthdate, legalGuardian.healthInsurance, undefined, legalGuardian);

                //Si no se aclara contraseña, entonces este metodo fue llamado para añadir a un paciente dependiente de un resp legal, que no requiere usuario
                await em.persistAndFlush(patient);
                

                res.status(201).json({ message: 'Se añadió correctamente al paciente', patient});
            } catch (error) {
                console.error(error);
                if (error instanceof BaseHttpError) {
                    return res.status(error.status).json(error.toJSON());
                }
                else {
                    res.status(500).json({ message: 'Error al agregar al paciente' });
                }
            }
        }

    static async updatePatient(req: Request, res: Response) {
        const { id } = req.body;
        const { name } = req.body;
        const {lastName} = req.body;
        const {birthdate} = req.body;   
        const {telephone} = req.body;
        const {type} = req.body;
        try
        {
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
            if(!type)
            {
                return res.status(400).json({ message: 'Patient new type is required' });
            }
            const em = await getORM().em.fork();
            const patient = await em.findOne(Patient, {idPatient: id});

            if(!patient)
            {
                throw new NotFoundError("Paciente")
            }

            patient.firstName = name;
            patient.lastName = lastName;
            patient.birthdate = birthdate;
            patient.telephone = telephone;

            await em.flush();

            res.status(201).json({ message: 'Los datos del paciente fueron actualizados', patient });
        }
        catch (error){
                console.error(error);
                if (error instanceof BaseHttpError) {
                    return res.status(error.status).json(error.toJSON());
                }
                else {
                    res.status(500).json({ message: 'Error al modificar el paciente' });
                }
        }
    }

    static async getPatient(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Se requiere la ID del paciente' });
        }
        try {
            const em = await getORM().em.fork();
            const patient = await em.findOne(Patient, { idPatient: id });
            if (!patient) {
                throw new NotFoundError("Paciente")
            }
            res.json(patient);
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                res.status(500).json({ message: 'Error al buscar el paciente' });
            }
        }
    }

    static async getPatients(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const patients = await em.find(Patient, {});
            res.json(patients);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error al buscar los pacientes' });
        }
    }

    static async deletePatient(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Se requiere la id del paciente' });
        }
        try {

            const em = await getORM().em.fork();
            const patient = await em.findOne(Patient, { idPatient : id });

            if (!patient) {
                throw new NotFoundError("Paciente");
            }

            patient.isActive = false;
            
            if (patient.user) {
            patient.user.isActive = false;
            }

            await em.flush();
            res.json(patient);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar el paciente' });
        }
    }


}