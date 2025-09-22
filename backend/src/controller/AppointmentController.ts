import { Request, Response } from 'express';
import { getORM } from '../orm/db';
import { Appointment } from '../model/entities/Appointment';
import { Patient } from '../model/entities/Patient';
import { Professional } from '../model/entities/Professional';
import { LegalGuardian } from '../model/entities/LegalGuardian';
import { HealthInsurance } from '../model/entities/HealthInsurance';

export class AppointmentController {

    static home(req: Request, res: Response) {
        res.send('Soy el controlador de ocupaciones!');
    }

    static async addAppointment(req: Request, res: Response) {
        const { description, idProfessional, idPatient, idHealthInsurance, idLegalGuardian} = req.body;

        if (!description) {
            return res.status(400).json({ message: 'Se requiere una descripción valida' }); //Esto es el horario estimo, corregir
        }
        if (!idProfessional) {
            return res.status(400).json({ message: 'Se requiere Id del profesional asignado' });
        }
        if(!idPatient) {
            return res.status(400).json({ message: 'Se requiere Id del paciente solicitante' });
        }

        try {
            const em = await getORM().em.fork();

            let patient = await em.findOne(Patient, { idPatient: idPatient });
            if(!patient) {
                return res.status(404).json({ message: 'El ID de paciente ingresado no es valido' });
            }

            let professional = await em.findOne(Professional, { id: idProfessional});
            if(!professional) {
                return res.status(404).json({ message: 'El ID de profesional ingresado no es valido' });
            }

            //EVALUAR SI ESTO HAY QUE PASARLO POR ID O SACARLO DEL PACIENTE/PROFESIONAL, ej: patient.currentHealthInsurance()
            let healthInsurance = await em.findOne(HealthInsurance, { idHealthInsurance: idHealthInsurance});
            if(!healthInsurance) {
                return res.status(404).json({ message: 'El ID de obra social ingresado no es valido' });
            }

            let legalGuardian: LegalGuardian | undefined;
            legalGuardian = patient.legalGuardian;

            const appointment = new Appointment(description, professional, patient, healthInsurance, legalGuardian);
            
            
            await em.persistAndFlush(appointment);

            res.status(201).json({ message: 'Appointment added', appointment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add appointment' });
        }
    }

    static async updateAppointment(req: Request, res: Response) {
        const { id } = req.body;
        const { description } = req.body;

        if(!id)
        {
            return res.status(400).json({ message: 'Appointment id is required' });
        }
        if(!description)
        {
            return res.status(400).json({ message: 'Appointment new name is required' });
        }

        const em = await getORM().em.fork();
        const appointment = await em.findOne(Appointment, { id: id });

        if(!appointment)
        {
            return res.status(400).json({ message: 'Appointment not found' });
            // throw new Error("Ocupacion no encontrada");
        }

        appointment.description = description;

        await em.persistAndFlush(Appointment);

        res.status(201).json({ message: 'Appointment updated', appointment });
    }

    static async getAppointment(req: Request, res: Response) {
        const id = Number(req.params.id);

        if (!id) {
            return res.status(400).json({ message: 'Appointment id is required' });
        }
        try {
            const em = await getORM().em.fork();
            const appointment = await em.findOne(Appointment, { id: id });
            if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
            }
            res.json(appointment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch appointment' });
        }
    }

    static async getAppointments(req: Request, res: Response) {
        try {
            const em = await getORM().em.fork();
            const appointments = await em.find(Appointment, {});
            res.json(appointments);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to fetch appointments' });
        }
    }

    static async deleteAppointment(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: 'Appointment id is required' });
        }
        try {

            const em = await getORM().em.fork();
            const appointment = await em.findOne(Appointment, id);

            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            await em.removeAndFlush(appointment);
            res.json(appointment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete appointment' });
        }
    }


}