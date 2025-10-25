import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Patient } from '../model/entities/Patient';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { createUser } from '../services/UserCreationService';
import { HealthInsurance } from '../model/entities/HealthInsurance';
import { BaseHttpError, NotFoundError } from '../model/errors/BaseHttpError';
import { AppointmentStatus } from '../model/enums/AppointmentStatus';
import { safeSerialize } from '../utils/safeSerialize';

export class PatientController {

    static home(req: Request, res: Response) {
        return res.send('Soy el controlador de pacientes!');
    }

    //Para pacientes que no dependen de un responsable legal, se les crea usuario para acceder
    static async addIndependentPatient(req: Request, res: Response) {
        const { firstName, lastName, birthdate, password, telephone, mail, idHealthInsurance} = req.body;

        if (!firstName) {
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
        if (!idHealthInsurance) {
            return res.status(400).json({ message: 'Se requiere una Id de obra social valida' });
        }


        try {            
            const em = await getORM().em.fork();

            const healthInsurance: HealthInsurance | undefined = await em.findOne(HealthInsurance, { id: idHealthInsurance}) ?? undefined;
           
            if(!healthInsurance) {
                throw new NotFoundError("Obra social");
            }

            const patient = new Patient(firstName, lastName, birthdate, healthInsurance,  telephone);
            const patUser = await createUser(mail, password);
            patient.user = patUser;
            patUser.patient = patient;
            await em.persistAndFlush(patUser);

            return res.status(201).json({ message: 'Se agrego correctamente el paciente', patient: safeSerialize(patient) });
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al agregar el paciente' });
            }
        }
    }

    //Para pacientes que dependen de un responsable legal, sin usuario ni info de contacto
    static async addDependentPatient(req: Request, res: Response) {
            const { firstName, lastName, birthdate, idLegalGuardian } = req.body;

            if (!firstName) {
                return res.status(400).json({ message: 'Se requiere nombre' });
            }
            if (!lastName) {
                return res.status(400).json({ message: 'Se requiere apellido' });
            }
            if (!birthdate) {
                return res.status(400).json({ message: 'Se requiere una fecha de nacimiento valida' });
            }   
            if (!idLegalGuardian) {
                return res.status(400).json({ message: 'Se requiere una ID de responsable legal valida' });
            }

            try {            
            
                const em = await getORM().em.fork();

                let legalGuardian = await em.findOne(LegalGuardian, { id: idLegalGuardian });
                if(!legalGuardian) {
                    throw new NotFoundError("Responsable legal");
                }

                const patient = new Patient(firstName, lastName, birthdate, legalGuardian.healthInsurance, undefined, legalGuardian);

                //Si no se aclara contraseña, entonces este metodo fue llamado para añadir a un paciente dependiente de un resp legal, que no requiere usuario
                await em.persistAndFlush(patient);
                

                return res.status(201).json({ message: 'Se añadió correctamente al paciente', patient: safeSerialize(patient)});
            } catch (error) {
                console.error(error);
                if (error instanceof BaseHttpError) {
                    return res.status(error.status).json(error.toJSON());
                }
                else {
                    return res.status(500).json({ message: 'Error al agregar al paciente' });
                }
            }
        }

    
    static async updateIndependentPatient(req: Request, res: Response) {
        const { idPatient } = req.body;
        const { firstName } = req.body;
        const { lastName } = req.body;
        const { birthdate } = req.body;   
        const { telephone } = req.body;
        const { idHealthInsurance } = req.body;
        try
        {
            if(!idPatient) {
                return res.status(400).json({ message: 'Se requiere la ID del paciente a modificar' });
            }
            if(!firstName) {
                return res.status(400).json({ message: 'Se requiere el nuevo nombre del paciente' });
            }
            if(!lastName) {
                return res.status(400).json({ message: 'Se requiere el nuevo apellido del paciente' });
            }
            if(!birthdate) {
                return res.status(400).json({ message: 'Se requiere la nueva fecha de nacimiento del paciente' });
            }
            if(!telephone) {
                return res.status(400).json({ message: 'Se requiere el nuevo telefono del paciente' });
            }
            if(!idHealthInsurance) {
                return res.status(400).json({ message: 'Se requiere la nueva OS del paciente' });
            }
            const em = await getORM().em.fork();
            const patient = await em.findOne(Patient, {id: idPatient});

            if(!patient|| !patient?.isActive) {
                throw new NotFoundError("Paciente")
            }

            const healthInsurance = await em.findOne(HealthInsurance, {id: idHealthInsurance });
            if(!healthInsurance|| !healthInsurance?.isActive) {
                throw new NotFoundError("Obra social")
            }

            patient.firstName = firstName;
            patient.lastName = lastName;
            patient.birthdate = birthdate;
            patient.telephone = telephone;
            patient.healthInsurance = healthInsurance;

            await em.flush();

            return res.status(201).json({ message: 'Los datos del paciente fueron actualizados', patient: safeSerialize(patient) });
        }
        catch (error){
                console.error(error);
                if (error instanceof BaseHttpError) {
                    return res.status(error.status).json(error.toJSON());
                }
                else {
                    return res.status(500).json({ message: 'Error al modificar el paciente' });
                }
        }
    }

    static async updateDependentPatient(req: Request, res: Response) {
        const { idPatient } = req.body;
        const { firstName } = req.body;
        const { lastName } = req.body;
        const { birthdate } = req.body;   
        try {
            if(!idPatient) {
                return res.status(400).json({ message: 'Se requiere la ID del paciente a modificar' });
            }
            if(!firstName) {
                return res.status(400).json({ message: 'Se requiere el nuevo nombre del paciente' });
            }
            if(!lastName) {
                return res.status(400).json({ message: 'Se requiere el nuevo apellido del paciente' });
            }
            if(!birthdate) {
                return res.status(400).json({ message: 'Se requiere la nueva fecha de nacimiento del paciente' });
            }
            const em = await getORM().em.fork();
            const patient = await em.findOne(Patient, {id: Number(idPatient)});

            if(!patient|| !patient?.isActive) {
                throw new NotFoundError("Paciente")
            }

            patient.firstName = firstName;
            patient.lastName = lastName;
            patient.birthdate = birthdate;

            await em.flush();

            return res.status(201).json({ message: 'Los datos del paciente fueron actualizados', patient: safeSerialize(patient) });
        }
        catch (error){
                console.error(error);
                if (error instanceof BaseHttpError) {
                    return res.status(error.status).json(error.toJSON());
                }
                else {
                    return res.status(500).json({ message: 'Error al modificar el paciente' });
                }
        }
    }

    static async getPatient(req: Request, res: Response) {
        const idPatient = Number(req.params.id);

        if (!idPatient      ) {
            return res.status(400).json({ message: 'Se requiere la ID del paciente' });
        }
        try {
            const em = await getORM().em.fork();
            const patient = await em.findOne(Patient, { id: idPatient });
            if (!patient|| !patient?.isActive) {
                throw new NotFoundError("Paciente")
            }
            return res.status(200).json(safeSerialize(patient));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar el paciente' });
            }
        }
    }

    static async getPatients(req: Request, res: Response) {
        let includeInactive:boolean;
        if (req.query.includeInactive === undefined) {
            includeInactive = true;
        } else {
            includeInactive = req.query.includeInactive === 'true'; 
            // true si el string es 'true', false si es cualquier otra cosa
        }
        try {
            const em = await getORM().em.fork();
            const whereCondition = (includeInactive) ? {} : {isActive: true};
            const patients = await em.find(Patient, whereCondition);
            return res.status(200).json(safeSerialize(patients));

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al buscar los pacientes' });
        }
    }

    static async getByLegalGuardian(req: Request, res: Response) {
        const idLegalGuardian = Number(req.params.id);
        let includeInactive:boolean;
        if (!req.query || req.query.includeInactive === undefined) {
            includeInactive = true;
        } else {
            includeInactive = req.query.includeInactive === 'true'; 
            // true si el string es 'true', false si es cualquier otra cosa
        }
        try {
            const em = await getORM().em.fork();
            const legalGuardian = await em.findOne(LegalGuardian, { id: idLegalGuardian });
            if(!legalGuardian || !legalGuardian.isActive) {
                throw new NotFoundError('Responsable Legal');
            }

            const whereCondition = (includeInactive) ? { legalGuardian: legalGuardian } : { legalGuardian: legalGuardian, isActive: true };
            const patients = await em.find(Patient, whereCondition);
            return res.status(200).json(safeSerialize(patients));

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al buscar los pacientes por responsable legal' });
        }
    }

    static async deletePatient(req: Request, res: Response) {
        const idPatient = Number(req.params.id);
        if (!idPatient) {
            return res.status(400).json({ message: 'Se requiere la id del paciente' });
        }
        try {

            const em = await getORM().em.fork();
            const patient = await em.findOne(Patient, { id : idPatient });

            if (!patient || !patient?.isActive) {
                throw new NotFoundError("Paciente")
            }

            patient.isActive = false;
            
            if (patient.user) {
                patient.user.isActive = false;
            }

            await patient.appointments.init();

            for (const appointment of patient.appointments) {
                appointment.status = AppointmentStatus.Canceled;
            }

            await em.flush();
            return res.status(200).json(safeSerialize(patient));
        } catch (error) {
            console.error(error);
            if (error instanceof BaseHttpError) {
                return res.status(error.status).json(error.toJSON());
            }
            else {
                return res.status(500).json({ message: 'Error al buscar el paciente' });
            }
        }
    }


}